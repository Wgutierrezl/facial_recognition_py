# Frontend — Facil Rekognition

App móvil de control de asistencia por reconocimiento facial. Permite a los empleados fichar entrada/salida con su cámara y a los administradores gestionar el sistema.

Construida con React Native vía Expo SDK 54 y expo-router para el enrutamiento basado en archivos.

---

## Stack

| Tecnología | Versión | Rol |
|---|---|---|
| React Native | 0.81.5 | Framework base |
| Expo SDK | ~54.0.31 | Plataforma de build y runtime |
| expo-router | ~6.0.21 | Enrutamiento basado en archivos |
| expo-camera | ~17.0.10 | Captura de imagen facial (`CameraView`, `takePictureAsync`) |
| expo-secure-store | — | Almacenamiento seguro del JWT, rol y userId |
| axios | — | Cliente HTTP con interceptor de JWT (Bearer automático) |
| TypeScript | — | Lenguaje principal |
| @react-navigation/bottom-tabs | — | Navegación por tabs |
| lucide-react-native | — | Iconografía |

> `tailwind.config.js` está presente en el proyecto pero NativeWind no está instalado ni configurado — es configuración muerta de un intento anterior.

---

## Mapa de pantallas

La app usa un único stack de navegación dentro de `app/(tabs)/index.tsx`. Las "pantallas" son componentes de React montados condicionalmente según el estado de autenticación y el rol del usuario.

```
LoginScreen           ← pantalla inicial (siempre)
    │
    ├── [login facial]   → FacialVerification (modo: login)
    │       └── éxito → según rol:
    │               ├── employee → EmployeeDashboard
    │               └── admin   → AdminDashboard
    │
    └── [login manual]   → credenciales email+password
            └── éxito → según rol (igual que arriba)

EmployeeDashboard
    ├── [marcar entrada] → SiteSelection → FacialVerification (modo: asistencia)
    ├── [marcar salida]  → FacialVerification (modo: asistencia)
    └── [ver historial]  → EmployeeHistory

AdminDashboard
    └── Vista de asistencia global + gestión

RegisterScreen
    └── Alta de nuevo empleado con foto facial (solo admin)

FacialVerification    ← modal de captura: abre cámara, toma foto, llama a la API
```

---

## Estructura de archivos

```
frontend/face-recognition-app/
├── app/
│   ├── _layout.tsx              ← Root layout (expo-router)
│   ├── modal.tsx
│   └── (tabs)/
│       ├── _layout.tsx          ← Stack sin header
│       └── index.tsx            ← Entry point: renderiza pantalla según estado auth
├── components/
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── FacialVerification.tsx   ← CameraView + takePictureAsync → API call
│   ├── AdminDashboard.tsx
│   ├── EmployeeDashboard.tsx
│   ├── EmployeeHistory.tsx
│   ├── SiteSelection.tsx
│   └── context/
│       ├── AuthContext.tsx       ← Estado global de usuario autenticado
│       ├── AttendanceContext.tsx ← Estado de asistencia activa
│       └── AdminContext.tsx      ← Datos de administración
├── functions/
│   ├── api_function.ts          ← Instancia axios con baseURL e interceptor JWT
│   ├── users_functions.ts
│   ├── attendance_functions.ts
│   ├── area_functions.ts
│   ├── place_functions.ts
│   ├── role_functions.ts
│   ├── storage.ts               ← Wrapper de expo-secure-store
│   └── models/                  ← Interfaces TypeScript (user, attendance, area, place, role)
├── styles/                      ← StyleSheet por pantalla
├── constants/theme.ts
└── hooks/
```

---

## Variable de entorno

| Variable | Requerida | Descripción |
|---|---|---|
| `URL` | No | URL base del backend **incluyendo** el prefijo `/api`. Si no se define, la app usa una IP de LAN hardcodeada en `functions/api_function.ts`. |

Crear el archivo `.env` en la raíz del proyecto (`frontend/face-recognition-app/.env`):

```env
URL=http://<IP-de-tu-máquina>:8000/api
```

> Expo expone las variables con prefijo `EXPO_PUBLIC_` en SDK 50+. Verificar la compatibilidad con la versión SDK 54 si se usa esa convención. En la versión actual del código se lee directamente `process.env.URL`.

---

## Desarrollo local con Expo Go

```bash
cd frontend/face-recognition-app

# 1. Instalar dependencias
npm install

# 2. Crear archivo de entorno apuntando a tu backend local
echo "URL=http://192.168.1.XX:8000/api" > .env
# Reemplazar XX con la IP real de la máquina que corre el backend
# El teléfono y la máquina deben estar en la misma red Wi-Fi

# 3. Iniciar Metro bundler
npx expo start
```

Escanear el QR con la app **Expo Go** (iOS / Android).

---

## Estado del deploy

El frontend **no tiene un deploy en producción resuelto**.

El enfoque con Docker + Expo no funcionó para producción (la imagen Docker de Expo no sirve para distribución de apps nativas). El backend sí estuvo desplegado en AWS ECS; el frontend se usó vía Expo Go durante el período de demo.

El camino correcto para un deploy futuro es **Expo EAS Build** (genera `.apk` / `.ipa`) con **EAS Update** para actualizaciones OTA.
