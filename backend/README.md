# Backend — Facil Rekognition

API REST para el sistema de control de asistencia por reconocimiento facial. Construida con FastAPI siguiendo una arquitectura en capas (controllers → services → repositories → models).

---

## Arquitectura en capas

```
controllers/   ← Routers FastAPI: reciben HTTP, validan con Pydantic, llaman a services
    ↓
services/      ← Lógica de negocio: orquesta repositorios + servicios externos (Rekognition)
    ↓
repositories/  ← Acceso a datos: consultas SQLAlchemy sobre los modelos ORM
    ↓
models/        ← Definición de tablas (SQLAlchemy declarative)
```

Módulos de soporte:

| Módulo | Descripción |
|---|---|
| `config/db_config.py` | Engine SQLAlchemy. Selecciona SQLite (dev) o MySQL RDS (prod) según `ENVIRONMENT` |
| `dependencie/` | Dependencias inyectables de FastAPI: sesión DB, usuario actual (JWT), guard de roles |
| `schemas/` | Schemas Pydantic para request bodies y response models |
| `security/hash_service.py` | Hashing de contraseñas con Argon2 |
| `security/token_service.py` | Creación y verificación de tokens JWT (HS256). Lee `JWT_SECRET_KEY` de entorno |

---

## Referencia de endpoints

Todos los endpoints tienen el prefijo `/api`. La documentación interactiva (Swagger UI) está disponible en `http://localhost:8000/docs`.

### `/api/users`

| Método | Path | Auth | Body | Respuesta |
|---|---|---|---|---|
| `POST` | `/api/users/registerUser` | No | `multipart/form-data`: `name`, `email`, `password`, `role_id`, `area_id`, `place_id`, `image` (archivo) | `UserResponse` |
| `POST` | `/api/users/searchUserByFace` | No | `multipart/form-data`: `image` (archivo) | `SessionData` (JWT) |
| `POST` | `/api/users/loginManually` | No | `form`: `username` (email), `password` | `SessionData` (JWT) |
| `GET` | `/api/users/getAllUsers` | JWT · admin | — | `List[UserResponse]` |
| `GET` | `/api/users/getProfile` | JWT | — | `UserResponse` |
| `GET` | `/api/users/getUserById/{user_id}` | JWT · admin | — | `UserResponse` |

### `/api/attendance`

| Método | Path | Auth | Body | Respuesta |
|---|---|---|---|---|
| `POST` | `/api/attendance/registerEntrance` | JWT | `multipart/form-data`: `image`, `place_id` (form) | `AttendanceResponse` |
| `POST` | `/api/attendance/registerExit` | JWT | `multipart/form-data`: `image` | `AttendanceResponse` |
| `GET` | `/api/attendance/getMyAttendance` | JWT | — | `List[AttendanceResponse]` |
| `GET` | `/api/attendance/getAttendanceByUserId/{user_id}` | JWT · admin | — | `List[AttendanceResponse]` |
| `GET` | `/api/attendance/getAllAttendance` | JWT · admin | — | `List[AttendanceResponse]` |
| `GET` | `/api/attendance/getActualAttendance` | JWT | — | `AttendanceResponse` |
| `POST` | `/api/attendance/createReportAttendance` | JWT · admin | `JSON`: `{ start_date, end_date, user_id? }` | `StreamingResponse` (.xlsx) |

### `/api/areas`

| Método | Path | Auth | Body | Respuesta |
|---|---|---|---|---|
| `POST` | `/api/areas/createArea` | No | `JSON`: `{ name }` | `AreaResponse` |
| `GET` | `/api/areas/getAreaById/{area_id}` | No | — | `AreaResponse` |
| `GET` | `/api/areas/getAllAreas` | No | — | `List[AreaResponse]` |

### `/api/places`

| Método | Path | Auth | Body | Respuesta |
|---|---|---|---|---|
| `POST` | `/api/places/createPlace` | No | `JSON`: `{ name, latitude, longitude, radius_meters }` | `PlaceResponse` |
| `GET` | `/api/places/getPlaceById/{place_id}` | No | — | `PlaceResponse` |
| `GET` | `/api/places/getAllPlaces` | No | — | `List[PlaceResponse]` |

### `/api/roles`

