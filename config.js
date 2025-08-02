/**
 * Configuration Manager for Signature Generator
 * Centralizes all application configuration with validation and defaults
 */

class ConfigManager {
    constructor() {
        this.emailConfig = {
            publicKey: 'JW7-SUF3JLAKdaeOE',
            serviceId: 'service_zpafa0e_innovate',
            templates: {
                token: 'template_dyl9ju',
                signature: 'template_exws1wn'
            },
            corporateDomain: '@innovatenutrition.com',
            token: {
                length: 6,
                expiryMinutes: 15,
                chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
            }
        };

        this.appConfig = {
            company: {
                name: 'INNOVATE NUTRITION',
                fullName: 'INNOVATE NUTRITION S.A.S.',
                website: 'www.innovatenutrition.com',
                logo: 'frontend/assets/images/logo-innovate.png'
            },
            socialMedia: {
                facebook: 'https://www.facebook.com/innovatenutrition',
                instagram: 'https://www.instagram.com/innovatenutrition',
                linkedin: 'https://www.linkedin.com/company/innovatenutrition'
            },
            assets: {
                icons: {
                    email: 'frontend/assets/images/icon-email.png',
                    phone: 'frontend/assets/images/icon-phone.png',
                    mobile: 'frontend/assets/images/icon-mobile.png',
                    web: 'frontend/assets/images/icon-web.png',
                    facebook: 'frontend/assets/images/icon-facebook.png',
                    instagram: 'frontend/assets/images/icon-instagram.png',
                    linkedin: 'frontend/assets/images/icon-linkedin.png'
                }
            },
            ui: {
                screens: {
                    identity: 1,
                    token: 2,
                    signature: 3,
                    complete: 4,
                    reject: 'reject'
                },
                messages: {
                    tokenSent: 'Token enviado correctamente. Revise su correo electrónico.',
                    tokenInvalid: 'Token incorrecto. Por favor verifique e intente nuevamente.',
                    positionRequired: 'Por favor ingrese su cargo o posición.',
                    signatureSent: 'Firma enviada correctamente a su correo electrónico.',
                    downloadError: 'Error al generar la imagen. Por favor intente nuevamente.',
                    emailError: 'Error al enviar el token. Por favor intente nuevamente.'
                }
            }
        };

        this.templates = {
            email: {
                token: {
                    subject: 'Token de verificación - Sistema de Firmas',
                    fromName: 'Sistema de Firmas INNOVATE NUTRITION'
                },
                signature: {
                    subject: 'Su Firma Corporativa - {companyName}',
                    fromName: 'Sistema de Firmas {companyName}'
                }
            }
        };
    }

    // Validation methods
    validateEmailConfig() {
        const errors = [];
        const { publicKey, serviceId, templates } = this.emailConfig;

        if (!publicKey || publicKey === 'SUF3JLAKdaeOE') {
            errors.push('Public Key no configurada');
        }

        if (!serviceId || serviceId === 'service_zpafa0e_innovate') {
            errors.push('Service ID no configurado');
        }

        if (!templates.token) {
            errors.push('Template de token no configurado');
        }

        if (!templates.signature) {
            errors.push('Template de firma no configurado');
        }

        return errors;
    }

    isValidCorporateEmail(email) {
        return email.toLowerCase().endsWith(this.emailConfig.corporateDomain);
    }

    // Getter methods for backward compatibility
    get EMAIL_CONFIG() {
        return {
            publicKey: this.emailConfig.publicKey,
            serviceId: this.emailConfig.serviceId,
            tokenTemplateId: this.emailConfig.templates.token,
            signatureTemplateId: this.emailConfig.templates.signature,
            corporateDomain: this.emailConfig.corporateDomain,
            tokenLength: this.emailConfig.token.length,
            tokenExpiryMinutes: this.emailConfig.token.expiryMinutes
        };
    }

    get APP_CONFIG() {
        return {
            companyName: this.appConfig.company.name,
            website: this.appConfig.company.website,
            logoPath: this.appConfig.company.logo,
            socialMedia: this.appConfig.socialMedia
        };
    }

    // Utility methods
    generateToken() {
        const { length, chars } = this.emailConfig.token;
        let token = '';
        for (let i = 0; i < length; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return token;
    }

    getEmailTemplate(type, params = {}) {
        const template = this.templates.email[type];
        if (!template) return null;

        const result = { ...template };
        
        // Replace placeholders
        Object.keys(params).forEach(key => {
            const placeholder = `{${key}}`;
            if (result.subject) {
                result.subject = result.subject.replace(placeholder, params[key]);
            }
            if (result.fromName) {
                result.fromName = result.fromName.replace(placeholder, params[key]);
            }
        });

        return result;
    }
}

// Create global instance
const configManager = new ConfigManager();

// Backward compatibility exports
const EMAIL_CONFIG = configManager.EMAIL_CONFIG;
const APP_CONFIG = configManager.APP_CONFIG;

// Modern exports (browser only)
if (typeof window !== 'undefined') {
    window.ConfigManager = ConfigManager;
    window.configManager = configManager;
}

// Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ConfigManager, configManager, EMAIL_CONFIG, APP_CONFIG };
}