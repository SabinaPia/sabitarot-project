# 🔮 SABITAROT

Sistema web de lectura de cartas de tarot con arquitectura cloud-native, desplegado en Google Kubernetes Engine (GKE) con infraestructura como código usando OpenTofu.

## 📋 Descripción

SABITAROT es una aplicación web que permite a los usuarios:
- 👤 Registrarse e iniciar sesión
- 🎴 Generar combinaciones aleatorias de cartas de tarot
- 📖 Consultar significados de las cartas
- 💾 Guardar historial de consultas

## 🏗️ Arquitectura

La aplicación está dividida en tres servicios principales que se comunican mediante APIs REST:

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Frontend  │ ───> │   Backend   │ ───> │  PostgreSQL │
│ React+Vite  │      │   FastAPI   │      │   Database  │
└─────────────┘      └─────────────┘      └─────────────┘
```

### Stack Tecnológico

| Componente | Tecnología |
|------------|-----------|
| **Frontend** | React + Vite + Tailwind CSS |
| **Backend** | FastAPI (Python) |
| **Base de datos** | PostgreSQL 16 Alpine |
| **Contenedores** | Docker |
| **Orquestación** | Kubernetes (GKE) |
| **IaC** | OpenTofu (Terraform) |
| **Cloud Provider** | Google Cloud Platform (GCP) |
| **Registry** | Google Artifact Registry |

## 📁 Estructura del Proyecto

```
sabitarot-project/
├── frontend/                    # Aplicación React
│   ├── src/
│   │   ├── assets/             # Recursos estáticos
│   │   ├── pages/
│   │   │   ├── auth.jsx        # Página de autenticación
│   │   │   └── home.jsx        # Página principal
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/                     # API FastAPI
│   ├── app/
│   │   ├── __init__.py
│   │   ├── crud.py             # Operaciones CRUD
│   │   ├── database.py         # Configuración de DB
│   │   ├── main.py             # Punto de entrada
│   │   ├── models.py           # Modelos SQLAlchemy
│   │   └── schemas.py          # Esquemas Pydantic
│   ├── requirements.txt
│   └── Dockerfile
│
├── infra/                       # Infraestructura como código
│   ├── main.tf                 # Configuración principal
│   ├── gke.tf                  # Cluster GKE
│   ├── variables.tf            # Variables
│   └── terraform.tfvars        # Valores de variables
│
├── k8s/                        # Manifiestos Kubernetes
│   ├── backend-deployment.yaml
│   ├── backend-hpa.yaml        # Horizontal Pod Autoscaler
│   ├── db-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── postgres-pvc.yaml       # Persistent Volume Claim
│   └── services.yaml
│
└── docker-compose.yml          # Para desarrollo local
```

## 🚀 Despliegue en GKE

### Prerrequisitos

- Google Cloud SDK (gcloud CLI)
- OpenTofu instalado
- Docker instalado
- kubectl configurado
- Proyecto GCP activo

### Paso 1: Configurar Google Cloud CLI

```bash
# Verificar instalación
gcloud --version

# Configurar proyecto
gcloud config set project main-bloom-476318-f9

# Configurar zona
gcloud config set compute/zone us-central1-a

# Activar API de Kubernetes
gcloud services enable container.googleapis.com
```

### Paso 2: Instalar OpenTofu

**Windows (PowerShell):**
```powershell
winget install --exact --id=OpenTofu.Tofu
tofu version
```

**Linux:**
```bash
sudo dnf install httpd-tools  # o apt-get install apache2-utils
```

### Paso 3: Crear Cluster GKE con OpenTofu

```bash
# Navegar al directorio de infraestructura
cd infra/

# Inicializar OpenTofu
tofu init

# Aplicar configuración
tofu apply
```

**Salida esperada:**
```
Outputs:
cluster_endpoint = "34.121.221.158"
cluster_name = "sabi-cluster"
```

### Paso 4: Crear Artifact Registry

```bash
gcloud artifacts repositories create sabitarot-repo \
  --repository-format=docker \
  --location=us-central1
