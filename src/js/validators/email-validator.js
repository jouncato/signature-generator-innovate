/**
 * Email Validator
 * Single Responsibility: Validates email domains
 */
class EmailValidator {
    constructor(allowedDomain = '@innovatenutrition.com') {
        this.allowedDomain = allowedDomain;
    }

    isValid(email) {
        if (!email || typeof email !== 'string') {
            return false;
        }
        
        return email.toLowerCase().endsWith(this.allowedDomain);
    }

    getValidationMessage() {
        return `Solo se permiten correos electrónicos de ${this.allowedDomain}`;
    }
}

if (typeof window !== 'undefined') {
    window.EmailValidator = EmailValidator;
}