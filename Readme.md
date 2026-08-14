# Generador de Firmas - Innovate Nutrition

Aplicación web para generar firmas digitales corporativas con validación de acceso.

**URL de producción:** https://signature-generator-innovate.up.railway.app

## Estructura del Proyecto

```
signature-generator-innovate/
├── index.html                    # Página principal
├── package.json                  # Configuración del proyecto
├── Dockerfile                    # Imagen Docker (Railway)
├── docker-compose.yml            # Orquestación de contenedores (local)
├── nginx.conf                    # Configuración del servidor web (local)
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

## Despliegue en Railway 🚀

La aplicación está desplegada en Railway mediante el `Dockerfile` del repositorio.

**URL:** https://signature-generator-innovate.up.railway.app

### Opción 1: Deploy desde CLI de Railway

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login en Railway
railway login

# Crear proyecto y vincular el directorio
railway init --name signature-generator

# Desplegar
railway up --detach

# Generar dominio público
railway domain
```

### Opción 2: Deploy desde GitHub (automático)

1. Conecta tu repositorio de GitHub en [railway.com](https://railway.com)
2. Selecciona este repositorio
3. Railway detectará automáticamente el `Dockerfile` y lo construirá
4. Genera un dominio desde el panel de Railway

### Configuración del Dockerfile

El `Dockerfile` usa `http-server` para servir los archivos estáticos:
- **Variable `PORT`**: Railway inyecta el puerto automáticamente (fallback a 8090 local)
- **Bind `0.0.0.0`**: El contenedor es alcanzable desde fuera
- **Sin caché**: `c-1` para desarrollo; los headers de caché se manejan en `vercel.json`/`nginx.conf`

## Otros Métodos de Despliegue

### Opción 1: Docker Local

```bash
# Clonar repositorio
git clone <repository-url>
cd signature-generator-innovate

# Construir y ejecutar con Docker
docker build -t signature-generator .
docker run -p 8090:8090 signature-generator

# Acceder a la aplicación
http://localhost:8090
```

### Opción 2: Docker Compose

```bash
docker-compose up -d

# Acceder a la aplicación
http://localhost:8080
```

### Opción 3: Node.js Local

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm start

# Acceder a la aplicación
http://localhost:8080
```

### Opción 4: Servidor Web Simple

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
npm run serve          # Servidor HTTP básico
npm run docker:build   # Construir imagen Docker
npm run docker:run     # Ejecutar contenedor
npm run docker:compose # Docker Compose
```

## Configuración Docker

### Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `PORT`   | Puerto del servidor (inyectado por Railway) | `8090` |

### Puertos

- **8090**: Puerto de la aplicación (configurable via `PORT`)
- **8080**: Puerto mapeado por `docker-compose.yml`

## Producción

El despliegue de producción se realiza en Railway:

**https://signature-generator-innovate.up.railway.app**

Para despliegue manual con Docker:

1. **Construir imagen**:
   ```bash
   docker build -t signature-generator:latest .
   ```

2. **Ejecutar contenedor**:
   ```bash
   docker run -d -p 80:8090 --name signature-app signature-generator:latest
   ```

3. **Con proxy reverso** (Nginx/Traefik):
   ```yaml
   labels:
     - "traefik.enable=true"
     - "traefik.http.routers.signature.rule=Host(`signature.ejemplo.com`)"
   ```

## Requisitos del Sistema

- **Docker**: 20.10+ (para despliegue local/producción manual)
- **Docker Compose**: 3.8+ (opcional, para orquestación local)
- **Node.js**: 14+ (para desarrollo local)
- **Navegador**: Chrome, Firefox, Safari, Edge

## Licencia

MIT License