| Método | Path | Auth | Body | Respuesta |
|---|---|---|---|---|
| `POST` | `/api/roles/createRole` | No | `JSON`: `{ name }` | `RoleResponse` |
| `GET` | `/api/roles/getRoleById/{role_id}` | No | — | `RoleResponse` |
| `GET` | `/api/roles/getAllRoles` | No | — | `List[RoleResponse]` |

### `/api/rekognition` (utilidades admin)

| Método | Path | Auth | Body | Respuesta |
|---|---|---|---|---|
| `POST` | `/api/rekognition/createCollection` | No | `form`: `collection_id` | `{ message }` |
| `DELETE` | `/api/rekognition/deleteCollection` | No | `form`: `collection_id` | `{ message }` |

### Otros

| Método | Path | Auth | Descripción |
|---|---|---|---|
| `GET` | `/health` | No | Health check: `{ "status": "ok" }` |

---

## Flujo AWS Rekognition

### Registro de empleado (`POST /api/users/registerUser`)

```
Cliente envía imagen (multipart)
    │
    ▼
UserService.register_user()
    ├── 1. search_faces_by_image(image_bytes)
    │       → Si encuentra match → HTTP 409 (rostro ya registrado)
    │
    ├── 2. RekognitionService.create_collection(collection_id)
    │       → Idempotente: ignora ResourceAlreadyExistsException
    │
    ├── 3. RekognitionService.index_face(collection_id, image_bytes, external_image_id)
    │       → Devuelve FaceId de AWS
    │
    └── 4. UserRepository.create_user(... face_id=<FaceId de AWS> ...)
            → Persiste usuario en DB
```

### Fichaje de entrada (`POST /api/attendance/registerEntrance`)

```
Cliente envía imagen + place_id (JWT requerido)
    │
    ▼
AttendanceService.register_entrance()
    ├── 1. RekognitionService.search_face(collection_id, image_bytes, threshold=80)
    │       → Devuelve FaceId del match (o None)
    │
    ├── 2. UserRepository.get_user_by_face_id(returned_face_id)
    │       → Verifica que el FaceId coincida con el usuario autenticado
    │
    └── 3. AttendanceRepository.create_attendance(user_id, place_id, work_date, entry_time)
            → Crea registro de asistencia
```

### Fichaje de salida (`POST /api/attendance/registerExit`)

```
Igual que entrada, pero:
    └── AttendanceRepository.update_exit(attendance_id, exit_time)
            → Actualiza exit_time y calcula total_hours
```

**Parámetros Rekognition**: umbral de similitud `80%`, máximo `1` resultado por búsqueda. Las imágenes se envían como `bytes` directos; **no se usa S3**.

---

## Esquema de base de datos

```
roles
  id         INT PK AUTO_INCREMENT
  name       VARCHAR(100) UNIQUE NOT NULL

areas
  id         INT PK AUTO_INCREMENT
  name       VARCHAR(500) UNIQUE NOT NULL

places
  id             INT PK AUTO_INCREMENT
  name           VARCHAR(100) UNIQUE NOT NULL
  latitude       VARCHAR(100) NOT NULL
  longitude      VARCHAR(100) NOT NULL
  radius_meters  INT DEFAULT 50        ← geofencing (no aplicado en lógica de negocio)

users
  user_id       VARCHAR(100) PK        ← UUID v4
  name          VARCHAR(100) UNIQUE NOT NULL
  email         VARCHAR(100) UNIQUE NOT NULL
  password_hash VARCHAR(100) NULLABLE  ← nullable: usuarios solo-facial
  role_id       INT FK → roles.id
  area_id       INT FK → areas.id
  place_id      INT FK → places.id
  face_id       VARCHAR(100) UNIQUE NOT NULL  ← FaceId de AWS Rekognition

attendance
  id            INT PK AUTO_INCREMENT
  user_id       VARCHAR(100) FK → users.user_id NOT NULL
  place_id      INT FK → places.id NOT NULL
  work_date     DATE NOT NULL
  entry_time    TIME NOT NULL
  exit_time     TIME NULLABLE
  total_hours   FLOAT NULLABLE
  face_verified VARCHAR(100) DEFAULT 'yes'
```

> El campo `face_verified` almacena el FaceId retornado por Rekognition (no un booleano). Es un artefacto de la implementación; semánticamente indica que la entrada fue verificada por reconocimiento facial.

