from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from urllib.parse import quote_plus
from pathlib import Path
import sys

load_dotenv()

password = os.getenv("DATABASE_PASSWORD")
if password is None:
    raise ValueError("DATABASE_PASSWORD environment variable is not set")

password = quote_plus(password)

DATABASE_URL = (
    f"mysql+pymysql://admin:{password}"
    "@db-facial-rekognition.cev0ik84cikw.us-east-1.rds.amazonaws.com:3306/rekognition"
)

# 🔥 Detectar ambiente y configurar SSL
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

def get_ssl_config():
    """Configurar SSL según ambiente y disponibilidad de certificado"""
    
    if ENVIRONMENT == "production":
        # Docker: ruta absoluta
        return {"ssl": {"ca": "/certs/global-bundle.pem"}}
    
    # Desarrollo local: buscar certificado
    BASE_DIR = Path(__file__).resolve().parent.parent.parent
    SSL_CERT = BASE_DIR / "certs" / "global-bundle.pem"
    
    print(f"🔍 Buscando certificado SSL en: {SSL_CERT}")
    
    if SSL_CERT.exists():
        print(f"✅ Certificado encontrado")
        return {"ssl": {"ca": str(SSL_CERT)}}
    else:
        print(f"⚠️ Certificado no encontrado, deshabilitando SSL")
        print(f"💡 Descarga el certificado con:")
        print(f"   curl -o {SSL_CERT} https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem")
        return {"ssl_disabled": True}

connect_args = get_ssl_config()

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Test de conexión (opcional - comentar en producción)
if __name__ == "__main__":
    try:
        with engine.connect() as conn:
            print("✅ Conexión a base de datos exitosa!")
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        sys.exit(1)