/**
 * Signature Service
 * Single Responsibility: Generate HTML signature content
 */
class SignatureService {
    constructor(config) {
        this.config = config;
    }

    generateHTML(userData) {
        const { fullName, email, position, phone, mobile } = userData;
        const contactInfo = this._buildContactInfo(email, phone, mobile);
        const socialIcons = this._buildSocialIcons();
        
        return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Trebuchet MS', Arial, Helvetica, sans-serif; color: #000; max-width: 600px; background-color: #ffffff;">
    <tr>
        <td style="padding-right: 20px; vertical-align: top; width: 120px;">
            <img src="${this.config.company.logo}" alt="${this.config.company.name} Logo" style="max-width: 120px; height: auto;">
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
${this._createDisclaimerText()}
        `;
    }

    _buildContactInfo(email, phone, mobile) {
        const icons = this.config.assets.icons;
        let contactInfo = '';

        contactInfo += this._createContactRow(icons.email, `<a href="mailto:${email}" style="color: #33479c; text-decoration: none;">${email}</a>`, 'Email');

        if (phone) {
            contactInfo += this._createContactRow(icons.phone, phone, 'Teléfono');
        }

        if (mobile) {
            contactInfo += this._createContactRow(icons.mobile, mobile, 'Móvil');
        }

        contactInfo += this._createContactRow(
            icons.web, 
            `<a href="https://${this.config.company.website}" style="color: #33479c; text-decoration: none;">${this.config.company.website}</a>`, 
            'Web'
        );

        return contactInfo;
    }

    _createContactRow(iconSrc, content, alt) {
        return `
        <tr>
            <td style="padding: 2px 0;"><img src="${iconSrc}" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 8px;" alt="${alt}"></td>
            <td style="font-size: 11pt; color: #000; padding: 2px 0;">${content}</td>
        </tr>`;
    }

    _buildSocialIcons() {
        const { socialMedia } = this.config;
        const icons = this.config.assets.icons;
        
        return `
        <tr>
            <td colspan="2" style="padding: 8px 0 2px 0;">
                <a href="${socialMedia.facebook}" style="margin-right: 8px;"><img src="${icons.facebook}" style="width: 16px; height: 16px;" alt="Facebook"></a>
                <a href="${socialMedia.instagram}" style="margin-right: 8px;"><img src="${icons.instagram}" style="width: 16px; height: 16px;" alt="Instagram"></a>
                <a href="${socialMedia.linkedin}"><img src="${icons.linkedin}" style="width: 16px; height: 16px;" alt="LinkedIn"></a>
            </td>
        </tr>`;
    }

    _createDisclaimerText() {
        const companyName = this.config.company.fullName;
        
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
}

if (typeof window !== 'undefined') {
    window.SignatureService = SignatureService;
}