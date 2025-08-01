# Generador de Firmas Digitales - Innovate Nutrition

Aplicación web frontend para crear y descargar firmas digitales personalizadas de Innovate Nutrition.

## Tecnologías Utilizadas

- **Angular 18+** - Framework frontend
- **TypeScript** - Lenguaje de programación
- **HTML5/CSS3/SCSS** - Maquetación y estilos
- **html2canvas** - Conversión de HTML a imagen
- **file-saver** - Descarga de archivos
- **Reactive Forms** - Formularios con validación

## Estructura del Proyecto

```
signature-generator-innovate/
├── frontend/                # Aplicación Angular (único componente)
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── models/
│   │   │   └── services/
│   │   └── assets/
│   │       └── images/      # Logos e iconos
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml       # Configuración Docker
└── README.md
```

## Características

- ✅ **100% Frontend** - Sin backend ni base de datos, todo funciona en el navegador
- 🎨 **Vista previa en tiempo real** - Actualización automática al escribir
- 📱 **Responsive** - Compatible con móviles y tablets  
- 🖼️ **Descarga como imagen** - PNG de alta calidad
- 📧 **Disclaimer incluido** - Texto legal al final de la firma
- 🐳 **Dockerizado** - Listo para desplegar
- 💾 **Sin persistencia** - Los datos no se guardan, solo se procesan en memoria

## Requisitos Previos

- Node.js 18+
- npm 9+
- Angular CLI 18+ (opcional)
- Docker (para contenedor)

## Instalación y Configuración

### Opción 1: Desarrollo Local

```bash
# Clonar repositorio
git clone <repository-url>
cd signature-generator-innovate/frontend

# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
ng serve
```

La aplicación estará disponible en `http://localhost:4200`.

### Opción 2: Docker (Recomendado)

```bash
# Clonar repositorio
git clone <repository-url>
cd signature-generator-innovate

# Construir y ejecutar contenedor
docker-compose up -d
```

La aplicación estará disponible en `http://localhost:8080`.

### Opción 3: Build de Producción

```bash
cd frontend

# Build de producción
npm run build

# Servir archivos estáticos (ejemplo con http-server)
npx http-server dist/firma-digital -p 8080
```

## Uso de la Aplicación

1. **Acceder** a la aplicación web
   - Desarrollo: `http://localhost:4200`
   - Docker: `http://localhost:8080`

2. **Completar formulario** con datos personales:
   - Nombre y apellido (requeridos)
   - Cargo y departamento (requeridos)
   - Teléfono y celular (opcionales)
   - Email (requerido)

3. **Vista previa** se actualiza automáticamente mientras escribes

4. **Descargar firma** como PNG de alta calidad haciendo clic en "Descargar Firma"

5. **Usar en email**:
   - Añadir la imagen descargada a tu cliente de correo
   - Compatible con Gmail, Outlook, Apple Mail, etc.

## Arquitectura

```
┌─────────────────┐    ┌──────────────────┐    ┌────────────────┐
│   Formulario    │───▶│  Vista Previa    │───▶│   Descarga     │
│  (Reactive)     │    │  (Tiempo Real)   │    │  (html2canvas) │
└─────────────────┘    └──────────────────┘    └────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
   FirmaService           HTML Template            PNG Image
   (BehaviorSubject)      (Styled Table)          (file-saver)
```

**Flujo de datos:**
1. Usuario escribe en formulario
2. Datos se envían a `FirmaService` (en memoria)
3. Vista previa se actualiza automáticamente
4. Usuario descarga imagen generada del DOM
5. **No hay persistencia** - los datos se pierden al recargar

## Componentes Principales

- **`FirmaFormComponent`** - Formulario con validaciones
- **`FirmaPreviewComponent`** - Vista previa de la firma
- **`FirmaDownloadComponent`** - Descarga de imagen
- **`FirmaService`** - Gestión de estado en memoria (BehaviorSubject)
- **`Firma`** - Modelo de datos (sin ID ni timestamps de BD)

## Personalización

### Cambiar Logo
Reemplazar archivo en `src/assets/images/logo-innovate.png`

### Modificar Colores
Editar variables en `firma-preview.component.html`:
```html
style="color: #1a8b9d;"           <!-- Color principal -->
style="border-left: 2px solid #1a8b9d;"  <!-- Borde -->
```

### Añadir Campos
1. Actualizar `firma.model.ts`
2. Agregar controles en `firma-form.component.ts`
3. Modificar HTML en `firma-preview.component.html`

## Despliegue en Producción

### Nginx
```bash
# Build
npm run build

# Copiar archivos
cp -r dist/firma-digital/* /var/www/html/
```

### Vercel/Netlify
```bash
# Build command
npm run build

# Output directory
dist/firma-digital
```

### Docker
```bash
docker-compose up -d
```

## Troubleshooting

### Problemas Comunes

**Error: "Cannot find module"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Imágenes no se cargan**
- Verificar que las imágenes estén en `src/assets/images/`
- Limpiar caché del navegador (Ctrl+Shift+R)

**Error en descarga**
- Verificar que html2canvas esté instalado
- Comprobar permisos de descarga del navegador

### Logs y Debug

En desarrollo, abrir DevTools (F12) para ver errores en consola.

## Licencia

MIT License - Libre para uso comercial y personal.