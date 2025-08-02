/**
 * Signature Generator Application
 * Modern ES6+ implementation with improved architecture
 */

class SignatureApp {
    constructor() {
        this.config = configManager;
        this.state = {
            currentUser: this.createEmptyUser(),
            generatedToken: '',
            currentScreen: 1
        };
        
        this.init();
    }

    // Initialization
    async init() {
        try {
            this.initializeEmailJS();
            this.bindEventHandlers();
            this.validateConfiguration();
            this.goToScreen(this.config.appConfig.ui.screens.identity);
        } catch (error) {
            this.handleError('Initialization error', error);
        }
    }

    initializeEmailJS() {
        emailjs.init(this.config.emailConfig.publicKey);
    }

    bindEventHandlers() {
        // Identity form
        const identityForm = document.getElementById('identityForm');
        if (identityForm) {
            identityForm.addEventListener('submit', this.handleIdentitySubmit.bind(this));
        }

        // Token form
        const tokenForm = document.getElementById('tokenForm');
        if (tokenForm) {
            tokenForm.addEventListener('submit', this.handleTokenSubmit.bind(this));
        }

        // Add global methods for HTML onclick handlers
        window.generateSignature = this.generateSignature.bind(this);
        window.downloadSignature = this.downloadSignature.bind(this);
        window.sendSignatureByEmail = this.sendSignatureByEmail.bind(this);
        window.startOver = this.startOver.bind(this);
        window.goToScreen = this.goToScreen.bind(this);
    }

    // State management
    createEmptyUser() {
        return {
            fullName: '',
            email: '',
            token: '',
            position: '',
            phone: '',
            mobile: ''
        };
    }

    updateUser(userData) {
        this.state.currentUser = { ...this.state.currentUser, ...userData };
    }

    // Validation
    validateConfiguration() {
        const errors = this.config.validateEmailConfig();
        if (errors.length > 0) {
            console.warn('⚠️ Configuration issues:', errors);
            this.showConfigurationWarning(errors);
        } else {
            console.log('✅ Configuration validated successfully');
        }
    }

    showConfigurationWarning(errors) {
        if (errors.includes('Service ID no configurado')) {
            const warningDiv = this.createWarningElement();
            document.body.appendChild(warningDiv);
            setTimeout(() => warningDiv.remove(), 10000);
        }
    }

    createWarningElement() {
        const div = document.createElement('div');
        div.style.cssText = `
            position: fixed; top: 10px; right: 10px; background: #fff3cd;
            border: 1px solid #ffeaa7; color: #856404; padding: 15px;
            border-radius: 5px; z-index: 1000; max-width: 300px;
            font-size: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        `;
        div.innerHTML = `
            <strong>⚠️ Configuración requerida</strong><br>
            Service ID de EmailJS no configurado.<br>
            <a href="https://dashboard.emailjs.com/admin" target="_blank" style="color: #007bff;">
                Ir a EmailJS Dashboard
            </a>
        `;
        return div;
    }

    // Navigation
    goToScreen(screenNumber) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        const targetScreen = screenNumber === 'reject' 
            ? 'screenReject' 
            : `screen${screenNumber}`;
            
