# =====================
# Etapa de build
# =====================
FROM node:18 AS build
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar código fuente y construir
COPY . .
RUN npm run build


# =====================
# Etapa de producción
# =====================
FROM node:18-alpine
WORKDIR /app

# Instalar un servidor liviano para servir estáticos
RUN npm install -g serve

# Copiar solo los archivos ya compilados
COPY --from=build /app/dist ./dist

# Exponer el puerto
EXPOSE 4173

# Comando para levantar servidor en modo producción
CMD ["serve", "-s", "dist", "-l", "4173"]
