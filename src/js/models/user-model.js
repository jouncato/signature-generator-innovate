/**
 * User Model
 * Single Responsibility: Manage user data and validation state
 */
class UserModel {
    constructor() {
        this.data = this._createEmptyUser();
    }

    _createEmptyUser() {
        return {
            fullName: '',
            email: '',
            position: '',
            phone: '',
            mobile: '',
            validated: false
        };
    }

    updateData(userData) {
        this.data = { ...this.data, ...userData };
    }

    getData() {
        return { ...this.data };
    }

    isValidated() {
        return this.data.validated;
    }

    hasRequiredFields() {
        return !!(this.data.fullName && this.data.email && this.data.position);
    }

    reset() {
        this.data = this._createEmptyUser();
    }

    getFileName() {
        return `firma_${this.data.fullName.replace(/\s+/g, '_')}`;
    }
}

if (typeof window !== 'undefined') {
    window.UserModel = UserModel;
}