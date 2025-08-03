# Generador de Firmas - Innovate Nutrition

Aplicación web para generar firmas digitales corporativas con validación de acceso.

## Estructura del Proyecto

```
signature-generator-innovate/
├── index.html                    # Página principal
├── package.json                  # Configuración del proyecto
├── vercel.json                   # Configuración de Vercel
├── .vercelignore                 # Archivos ignorados por Vercel
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

## Despliegue en Vercel 🚀

### Opción 1: Deploy Directo desde GitHub

1. **Fork o clone el repositorio**
2. **Conectar con Vercel**:
   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu cuenta de GitHub
   - Selecciona este repositorio
   - Click en "Deploy"

3. **Configuración automática**:
   - Vercel detectará automáticamente que es un proyecto estático
   - Usará la configuración de `vercel.json`
   - La aplicación estará disponible en unos segundos

### Opción 2: Deploy desde CLI de Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login en Vercel
vercel login

# Deploy del proyecto
vercel

# Para deploy de producción
vercel --prod
```

### Configuración de Vercel

El archivo `vercel.json` incluye:
- **Routing**: Redirección de todas las rutas a `index.html` (SPA)
- **Build**: Configuración para archivos estáticos
- **Static files**: Inclusión de assets y código fuente

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## Otros Métodos de Despliegue

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
npm start              # Servidor HTTP en puerto 8080
npm run dev            # Servidor con recarga automática
npm run build          # Construir para producción
npm run vercel-build   # Build específico para Vercel
npm run serve          # Servidor HTTP básico
npm run docker:build  # Construir imagen Docker
npm run docker:run     # Ejecutar contenedor
npm run docker:compose # Docker Compose
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