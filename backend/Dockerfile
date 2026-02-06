FROM python:3.11-slim

WORKDIR /app

# 🔐 Instalar certificados del sistema (IMPORTANTE para SSL)
RUN apt-get update && apt-get install -y ca-certificates && update-ca-certificates

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 📜 Copiar certificados
COPY certs ./certs

# 📦 Copiar app
COPY app ./app
COPY recognition.db ./recognition.db

EXPOSE 8099

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8099"]