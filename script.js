/**
 * Signature Generator Application
 * Simple frontend-only implementation
 */

class SignatureApp {
    constructor() {
        this.config = configManager;
        this.state = {
            currentUser: this.createEmptyUser()
        };
        
        this.init();
    }

    // Initialization
    init() {
        this.bindEventHandlers();
    }

    bindEventHandlers() {
        // Add global methods for HTML onclick handlers
        window.generateSignature = this.generateSignature.bind(this);
        window.downloadSignature = this.downloadSignature.bind(this);
        window.startOver = this.startOver.bind(this);
    }

    // State management
    createEmptyUser() {
        return {
            fullName: '',
            email: '',
            position: '',
            phone: '',
            mobile: ''
        };
    }

    updateUser(userData) {
        this.state.currentUser = { ...this.state.currentUser, ...userData };
    }

    // Signature generation
    generateSignature() {
        const formData = this.extractFormData();
        
        // Validate required fields
        if (!formData.fullName || !formData.email || !formData.position) {
            this.showMessage('Por favor complete todos los campos requeridos.');
            return;
        }

        this.updateUser(formData);
        
        const signatureHTML = this.createSignatureHTML();
        this.displaySignature(signatureHTML);
    }

    extractFormData() {
        return {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            position: document.getElementById('position').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            mobile: document.getElementById('mobile').value.trim()
        };
    }

    createSignatureHTML() {
        const { fullName, email, position, phone, mobile } = this.state.currentUser;
        const contactInfo = this.buildContactInfo(email, phone, mobile);
        const socialIcons = this.buildSocialIcons();
        
        return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Trebuchet MS', Arial, Helvetica, sans-serif; color: #000; max-width: 600px; background-color: #ffffff;">
    <tr>
        <td style="padding-right: 20px; vertical-align: top; width: 120px;">
            <img src="${this.config.appConfig.company.logo}" alt="${this.config.appConfig.company.name} Logo" style="max-width: 120px; height: auto;">
        </td>
        <td style="border-left: 2px solid #33479c; padding-left: 20px; vertical-align: top;">
            <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td colspan="2" style="font-size: 14pt; font-weight: bold; color: #33479c; padding-bottom: 5px;">
                        ${fullName}
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="font-size: 11pt; color: #33479c; font-weight: bold; padding-bottom: 10px;">
                        ${position}
                    </td>
                </tr>
                ${contactInfo}
                ${socialIcons}
            </table>
        </td>
    </tr>
</table>
${this.createDisclaimerText()}
        `;
    }

    buildContactInfo(email, phone, mobile) {
        const icons = this.config.appConfig.assets.icons;
        let contactInfo = '';

        // Email (always present)
        contactInfo += this.createContactRow(icons.email, `<a href="mailto:${email}" style="color: #33479c; text-decoration: none;">${email}</a>`, 'Email');

        // Phone (optional)
        if (phone) {
            contactInfo += this.createContactRow(icons.phone, phone, 'Teléfono');
        }

        // Mobile (optional)
        if (mobile) {
            contactInfo += this.createContactRow(icons.mobile, mobile, 'Móvil');
        }

        // Website
        contactInfo += this.createContactRow(
            icons.web, 
            `<a href="https://${this.config.appConfig.company.website}" style="color: #33479c; text-decoration: none;">${this.config.appConfig.company.website}</a>`, 
            'Web'
        );

        return contactInfo;
    }

    createContactRow(iconSrc, content, alt) {
        return `
        <tr>
            <td style="padding: 2px 0;"><img src="${iconSrc}" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 8px;" alt="${alt}"></td>
            <td style="font-size: 11pt; color: #000; padding: 2px 0;">${content}</td>
        </tr>`;
    }

    buildSocialIcons() {
        const { socialMedia } = this.config.appConfig;
        const icons = this.config.appConfig.assets.icons;
        
        return `
        <tr>
            <td colspan="2" style="padding: 8px 0 2px 0;">
                <a href="${socialMedia.facebook}" style="margin-right: 8px;"><img src="${icons.facebook}" style="width: 16px; height: 16px;" alt="Facebook"></a>
                <a href="${socialMedia.instagram}" style="margin-right: 8px;"><img src="${icons.instagram}" style="width: 16px; height: 16px;" alt="Instagram"></a>
                <a href="${socialMedia.linkedin}"><img src="${icons.linkedin}" style="width: 16px; height: 16px;" alt="LinkedIn"></a>
            </td>
        </tr>`;
    }

    createDisclaimerText() {
        const companyName = this.config.appConfig.company.fullName;
        
        return `
<div style="font-size: 8pt; color: #666; font-family: 'Trebuchet MS', Arial, Helvetica, sans-serif; padding: 10px 0; margin-top: 15px; border-top: 1px solid #ddd; text-align: justify;">
    <strong>CONFIDENCIALIDAD:</strong> Este mensaje y cualquier archivo adjunto pueden contener información confidencial y privilegiada. Si usted no es el destinatario previsto, por favor notifique al remitente inmediatamente y elimine este mensaje. Cualquier revisión, divulgación, copia o distribución no autorizada está estrictamente prohibida.<br><br>
    Está estrictamente prohibido:<br><br>
    • Utilizar esta información con fines distintos a los de ${companyName}.<br>
    • Compartirla o divulgarla a terceros sin autorización.<br>
    • Reproducir total o parcialmente su contenido.<br><br>
    La empresa no asume responsabilidad por información, opiniones o criterios que no estén directamente relacionados con ${companyName}. Si usted ha recibido este mensaje por error, por favor notifíquelo inmediatamente al remitente y elimine este mensaje de forma permanente.
</div>`;
    }

    displaySignature(signatureHTML) {
        document.getElementById('signatureContent').innerHTML = signatureHTML;
        document.getElementById('signaturePreview').style.display = 'block';
    }

    // Download functionality
    async downloadSignature() {
        const signatureElement = document.getElementById('signatureContent');
        
        try {
            const canvas = await html2canvas(signatureElement, {
                backgroundColor: '#ffffff',
                scale: 2,
                useCORS: true
            });
            
            this.downloadCanvasAsImage(canvas);
        } catch (error) {
            this.handleError('Download failed', error);
            this.showMessage(this.config.appConfig.ui.messages.downloadError);
        }
    }

    downloadCanvasAsImage(canvas) {
        const link = document.createElement('a');
        link.download = `firma_${this.state.currentUser.fullName.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL();
        link.click();
    }


    // Reset functionality
    startOver() {
        this.state.currentUser = this.createEmptyUser();
        this.resetForm();
    }

    resetForm() {
        const fields = ['fullName', 'email', 'position', 'phone', 'mobile'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) field.value = '';
        });

        const preview = document.getElementById('signaturePreview');
        if (preview) preview.style.display = 'none';
    }

    // Utility methods
    showMessage(message) {
        alert(message);
    }

    handleError(context, error) {
        console.error(`${context}:`, error);
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.signatureApp = new SignatureApp();
});