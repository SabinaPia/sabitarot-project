output "cluster_name" {
  description = "Cluster de SabiTarot"
  value       = google_container_cluster.sabi_cluster.name
}

output "cluster_endpoint" {
  description = "Endpoint del cluster"
  value       = google_container_cluster.sabi_cluster.endpoint
}

output "node_pool_name" {
  description = "node pool de SabiTarot"
  value       = google_container_node_pool.sabi_node_pool.name
}