---

## Setup local (SQLite)

```bash
# Desde la raíz del repositorio, en la rama facial_dev
cd backend

# Entorno virtual
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate

# Dependencias
pip install -r requirements.txt

# Variables de entorno
cp .env.example .env
# Editar .env: definir JWT_SECRET_KEY como mínimo obligatorio
# Para reconocimiento facial: agregar credenciales AWS

# Iniciar servidor
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Con Docker Compose (incluye recarga en caliente por volumen):

```bash
cd backend
docker compose up --build
```

> En modo `development` (default) se usa SQLite (`recognition.db` en la raíz de `backend/`). Las tablas se crean automáticamente al iniciar.

---

## Setup producción (MySQL RDS + Docker)

```bash
# Desde la raíz del repositorio
# Variables de entorno necesarias en .env:
#   ENVIRONMENT=production
#   DATABASE_PASSWORD=<password RDS>
#   JWT_SECRET_KEY=<clave generada>
#   AWS_ACCESS_KEY_ID=<clave IAM>
#   AWS_SECRET_ACCESS_KEY=<secreto IAM>
#   AWS_DEFAULT_REGION=us-east-1
#   REKOGNITION_COLLECTION_ID=users_collection

docker compose up --build
```

El SSL con RDS requiere el certificado `backend/certs/global-bundle.pem`. En producción (ECS), las credenciales AWS se proveen vía IAM Task Role (no env vars).

---

## Variables de entorno

| Variable | Requerida | Default | Descripción |
|---|---|---|---|
| `ENVIRONMENT` | No | `development` | `development` → SQLite · `production` → MySQL RDS |
| `JWT_SECRET_KEY` | **Sí** | — | Clave de firma JWT (HS256). Sin esta variable el servidor **no inicia** (`RuntimeError`). Generar con `openssl rand -base64 64` |
| `AWS_ACCESS_KEY_ID` | En prod | — | Credencial IAM de AWS. En ECS se usa IAM Task Role (no necesita env var) |
| `AWS_SECRET_ACCESS_KEY` | En prod | — | Secreto de la credencial IAM |
| `AWS_DEFAULT_REGION` | No | `us-east-1` (hardcoded en `RekognitionService`) | Región de AWS Rekognition |
| `REKOGNITION_COLLECTION_ID` | En prod | — | ID de la colección Rekognition. En el código de servicios está hardcodeado como `"users_collection"` |
| `DATABASE_PASSWORD` | Solo en prod | — | Password del usuario `admin` en RDS MySQL |

> `JWT_SECRET_KEY` se lee con `os.getenv("JWT_SECRET_KEY")` en `app/security/token_service.py`. Si la variable no está definida, el servidor lanza `RuntimeError` al arrancar — es un fail-fast intencional.

---

## Dependencias principales

```
fastapi          — framework web
uvicorn          — servidor ASGI
sqlalchemy       — ORM
pydantic         — validación de schemas
boto3            — cliente AWS (Rekognition)
python-jose      — JWT (HS256)
passlib + argon2-cffi — hashing de contraseñas (Argon2)
openpyxl + pandas — generación de reportes Excel
pymysql          — driver MySQL (producción)
python-dotenv    — carga de .env
pillow           — importado (procesamiento de imagen vía Rekognition bytes)
python-multipart — uploads de archivos en FastAPI
```

---

## Limitaciones conocidas

- **Sin Alembic**: el esquema se gestiona con `Base.metadata.create_all()`. No hay migraciones — cambios en modelos requieren recrear tablas manualmente en producción.
- **Geofencing no implementado**: `Place` tiene `latitude`, `longitude`, `radius_meters`, pero la lógica de validación de ubicación nunca se aplicó en los endpoints de asistencia.
- **`RekognitionService` instanciado por request**: crea un cliente boto3 nuevo en cada llamada. No es crítico para demo pero sería un singleton en producción real.
- **`datetime.utcnow()` deprecado en Python 3.12+**: `token_service.py` usa `datetime.utcnow()`. Migrar a `datetime.now(timezone.utc)`.
- **CORS abierto**: `allow_origins=["*"]` en `main.py`. Válido para demo, debe restringirse en producción.
