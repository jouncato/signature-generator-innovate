# Generador de Firmas Corporativas - INNOVATE NUTRITION S.A.S.

Aplicación web frontend pura (HTML, CSS, JavaScript) para generar firmas corporativas de empleados de INNOVATE NUTRITION S.A.S. La aplicación incluye validación por correo electrónico, generación de tokens de seguridad y creación automática de firmas con descarga e instrucciones de instalación.

## Tecnologías Utilizadas

- **HTML5** - Estructura de la aplicación
- **CSS3** - Estilos corporativos y responsive design
- **JavaScript (ES6+)** - Lógica de la aplicación
- **html2canvas** - Conversión de HTML a imagen
- **EmailJS** - Envío de correos desde frontend
- **SMTP** - Autenticación y envío de tokens

## Estructura del Proyecto

```
signature-generator-innovate/
├── index.html              # Página principal de la aplicación
├── styles.css              # Estilos corporativos y responsive
├── script.js              # Lógica principal de la aplicación
├── config.js              # Configuraciones de EmailJS y SMTP
├── README.md              # Documentación
├── frontend/              # Recursos del proyecto Angular original
│   └── assets/
│       └── images/         # Logos e iconos corporativos
│           ├── logo-innovate.png
│           ├── icon-email.png
│           ├── icon-phone.png
│           ├── icon-mobile.png
│           ├── icon-web.png
│           ├── icon-facebook.png
│           ├── icon-instagram.png
│           └── icon-linkedin.png
└── docker-compose.yml     # Configuración Docker (legacy)
```

## Características

- ✅ **Validación de identidad** con correos corporativos (@innovatenutrition.com)
- 🔐 **Sistema de tokens** de verificación enviados por SMTP
- 🎨 **Generación automática** de firmas corporativas personalizadas
- 🖼️ **Descarga como imagen** PNG de alta calidad usando html2canvas
- 📧 **Envío por correo** con guías detalladas para Outlook y Thunderbird
- 📱 **Responsive design** compatible con móviles y tablets
- 🎯 **Flujo guiado** en 4 pantallas secuenciales
- 🔒 **Seguridad integrada** con validación de dominio y tokens temporales
- 📋 **Disclaimer legal** automático según normativas corporativas
- 🎨 **Estilos corporativos** oficiales de INNOVATE NUTRITION

## Flujo de la Aplicación

### 1. Pantalla de Validación de Identidad
- Usuario ingresa nombre completo y correo corporativo
- Validación automática del dominio @innovatenutrition.com
- Generación y envío de token de verificación de 6 caracteres
- Redirección a pantalla de rechazo si el dominio no es válido

### 2. Pantalla de Verificación de Token
- Usuario ingresa el token recibido por correo electrónico
- Validación de token y datos asociados (nombre y correo)
- Control de tiempo de expiración del token
- Avance al generador de firmas si es correcto

### 3. Pantalla de Generación de Firma
- Formulario para completar cargo, teléfono y móvil (opcionales)
- Vista previa automática de la firma corporativa
- Opciones para descargar como imagen PNG
- Envío por correo con guías de instalación detalladas

### 4. Pantalla de Confirmación
- Mensaje de éxito del proceso completado
- Opción para generar nueva firma o cerrar aplicación

## Requisitos Previos

- Navegador web moderno (Chrome 60+, Firefox 55+, Safari 11+, Edge 79+)
- Servidor web (opcional, para desarrollo local)
- Cuenta de EmailJS configurada
- Acceso SMTP a mail.innovatenutrition.com

## Instalación y Configuración

### Paso 1: Configurar EmailJS

