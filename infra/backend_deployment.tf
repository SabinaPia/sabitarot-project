resource "kubernetes_deployment" "backend" {
  metadata {
    name = "backend-deployment"
    labels = {
      app = "backend"
    }
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "backend"
      }
    }

    template {
      metadata {
        labels = {
          app = "backend"
        }
      }

      spec {
        container {
          name  = "backend"
          image = "us-central1-docker.pkg.dev/main-bloom-476318-f9/sabitarot-repo/sabitarot-project-backend:latest"
          image_pull_policy = "Always"

          port {
            container_port = 8000
          }

          env {
            name  = "DATABASE_URL"
            value = "postgresql://postgres:76156047@db-service:5432/sabitarot_db"
          }

          resources {
            limits = {
              cpu    = "200m"
              memory = "256Mi"
            }
            requests = {
              cpu    = "100m"
              memory = "128Mi"
            }
          }

          liveness_probe {
            http_get {
              path = "/healthchecks"
              port = 8000
            }
            initial_delay_seconds = 15
            period_seconds         = 20
          }

          readiness_probe {
            http_get {
              path = "/healthchecks"
              port = 8000
            }
            initial_delay_seconds = 5
            period_seconds         = 10
          }
        }
      }
    }
  }
}