```

### Paso 5: Configurar Docker para GCP

```bash
gcloud auth configure-docker us-central1-docker.pkg.dev
```

### Paso 6: Construir y Subir Imágenes Docker

**Backend:**
```bash
docker build -t sabitarot-project-backend:latest ./backend
docker tag sabitarot-project-backend:latest \
  us-central1-docker.pkg.dev/main-bloom-476318-f9/sabitarot-repo/sabitarot-project-backend:latest
docker push us-central1-docker.pkg.dev/main-bloom-476318-f9/sabitarot-repo/sabitarot-project-backend:latest
```

**Frontend:**
```bash
docker build -t sabitarot-project-frontend:latest ./frontend
docker tag sabitarot-project-frontend:latest \
  us-central1-docker.pkg.dev/main-bloom-476318-f9/sabitarot-repo/sabitarot-project-frontend:latest
docker push us-central1-docker.pkg.dev/main-bloom-476318-f9/sabitarot-repo/sabitarot-project-frontend:latest
```

**Base de datos:**
```bash
docker pull postgres:16-alpine
docker tag postgres:16-alpine \
  us-central1-docker.pkg.dev/main-bloom-476318-f9/sabitarot-repo/postgres:16-alpine
docker push us-central1-docker.pkg.dev/main-bloom-476318-f9/sabitarot-repo/postgres:16-alpine
```

### Paso 7: Desplegar en Kubernetes

```bash
# Aplicar todos los manifiestos
kubectl apply -f k8s/

# Verificar despliegue
kubectl get pods,services

# Verificar autoescalado
kubectl get hpa
```

## 📊 Pruebas de Carga y Autoescalado

### Instalación de Apache Bench

**Windows:**
```powershell
# Instalar con herramientas HTTP
```

**Linux:**
```bash
sudo dnf install httpd-tools
# o
sudo apt-get install apache2-utils
```

### Prueba 1: Carga contra Backend

```bash
# Carga ligera
ab -n 1000 -c 20 "http://{IP_FRONTEND}/api/items"

# Carga pesada
ab -n 5000 -c 30 "http://{IP_FRONTEND}/api/items"
```

**Resultado esperado:**
- El HPA detecta CPU > 50%
- Escala de 1 a 3 réplicas automáticamente

### Prueba 2: Monitoreo en Tiempo Real

```bash
# Observar creación de pods
kubectl get pods --watch

# Ver estado del HPA
kubectl get hpa --watch
```

### Métricas de Autoescalado

| Servicio | Réplicas Iniciales | Réplicas Máximas | Umbral CPU |
|----------|-------------------|------------------|------------|
| Backend | 1 | 3 | 50% |
| Frontend | 1 | 3 | 50% |

## 🔧 Desarrollo Local

### Usando Docker Compose

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

### Desarrollo Frontend

```bash
cd frontend/
npm install
npm run dev
```

### Desarrollo Backend

```bash
cd backend/
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 🌐 Endpoints de la API

### Autenticación
- `POST /api/register` - Registro de usuarios
- `POST /api/login` - Inicio de sesión

### Tarot
- `GET /api/cards` - Obtener todas las cartas
- `GET /api/cards/random` - Obtener cartas aleatorias
- `GET /api/cards/{id}` - Obtener carta específica
- `POST /api/readings` - Guardar lectura
- `GET /api/readings` - Historial de lecturas

## 📝 Variables de Entorno

### Backend
```env
DATABASE_URL=postgresql://user:password@db:5432/sabitarot
SECRET_KEY=your-secret-key
ALGORITHM=HS256
```

### Frontend
```env
VITE_API_URL=http://localhost:8000
```

## 🛡️ Seguridad

- Autenticación JWT
- Contraseñas hasheadas con bcrypt
- Variables de entorno para secretos
- CORS configurado
- Secrets de Kubernetes para datos sensibles

## 📈 Monitoreo

```bash
# Ver estado del cluster
kubectl get all

# Ver logs de un pod
kubectl logs <pod-name>

# Ver uso de recursos
kubectl top pods
kubectl top nodes
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Autores

- **Joselyn** - *Desarrollo inicial*

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub
