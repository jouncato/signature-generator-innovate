/**
 * Form Utilities
 * Single Responsibility: Handle form operations
 */
class FormUtils {
    static extractFormData(fieldIds) {
        const data = {};
        fieldIds.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            data[fieldId] = element ? element.value.trim() : '';
        });
        return data;
    }

    static populateForm(fieldData) {
        Object.entries(fieldData).forEach(([fieldId, value]) => {
            const element = document.getElementById(fieldId);
            if (element) {
                element.value = value;
            }
        });
    }

    static clearForm(fieldIds) {
        fieldIds.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                element.value = '';
            }
        });
    }

    static validateRequired(fieldIds) {
        const missingFields = [];
        fieldIds.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (!element || !element.value.trim()) {
                missingFields.push(fieldId);
            }
        });
        return missingFields;
    }
}

if (typeof window !== 'undefined') {
    window.FormUtils = FormUtils;
}