# Generador de Firmas Digitales

Este proyecto replica la funcionalidad del sitio innovatenutrition.com/firmasweb/firmainnovate.html, permitiendo a los usuarios crear, visualizar y descargar firmas digitales personalizadas para correos electrónicos.

## Tecnologías Utilizadas

### Frontend
- Angular 16+
- TypeScript
- HTML5/CSS3/SCSS
- html2canvas para conversión a imágenes en el cliente
- Reactive Forms con validación

### Backend
- Node.js con Express
- TypeScript
- PostgreSQL 17
- Puppeteer para renderización HTML a imagen
- Handlebars para plantillas

## Estructura del Proyecto

```
firma-digital/
├── frontend/                # Aplicación Angular
├── backend/                 # Servidor Node.js
└── docker-compose.yml       # Configuración Docker
```

## Requisitos Previos

- Node.js 18+
- npm 9+
- Angular CLI 16+
- PostgreSQL 17 (o Docker)
- Git

## Instalación y Configuración

### Clonar el Repositorio

```bash
git clone https://github.com/tuusuario/firma-digital.git
cd firma-digital
```

### Backend

1. Configurar variables de entorno:

```bash
cd backend
cp .env.example .env
```

2. Editar el archivo `.env` con tus configuraciones específicas.

3. Instalar dependencias:

```bash
npm install
```

4. Compilar TypeScript:

```bash
npm run build
```

5. Ejecutar migración de base de datos:

```bash
npm run db:migrate
```

6. Iniciar el servidor:

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`.

### Frontend

1. Configurar entorno:

```bash
cd frontend
```

2. Instalar dependencias:

```bash
npm install
```

3. Ejecutar servidor de desarrollo:

```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200`.

## Uso con Docker

Para facilitar el despliegue, puedes utilizar Docker Compose:

```bash
# Copiar el archivo de variables de entorno
cp backend/.env.example .env

# Editar las variables según tu configuración
nano .env

# Iniciar servicios
docker-compose up -d
```

Esto iniciará tres contenedores:
- PostgreSQL (puerto 5432)
- Backend Node.js (puerto 3000)
- Frontend Angular (puerto 80)

## Uso de la Aplicación

1. Acceder a la aplicación web (http://localhost:4200 en desarrollo o http://localhost en Docker).
2. Completar el formulario con los datos personales.
3. Ver la vista previa de la firma generada en tiempo real.
4. Descargar la firma como imagen usando una de las opciones disponibles.
5. Añadir la imagen a tu cliente de correo electrónico (Gmail, Outlook, etc.).

## API Endpoints

El backend expone los siguientes endpoints:

- `POST /api/firmas`: Guarda una nueva firma en la base de datos
- `GET /api/firmas`: Obtiene todas las firmas guardadas
- `POST /api/firmas/render-html`: Genera el HTML de la firma
- `POST /api/firmas/generate-image`: Genera una imagen PNG de la firma

## Variables de Entorno

### Backend (.env)

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| PORT | Puerto del servidor | 3000 |
| NODE_ENV | Entorno de ejecución | development |
| ALLOWED_ORIGINS | Orígenes permitidos para CORS | http://localhost:4200 |
| DB_HOST | Host de PostgreSQL | localhost |
| DB_PORT | Puerto de PostgreSQL | 5432 |
| DB_NAME | Nombre de la base de datos | firma_digital |
| DB_USER | Usuario de PostgreSQL | postgres |
| DB_PASSWORD | Contraseña de PostgreSQL | secretpassword |

## Seguridad

El proyecto implementa varias medidas de seguridad:

1. **Validación de datos**:
   - Validación de formularios en el frontend
   - Validación de entrada en el backend
   - Sanitización de entrada para prevenir inyección SQL

2. **Seguridad HTTP**:
   - Uso de Helmet para establecer cabeceras de seguridad
   - Configuración de CORS para limitar orígenes

3. **Base de datos**:
   - Uso de parámetros de consulta para prevenir inyección SQL
   - Conexión SSL en producción
   - Pool de conexiones con límites

4. **Otras medidas**:
   - Control de errores para evitar exposición de información sensible
   - Registro (logging) de actividad
   - Validación de tipos con TypeScript

## Extensibilidad

El proyecto ha sido diseñado para ser fácilmente extensible:

1. **Nuevos tipos de firma**:
   - Crear nuevas plantillas Handlebars en `backend/src/templates/`
   - Añadir nuevos componentes Angular en `frontend/src/app/components/`

2. **Autenticación**:
   - Implementar JWT o OAuth añadiendo middlewares y controladores

3. **Almacenamiento en la nube**:
   - Añadir servicios para almacenar imágenes en AWS S3, Google Cloud Storage, etc.

## Contribución

1. Haz fork del repositorio
2. Crea una rama para tu funcionalidad (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.