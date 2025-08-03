/**
 * Signature Generator Application
 * Clean Architecture with SOLID principles
 */
class SignatureApp {
    constructor() {
        this._initializeDependencies();
        this._bindEventHandlers();
    }

    _initializeDependencies() {
        this.config = configManager.appConfig;
        this.userModel = new UserModel();
        this.navigationController = new NavigationController();
        this.emailValidator = new EmailValidator();
        this.signatureService = new SignatureService(this.config);
        this.downloadService = new DownloadService();
    }

    _bindEventHandlers() {
        window.validateAccess = this.validateAccess.bind(this);
        window.goBackToValidation = this.goBackToValidation.bind(this);
        window.generateSignature = this.generateSignature.bind(this);
        window.downloadSignature = this.downloadSignature.bind(this);
        window.startOver = this.startOver.bind(this);
    }

    // Access validation workflow
    validateAccess() {
        const formData = FormUtils.extractFormData(['validateName', 'validateEmail']);
        
        if (!this._isValidAccessForm(formData)) {
            return;
        }

        if (!this.emailValidator.isValid(formData.validateEmail)) {
            MessageUtils.showError(this.emailValidator.getValidationMessage());
            return;
        }

        this._processValidAccess(formData);
    }

    _isValidAccessForm(formData) {
        const missingFields = FormUtils.validateRequired(['validateName', 'validateEmail']);
        if (missingFields.length > 0) {
            MessageUtils.showError('Por favor complete todos los campos.');
            return false;
        }
        return true;
    }

    _processValidAccess(formData) {
        this.userModel.updateData({
            fullName: formData.validateName,
            email: formData.validateEmail,
            validated: true
        });

        this.navigationController.showScreen('signatureForm');
        this._populateSignatureForm();
    }

    _populateSignatureForm() {
        const userData = this.userModel.getData();
        FormUtils.populateForm({
            fullName: userData.fullName,
            email: userData.email
        });
    }

    goBackToValidation() {
        this.navigationController.showScreen('accessValidation');
    }

    // Signature generation workflow
    generateSignature() {
        if (!this.userModel.isValidated()) {
            MessageUtils.showError('Debe validar su acceso primero.');
            this.navigationController.showScreen('accessValidation');
            return;
        }

        const formData = FormUtils.extractFormData(['fullName', 'email', 'position', 'phone', 'mobile']);
        
        if (!this._isValidSignatureForm(formData)) {
            return;
        }

        this._processSignatureGeneration(formData);
    }

    _isValidSignatureForm(formData) {
        const missingFields = FormUtils.validateRequired(['fullName', 'email', 'position']);
        if (missingFields.length > 0) {
            MessageUtils.showError('Por favor complete todos los campos requeridos.');
            return false;
        }
        return true;
    }

    _processSignatureGeneration(formData) {
        this.userModel.updateData(formData);
        
        const signatureHTML = this.signatureService.generateHTML(this.userModel.getData());
        this._displaySignature(signatureHTML);
    }

    _displaySignature(signatureHTML) {
        const contentElement = document.getElementById('signatureContent');
        const previewElement = document.getElementById('signaturePreview');
        
        if (contentElement && previewElement) {
            contentElement.innerHTML = signatureHTML;
            previewElement.style.display = 'block';
        }
    }

    // Download workflow
    async downloadSignature() {
        const signatureElement = document.getElementById('signatureContent');
        const fileName = this.userModel.getFileName();
        
        try {
            await this.downloadService.downloadAsImage(signatureElement, fileName);
        } catch (error) {
            console.error('Download error:', error);
            MessageUtils.showError(this.config.ui.messages.downloadError);
        }
    }

    // Reset workflow
    startOver() {
        this.userModel.reset();
        this._resetAllForms();
        this.navigationController.showScreen('accessValidation');
    }

    _resetAllForms() {
        FormUtils.clearForm(['validateName', 'validateEmail']);
        FormUtils.clearForm(['fullName', 'email', 'position', 'phone', 'mobile']);
        
        const preview = document.getElementById('signaturePreview');
        if (preview) {
            preview.style.display = 'none';
        }
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.signatureApp = new SignatureApp();
});

if (typeof window !== 'undefined') {
    window.SignatureApp = SignatureApp;
}