        const screen = document.getElementById(targetScreen);
        if (screen) {
            screen.classList.add('active');
            this.state.currentScreen = screenNumber;
        }
    }

    // Form handlers
    async handleIdentitySubmit(e) {
        e.preventDefault();
        
        const formData = this.extractFormData(e.target);
        const button = e.target.querySelector('button[type="submit"]');
        
        if (!this.config.isValidCorporateEmail(formData.email)) {
            this.goToScreen('reject');
            return;
        }

        await this.processIdentityValidation(formData, button);
    }

    async processIdentityValidation(formData, button) {
        const originalText = button.textContent;
        
        try {
            this.setButtonState(button, 'Enviando...', true);
            
            this.updateUser({
                fullName: formData.fullName,
                email: formData.email.toLowerCase()
            });
            
            this.state.generatedToken = this.config.generateToken();
            
            const success = await this.sendTokenEmail();
            
            if (success) {
                this.updateTokenDisplay();
                this.showMessage(this.config.appConfig.ui.messages.tokenSent);
                this.goToScreen(this.config.appConfig.ui.screens.token);
            }
        } catch (error) {
            this.handleError('Identity validation failed', error);
            this.showMessage(this.config.appConfig.ui.messages.emailError);
        } finally {
            this.setButtonState(button, originalText, false);
        }
    }

    handleTokenSubmit(e) {
        e.preventDefault();
        
        const enteredToken = document.getElementById('token').value.trim().toUpperCase();
        
        if (enteredToken === this.state.generatedToken) {
            this.updateUser({ token: enteredToken });
            this.goToScreen(this.config.appConfig.ui.screens.signature);
        } else {
            this.showMessage(this.config.appConfig.ui.messages.tokenInvalid);
            this.clearAndFocusElement('token');
        }
    }

    // Email functionality
    async sendTokenEmail() {
        const errors = this.config.validateEmailConfig();
        if (errors.length > 0) {
            throw new Error(`Configuration incomplete: ${errors.join(', ')}`);
        }

        const { fullName, email } = this.state.currentUser;
        const templateParams = this.createTokenEmailParams(email, this.state.generatedToken, fullName);
        
        try {
            await emailjs.send(
                this.config.emailConfig.serviceId,
                this.config.emailConfig.templates.token,
                templateParams
            );
            console.log('✅ Token sent successfully');
            return true;
        } catch (error) {
            this.handleEmailError(error, 'token');
            return false;
        }
    }

    createTokenEmailParams(email, token, fullName) {
        const template = this.config.getEmailTemplate('token');
        
        return {
            to_email: email,
            to_name: fullName,
            token: token,
            from_name: template.fromName,
            message: this.createTokenMessage(fullName, token)
        };
    }

    createTokenMessage(fullName, token) {
        return `
Estimado/a ${fullName},

Su token de verificación para el generador de firmas corporativas es: ${token}

Por favor ingrese este código en la pantalla de verificación para continuar con la generación de su firma.

Este token es válido por ${this.config.emailConfig.token.expiryMinutes} minutos.

Si usted no solicitó este token, puede ignorar este mensaje.

Saludos,
Equipo de TI - ${this.config.appConfig.company.fullName}
        `.trim();
    }

    // Signature generation
    generateSignature() {
        const formData = this.extractSignatureFormData();
        
        if (!formData.position) {
            this.showMessage(this.config.appConfig.ui.messages.positionRequired);
            return;
        }

        this.updateUser(formData);
        
        const signatureHTML = this.createSignatureHTML();
        this.displaySignature(signatureHTML);
    }

    extractSignatureFormData() {
        return {
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

    // Email signature functionality
    async sendSignatureByEmail() {
        const errors = this.config.validateEmailConfig();
        if (errors.length > 0) {
            this.showMessage(`Configuration incomplete: ${errors.join(', ')}`);
            return;
        }

        try {
            const emailContent = this.createSignatureEmailContent();
            const templateParams = this.createSignatureEmailParams(emailContent);
            
            await emailjs.send(
                this.config.emailConfig.serviceId,
                this.config.emailConfig.templates.signature,
                templateParams
            );
            
            console.log('✅ Signature sent successfully');
            this.showMessage(this.config.appConfig.ui.messages.signatureSent);
            this.goToScreen(this.config.appConfig.ui.screens.complete);
        } catch (error) {
            this.handleEmailError(error, 'signature');
        }
    }

    createSignatureEmailContent() {
        const signatureHTML = this.createSignatureHTML();
        const companyName = this.config.appConfig.company.fullName;
        
        return `
<h2>Su Firma Corporativa - ${companyName}</h2>
<p>Estimado/a ${this.state.currentUser.fullName},</p>
<p>A continuación encontrará su firma corporativa generada:</p>
<div style="border: 1px solid #ccc; padding: 15px; margin: 20px 0; background: #f9f9f9;">
    ${signatureHTML}
</div>
${this.getEmailClientGuides()}
<p>Si necesita ayuda adicional, puede contactar al departamento de TI.</p>
<p>Saludos cordiales,<br>Equipo de TI - ${companyName}</p>
        `;
    }

    createSignatureEmailParams(emailContent) {
        const template = this.config.getEmailTemplate('signature', {
            companyName: this.config.appConfig.company.fullName
        });

        return {
            to_email: this.state.currentUser.email,
            to_name: this.state.currentUser.fullName,
            subject: template.subject,
            html_content: emailContent,
            from_name: template.fromName
        };
    }

    getEmailClientGuides() {
        return `
<h3>Guía para configurar su firma en Outlook:</h3>
<div style="background: #f0f8ff; padding: 15px; border-left: 4px solid #33479c; margin: 10px 0;">
    ${this.getOutlookGuide()}
</div>
<h3>Guía para configurar su firma en Thunderbird:</h3>
<div style="background: #f0f8ff; padding: 15px; border-left: 4px solid #33479c; margin: 10px 0;">
    ${this.getThunderbirdGuide()}
</div>
        `;
    }

    getOutlookGuide() {
        return `
<h4>Pasos para configurar en Microsoft Outlook:</h4>
<ol>
    <li><strong>Abra Outlook</strong> en su computador</li>
    <li>Vaya al menú <strong>"Archivo"</strong> → <strong>"Opciones"</strong></li>
    <li>En la ventana que se abre, seleccione <strong>"Correo"</strong> en el panel izquierdo</li>
    <li>Haga clic en <strong>"Firmas..."</strong></li>
    <li>Haga clic en <strong>"Nuevo"</strong> para crear una nueva firma</li>
    <li>Escriba un nombre para su firma (ej: "Mi Firma INNOVATE")</li>
    <li>En el editor de firma, pegue el contenido HTML de su firma desde este correo</li>
    <li>Seleccione esta firma para <strong>"Mensajes nuevos"</strong> y <strong>"Respuestas y reenvíos"</strong></li>
    <li>Haga clic en <strong>"Aceptar"</strong> para guardar</li>
</ol>
<p><strong>Nota importante:</strong> Si copia la firma desde este correo, asegúrese de seleccionar todo el contenido visual, no solo el texto.</p>
        `;
    }

    getThunderbirdGuide() {
        return `
<h4>Pasos para configurar en Mozilla Thunderbird:</h4>
<ol>
    <li><strong>Abra Thunderbird</strong> en su computador</li>
    <li>Vaya al menú <strong>"Herramientas"</strong> → <strong>"Configuración de cuentas"</strong></li>
    <li>Seleccione su cuenta de correo en el panel izquierdo</li>
    <li>En la sección <strong>"Información de la cuenta"</strong>, busque <strong>"Texto de la firma"</strong></li>
    <li>Marque la casilla <strong>"Adjuntar esta firma"</strong></li>
    <li>Si desea usar HTML, marque <strong>"Usar HTML"</strong></li>
    <li>Pegue el contenido de su firma en el cuadro de texto</li>
    <li>Haga clic en <strong>"Aceptar"</strong> para guardar</li>
</ol>
<p><strong>Alternativa:</strong> También puede crear un archivo .html con su firma y seleccionarlo usando la opción "Adjuntar la firma de un archivo".</p>
        `;
    }

    // Reset functionality
    startOver() {
        this.state.currentUser = this.createEmptyUser();
        this.state.generatedToken = '';
        
        this.resetForms();
        this.goToScreen(this.config.appConfig.ui.screens.identity);
    }

    resetForms() {
        const forms = ['identityForm', 'tokenForm'];
        forms.forEach(formId => {
            const form = document.getElementById(formId);
            if (form) form.reset();
        });

        const fields = ['position', 'phone', 'mobile'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) field.value = '';
        });

        const preview = document.getElementById('signaturePreview');
        if (preview) preview.style.display = 'none';
    }

    // Utility methods
    extractFormData(form) {
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value.trim();
        }
        return data;
    }

    setButtonState(button, text, disabled) {
        button.textContent = text;
        button.disabled = disabled;
    }

    updateTokenDisplay() {
        const nameElement = document.getElementById('displayName');
        const emailElement = document.getElementById('displayEmail');
        
        if (nameElement) nameElement.textContent = this.state.currentUser.fullName;
        if (emailElement) emailElement.textContent = this.state.currentUser.email;
    }

    clearAndFocusElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.value = '';
            element.focus();
        }
    }

    showMessage(message) {
        alert(message);
    }

    handleError(context, error) {
        console.error(`${context}:`, error);
    }

    handleEmailError(error, type) {
        console.error(`❌ Error sending ${type}:`, error);
        
        if (error.status === 400) {
            if (error.text?.includes('service ID not found')) {
                this.showMessage(`❌ SERVICE ID INCORRECTO\n\nEl Service ID "${this.config.emailConfig.serviceId}" no existe.\n\nRevisa la configuración en config.js`);
            } else if (error.text?.includes('template')) {
                const templateId = type === 'token' ? this.config.emailConfig.templates.token : this.config.emailConfig.templates.signature;
                this.showMessage(`❌ TEMPLATE ID INCORRECTO\n\nEl Template ID "${templateId}" no existe.\n\nVerifica que tengas el template correcto en EmailJS.`);
            } else {
                this.showMessage(`❌ Error: ${error.text || 'Configuración incorrecta'}`);
            }
        } else if (error.status === 401) {
            this.showMessage(`❌ CLAVE PÚBLICA INCORRECTA\n\nLa Public Key "${this.config.emailConfig.publicKey}" no es válida.\n\nVerifica tu Public Key en EmailJS.`);
        } else {
            this.showMessage(`❌ Error enviando ${type}: ${error.text || error.message || 'Error desconocido'}`);
        }
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.signatureApp = new SignatureApp();
});