# ===============================
# Servicio interno para PostgreSQL
# ===============================
resource "kubernetes_service" "db_service" {
  metadata {
    name = "db-service"
  }

  spec {
    selector = {
      app = "db"
    }

    port {
      protocol   = "TCP"
      port       = 5432
      target_port = 5432
    }

    type = "ClusterIP"
  }
}

# ===============================
# Servicio externo para Backend
# ===============================
resource "kubernetes_service" "backend_service" {
  metadata {
    name = "backend-service"
  }

  spec {
    selector = {
      app = "backend"
    }

    port {
      protocol   = "TCP"
      port       = 8000
      target_port = 8000
      node_port   = 30080
    }

    type = "LoadBalancer"
  }
}

# ===============================
# Servicio externo para Frontend
# ===============================
resource "kubernetes_service" "frontend_service" {
  metadata {
    name = "frontend-service"
  }

  spec {
    selector = {
      app = "frontend"
    }

    port {
      protocol   = "TCP"
      port       = 4173
      target_port = 4173
      node_port   = 30930
    }

    type = "LoadBalancer"
  }
}
