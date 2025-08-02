// Configuración para EmailJS
// IMPORTANTE: Estos valores deben ser configurados antes de usar la aplicación

const EMAIL_CONFIG = {
    // Configuración de EmailJS
    publicKey: 'YOUR_EMAILJS_PUBLIC_KEY', // Reemplazar con su clave pública de EmailJS
    serviceId: 'YOUR_EMAILJS_SERVICE_ID', // Reemplazar con su Service ID de EmailJS
    
    // Templates de EmailJS
    tokenTemplateId: 'template_token_verification', // Template para envío de token
    signatureTemplateId: 'template_signature_delivery', // Template para envío de firma
    
    // Configuración SMTP (información de referencia)
    smtp: {
        host: 'mail.innovatenutrition.com',
        port: 465,
        secure: true,
        user: 'stecnico@innovatenutrition.com',
        // La contraseña se configura directamente en EmailJS por seguridad
    },
    
    // Configuración de dominio corporativo
    corporateDomain: '@innovatenutrition.com',
    
    // Configuración de token
    tokenLength: 6,
    tokenExpiryMinutes: 15
};

// Configuración de la aplicación
const APP_CONFIG = {
    companyName: 'INNOVATE NUTRITION S.A.S.',
    website: 'www.innovatenutrition.com',
    logoPath: 'frontend/assets/images/logo-innovate.png',
    
    // Redes sociales
    socialMedia: {
        facebook: 'https://www.facebook.com/innovatenutrition',
        instagram: 'https://www.instagram.com/innovatenutrition',
        linkedin: 'https://www.linkedin.com/company/innovatenutrition'
    },
    
    // Iconos de contacto
    icons: {
        email: 'frontend/assets/images/icon-email.png',
        phone: 'frontend/assets/images/icon-phone.png',
        mobile: 'frontend/assets/images/icon-mobile.png',
        web: 'frontend/assets/images/icon-web.png',
        facebook: 'frontend/assets/images/icon-facebook.png',
        instagram: 'frontend/assets/images/icon-instagram.png',
        linkedin: 'frontend/assets/images/icon-linkedin.png'
    }
};

// Exportar configuraciones
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EMAIL_CONFIG, APP_CONFIG };
}