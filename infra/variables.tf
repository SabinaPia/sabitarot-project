variable "gcp_project_id" {
  description = "El ID de mi proyecto de GCP."
  type        = string
}

variable "gcp_region" {
  description = "Región donde se desplegará el cluster"
  type        = string
  default     = "us-central1"
}

variable "gcp_zone" {
  description = "Zona de los nodos"
  type        = string
  default     = "us-central1-a"
}

variable "machine_type" {
  description = "Tipo de máquina para los nodos"
  type        = string
  default     = "e2-medium"
}

variable "node_disk_size_gb" {
  description = "Tamaño del disco de los nodos"
  type        = number
  default     = 20
}

variable "min_node_count" {
  description = "Cantidad mínima de nodos en el node pool"
  type        = number
  default     = 1
}

variable "max_node_count" {
  description = "Cantidad máxima de nodos en el node pool"
  type        = number
  default     = 5
}