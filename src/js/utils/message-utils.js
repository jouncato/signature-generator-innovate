/**
 * Message Utilities
 * Single Responsibility: Handle user messages and notifications
 */
class MessageUtils {
    static showMessage(message, type = 'info') {
        // For now using alert, could be enhanced with custom modal
        alert(message);
    }

    static showError(message) {
        this.showMessage(message, 'error');
    }

    static showSuccess(message) {
        this.showMessage(message, 'success');
    }

    static getValidationMessage(missingFields) {
        if (missingFields.length === 0) {
            return '';
        }
        
        return `Por favor complete los siguientes campos: ${missingFields.join(', ')}`;
    }
}

if (typeof window !== 'undefined') {
    window.MessageUtils = MessageUtils;
}