resource "kubernetes_deployment" "frontend" {
  metadata {
    name = "frontend-deployment"
    labels = {
      app = "frontend"
    }
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "frontend"
      }
    }

    template {
      metadata {
        labels = {
          app = "frontend"
        }
      }

      spec {
        container {
          name  = "frontend"
          image = "us-central1-docker.pkg.dev/main-bloom-476318-f9/sabitarot-repo/sabitarot-project-frontend:latest"
          image_pull_policy = "Always"

          port {
            container_port = 4173
          }

          resources {
            requests = {
              cpu    = "100m"
              memory = "128Mi"
            }
            limits = {
              cpu    = "200m"
              memory = "256Mi"
            }
          }

          liveness_probe {
            http_get {
              path = "/"
              port = 4173
            }
            initial_delay_seconds = 15
            period_seconds         = 20
          }

          readiness_probe {
            http_get {
              path = "/"
              port = 4173
            }
            initial_delay_seconds = 5
            period_seconds         = 10
          }
        }
      }
    }
  }
}