1. **Crear cuenta** en [EmailJS](https://www.emailjs.com/)
2. **Configurar servicio SMTP** con los datos de INNOVATE NUTRITION:
   - Host: mail.innovatenutrition.com
   - Puerto: 465 (SSL)
   - Usuario: stecnico@innovatenutrition.com
3. **Crear templates** necesarios (ver sección Templates)
4. **Obtener claves** públicas y Service ID

### Paso 2: Configurar la Aplicación

1. **Editar `config.js`** con sus credenciales:
```javascript
const EMAIL_CONFIG = {
    publicKey: 'SU_CLAVE_PUBLICA_EMAILJS',
    serviceId: 'SU_SERVICE_ID_EMAILJS',
    tokenTemplateId: 'template_token_verification',
    signatureTemplateId: 'template_signature_delivery'
};
```

2. **Actualizar `script.js`** línea 19:
```javascript
emailjs.init("SU_CLAVE_PUBLICA_EMAILJS");
```

### Paso 3: Desplegar

#### Opción A: Servidor Web Local
```bash
# Usar cualquier servidor web estático
python -m http.server 8000
# o
npx http-server . -p 8000
```

#### Opción B: Hosting Web
Subir todos los archivos a su hosting web preferido (Netlify, Vercel, etc.)

## Templates de EmailJS Requeridos

### Template para Token de Verificación (template_token_verification)
```
Asunto: Token de Verificación - Generador de Firmas INNOVATE NUTRITION

Estimado/a {{to_name}},

Su token de verificación para el generador de firmas corporativas es:

{{token}}

Por favor ingrese este código en la pantalla de verificación para continuar.

Este token es válido por 15 minutos.

Si usted no solicitó este token, puede ignorar este mensaje.

Saludos cordiales,
Equipo de TI - INNOVATE NUTRITION S.A.S.
```

### Template para Envío de Firma (template_signature_delivery)
```
Asunto: {{subject}}

{{html_content}}
```

## Uso de la Aplicación

1. **Abrir** `index.html` en un navegador web
2. **Ingresar** nombre completo y correo corporativo (@innovatenutrition.com)
3. **Recibir** token de verificación por correo electrónico
4. **Validar** token en la segunda pantalla
5. **Completar** información de cargo y contacto
6. **Generar** vista previa de la firma
7. **Descargar** como imagen PNG o enviar por correo con guías
8. **Finalizar** proceso o generar nueva firma

## Arquitectura del Sistema

```
┌─────────────────┐    ┌──────────────────┐    ┌────────────────┐    ┌─────────────────┐
│  Validación ID  │───▶│ Envío Token SMTP │───▶│ Validar Token  │───▶│ Generar Firma   │
│ (Dominio Check) │    │   (EmailJS)      │    │ (Verificación) │    │ (HTML Template) │
└─────────────────┘    └──────────────────┘    └────────────────┘    └─────────────────┘
        │                       │                       │                       │
        ▼                       ▼                       ▼                       ▼
   Email Validation        Token Generation       Token Validation        Signature HTML
   (@innovatenutrition)    (6-char random)       (Match & Expire)        (Corporate Style)
                                  │                                              │
                                  ▼                                              ▼
                             SMTP Email                                   ┌─────────────────┐
                          (stecnico@innovate)                             │ Descarga/Envío  │
                                                                          │ (PNG + Guías)   │
                                                                          └─────────────────┘
```

**Flujo de seguridad:**
1. Validación de dominio corporativo obligatoria
2. Generación de token temporal (15 min)
3. Envío seguro vía SMTP autenticado
4. Verificación de token antes de generar firma
5. **Sin persistencia** - datos temporales en memoria únicamente

## Componentes Principales

### Archivos Core
- **`index.html`** - Estructura de todas las pantallas y navegación
- **`styles.css`** - Estilos corporativos según especificaciones oficiales
- **`script.js`** - Lógica completa de validación, SMTP y generación
- **`config.js`** - Configuraciones de EmailJS, SMTP y aplicación

### Funciones JavaScript Principales
- **`goToScreen()`** - Navegación entre pantallas con animaciones
- **`generateToken()`** - Generación de tokens aleatorios de 6 caracteres
- **`isValidCorporateEmail()`** - Validación de dominio @innovatenutrition.com
- **`sendTokenByEmail()`** - Envío SMTP de tokens vía EmailJS
- **`generateSignature()`** - Creación de HTML de firma corporativa
- **`downloadSignature()`** - Descarga como PNG usando html2canvas
- **`sendSignatureByEmail()`** - Envío de firma con guías de instalación

## Personalización

### Cambiar Logo Corporativo
Reemplazar archivo en `frontend/assets/images/logo-innovate.png` manteniendo máximo 120px de ancho.

### Modificar Colores Corporativos
Editar variables en `styles.css`:
```css
.cargo, .web, a:link { color: #33479c; }     /* Color principal */
a:hover { color: #ad9f77; }                   /* Color hover */
.btn-primary { background-color: #33479c; }   /* Botones */
```

### Actualizar Información de Contacto
Modificar en `config.js`:
```javascript
const APP_CONFIG = {
    companyName: 'SU_EMPRESA_S.A.S.',
    website: 'www.suempresa.com',
    socialMedia: {
        facebook: 'https://facebook.com/suempresa',
        // ... más redes
    }
};
```

### Personalizar Disclaimer Legal
Editar el texto legal en la función `createSignatureHTML()` en `script.js` líneas 180-190.

## Seguridad Implementada

- ✅ **Validación de dominio** - Solo @innovatenutrition.com permitido
- ✅ **Tokens temporales** - Expiración de 15 minutos
- ✅ **SMTP autenticado** - Conexión segura SSL/TLS
- ✅ **No persistencia** - Datos temporales en memoria únicamente
- ✅ **Validación de formularios** - Sanitización de inputs
- ✅ **HTTPS recomendado** - Para producción usar certificados SSL

## Troubleshooting

### Problemas Comunes

**Error: EmailJS no envía correos**
- Verificar configuración en `config.js` y `script.js`
- Comprobar credenciales SMTP en EmailJS
- Revisar templates configurados correctamente

**Token no llega al correo**
- Verificar configuración SMTP: mail.innovatenutrition.com:465
- Comprobar carpeta de spam/correo no deseado
- Validar que el correo sea @innovatenutrition.com

**Error al descargar imagen**
- Verificar que html2canvas esté cargado correctamente
- Comprobar permisos de descarga del navegador
- Revisar consola del navegador (F12) para errores

**Imágenes no se cargan**
- Verificar rutas en `frontend/assets/images/`
- Limpiar caché del navegador (Ctrl+Shift+R)
- Comprobar que el servidor web sirva archivos estáticos

### Logs y Debug

Abrir DevTools (F12) para monitorear:
- **Console**: Errores de JavaScript y EmailJS
- **Network**: Fallos en carga de recursos
- **Application**: Problemas de CORS o archivos

## Soporte de Navegadores

- ✅ **Chrome 60+** - Totalmente compatible
- ✅ **Firefox 55+** - Totalmente compatible  
- ✅ **Safari 11+** - Totalmente compatible
- ✅ **Edge 79+** - Totalmente compatible
- ⚠️ **Internet Explorer** - No soportado

## Dependencias Externas

- **[html2canvas](https://html2canvas.hertzen.com/)** v1.4.1 - Generación de imágenes desde DOM
- **[EmailJS](https://www.emailjs.com/)** - Envío de correos desde frontend sin backend

## Licencia

**Uso interno exclusivo** de INNOVATE NUTRITION S.A.S.

Este software ha sido desarrollado específicamente para uso corporativo interno y no debe ser distribuido o utilizado fuera de la organización sin autorización expresa.

## Soporte Técnico

Para soporte técnico y mantenimiento, contactar al **Departamento de TI de INNOVATE NUTRITION S.A.S.**

- 📧 Email: stecnico@innovatenutrition.com
- 🌐 Web: www.innovatenutrition.com

---

**© 2024 INNOVATE NUTRITION S.A.S. - Todos los derechos reservados.**