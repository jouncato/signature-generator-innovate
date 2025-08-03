# Generador de Firmas - Innovate Nutrition

Aplicación web para generar firmas digitales corporativas con validación de acceso.

## Estructura del Proyecto

```
signature-generator-innovate/
├── index.html                    # Página principal
├── package.json                  # Configuración del proyecto
├── Dockerfile                    # Imagen Docker
├── docker-compose.yml            # Orquestación de contenedores
├── nginx.conf                    # Configuración del servidor web
├── assets/
│   └── images/                   # Recursos gráficos
└── src/
    ├── css/
    │   └── styles.css            # Estilos de la aplicación
    └── js/                       # Código JavaScript modular
        ├── config.js             # Configuración
        ├── signature-app.js      # Aplicación principal
        ├── models/               # Modelos de datos
        ├── services/             # Servicios de negocio
        ├── controllers/          # Controladores
        ├── validators/           # Validadores
        └── utils/                # Utilidades
```

## Despliegue

### Opción 1: Docker (Recomendado)

```bash
# Clonar repositorio
git clone <repository-url>
cd signature-generator-innovate

# Ejecutar con Docker Compose
docker-compose up -d

# Acceder a la aplicación
http://localhost:8080
```

### Opción 2: Node.js Local

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm start

# Acceder a la aplicación
http://localhost:8080
```

### Opción 3: Servidor Web Simple

```bash
# Python 3
python -m http.server 8080

# Node.js (sin package.json)
npx http-server . -p 8080
```

## Comandos Disponibles

```bash
npm start          # Servidor HTTP en puerto 8080
npm run dev        # Servidor con recarga automática
npm run serve      # Servidor HTTP básico
npm run docker:build    # Construir imagen Docker
npm run docker:run      # Ejecutar contenedor
npm run docker:compose  # Docker Compose
```

## Configuración Docker

### Variables de Entorno

```yaml
environment:
  - NGINX_HOST=localhost
  - NGINX_PORT=80
```

### Puertos

- **8080**: Puerto de la aplicación web
- **80**: Puerto interno del contenedor

### Volúmenes

- `./nginx.conf`: Configuración personalizada de Nginx

## Producción

Para despliegue en producción:

1. **Construir imagen**:
   ```bash
   docker build -t signature-generator:latest .
   ```

2. **Ejecutar contenedor**:
   ```bash
   docker run -d -p 80:80 --name signature-app signature-generator:latest
   ```

3. **Con proxy reverso** (Nginx/Traefik):
   ```yaml
   labels:
     - "traefik.enable=true"
     - "traefik.http.routers.signature.rule=Host(`signature.ejemplo.com`)"
   ```

## Requisitos del Sistema

- **Docker**: 20.10+
- **Docker Compose**: 3.8+
- **Node.js**: 14+ (para desarrollo local)
- **Navegador**: Chrome, Firefox, Safari, Edge

## Licencia

MIT License