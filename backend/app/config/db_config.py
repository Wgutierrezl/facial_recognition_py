from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from urllib.parse import quote_plus

# Cargar variables de entorno desde .env
load_dotenv()

# Obtener la contraseña y validar que existe
password = os.getenv("DATABASE_PASSWORD")
if password is None:
    raise ValueError("DATABASE_PASSWORD environment variable is not set")

password = quote_plus(password)

DATABASE_URL = (
    f"mysql+pymysql://admin:{password}"
    "@db-facial-rekognition.cev0ik84cikw.us-east-1.rds.amazonaws.com:3306/rekognition"
)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    connect_args={
        "ssl": {
            "ca": "C:/Project_Face_AWS/backend/certs/global-bundle.pem"
        }
    }
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()