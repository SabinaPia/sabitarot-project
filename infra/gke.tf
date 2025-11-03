# Habilitar API de GKE
resource "google_project_service" "gke_api" {
  service = "container.googleapis.com"
  project = var.gcp_project_id
}

# Cluster GKE Standard 
resource "google_container_cluster" "sabi_cluster" {
  name     = "sabi-cluster"
  location = var.gcp_zone

  remove_default_node_pool = true
  initial_node_count       = 1

  deletion_protection      = false

  node_config {
    disk_type = "pd-standard"
  }

  workload_identity_config {
    workload_pool = "${var.gcp_project_id}.svc.id.goog"
  }

  ip_allocation_policy {}

  depends_on = [google_project_service.gke_api]
}

# Node Pool gestionado por mi xd
resource "google_container_node_pool" "sabi_node_pool" {
  name     = "sabi-node-pool"
  location = google_container_cluster.sabi_cluster.location
  cluster  = google_container_cluster.sabi_cluster.name

  node_config {
    machine_type = var.machine_type
    disk_size_gb = var.node_disk_size_gb
    disk_type    = "pd-standard"
    preemptible  = false
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
    labels = {
      role = "general"
    }
  }

  initial_node_count = var.min_node_count

  autoscaling {
    min_node_count = var.min_node_count
    max_node_count = var.max_node_count
  }

  management {
    auto_repair  = true
    auto_upgrade = true
  }
}

# Service Account 
resource "google_service_account" "gke_sa" {
  account_id   = "sabi-gke-sa"
  display_name = "SabiTarot GKE Service Account"
}
