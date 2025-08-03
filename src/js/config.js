/**
 * Configuration Manager for Signature Generator
 * Simple frontend-only configuration
 */

class ConfigManager {
    constructor() {

        this.appConfig = {
            company: {
                name: 'INNOVATE NUTRITION',
                fullName: 'INNOVATE NUTRITION S.A.S.',
                website: 'www.innovatenutrition.com',
                logo: 'assets/images/logo-innovate.png'
            },
            socialMedia: {
                facebook: 'https://www.facebook.com/innovatenutrition',
                instagram: 'https://www.instagram.com/innovatenutrition',
                linkedin: 'https://www.linkedin.com/company/innovatenutrition'
            },
            assets: {
                icons: {
                    email: 'assets/images/icon-email.png',
                    phone: 'assets/images/icon-phone.png',
                    mobile: 'assets/images/icon-mobile.png',
                    web: 'assets/images/icon-web.png',
                    facebook: 'assets/images/icon-facebook.png',
                    instagram: 'assets/images/icon-instagram.png',
                    linkedin: 'assets/images/icon-linkedin.png'
                }
            },
            ui: {
                messages: {
                    downloadError: 'Error al generar la imagen. Por favor intente nuevamente.'
                }
            }
        };

    }
}

// Create global instance
const configManager = new ConfigManager();

// Modern exports (browser only)
if (typeof window !== 'undefined') {
    window.ConfigManager = ConfigManager;
    window.configManager = configManager;
}