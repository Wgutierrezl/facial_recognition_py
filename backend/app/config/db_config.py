from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from urllib.parse import quote_plus
from pathlib import Path

load_dotenv()

ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

BASE_DIR = Path(__file__).resolve().parent.parent.parent
SQLITE_PATH = BASE_DIR / "recognition.db"

# =========================
# 🔥 DEVELOPMENT (SQLite)
# =========================
if ENVIRONMENT == "development":
    print("🛠️ Modo DESARROLLO - usando SQLite")

    DATABASE_URL = f"sqlite:///{SQLITE_PATH}"

    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )

# =========================
# 🚀 PRODUCTION (MySQL RDS)
# =========================
else:
    print("🚀 Modo PRODUCCIÓN - usando MySQL RDS")

    password = os.getenv("DATABASE_PASSWORD")
    if password is None:
        raise ValueError("DATABASE_PASSWORD environment variable is not set")

    password = quote_plus(password)

    DATABASE_URL = (
        f"mysql+pymysql://admin:{password}"
        "@db-facial-rekognition.cev0ik84cikw.us-east-1.rds.amazonaws.com:3306/rekognition"
    )

    SSL_CERT = BASE_DIR / "certs" / "global-bundle.pem"

    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=3600,
        connect_args={"ssl": {"ca": str(SSL_CERT)}},
        echo=False
    )

# =========================
# 🔧 Config común
# =========================
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()