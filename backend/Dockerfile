FROM python:3.12-slim

WORKDIR /app

# Primero solo las dependencias para aprovechar la caché de capas de Docker:
# si el código cambia pero requirements.txt no, esta capa no se reconstruye
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Luego el código de la aplicación
COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
