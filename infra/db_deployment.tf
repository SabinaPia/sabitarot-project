resource "kubernetes_deployment" "db" {
  metadata {
    name = "db-deployment"
    labels = {
      app = "db"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "db"
      }
    }

    template {
      metadata {
        labels = {
          app = "db"
        }
      }

      spec {
        container {
          name  = "postgres"
          image = "us-central1-docker.pkg.dev/main-bloom-476318-f9/sabitarot-repo/postgres:16-alpine"

          port {
            container_port = 5432
          }

          env {
            name  = "POSTGRES_USER"
            value = "postgres"
          }

          env {
            name  = "POSTGRES_PASSWORD"
            value = "76156047"
          }

          env {
            name  = "POSTGRES_DB"
            value = "sabitarot_db"
          }

          env {
            name  = "PGDATA"
            value = "/var/lib/postgresql/data/pgdata"
          }

          volume_mount {
            name       = "db-data"
            mount_path = "/var/lib/postgresql/data"
          }

          resources {
            requests = {
              cpu    = "100m"
              memory = "256Mi"
            }
            limits = {
              cpu    = "250m"
              memory = "512Mi"
            }
          }

          readiness_probe {
            exec {
              command = ["pg_isready", "-U", "postgres"]
            }
            initial_delay_seconds = 10
            period_seconds         = 10
          }

          liveness_probe {
            exec {
              command = ["pg_isready", "-U", "postgres"]
            }
            initial_delay_seconds = 30
            period_seconds         = 20
          }
        }

        volume {
          name = "db-data"

          persistent_volume_claim {
            claim_name = "postgres-pvc"
          }
        }
      }
    }
  }
}
