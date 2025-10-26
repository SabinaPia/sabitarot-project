# Imagen base
FROM python:3.12-alpine

# Evitar archivos .pyc y habilitar salida en tiempo real
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Establecer directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema necesarias para Postgres
RUN apk add --no-cache gcc musl-dev postgresql-dev

# Copiar requirements.txt e instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el directorio de la aplicación
COPY app/ ./app

# Exponer el puerto de FastAPI
EXPOSE 8000

# Comando para iniciar la aplicación en producción
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
