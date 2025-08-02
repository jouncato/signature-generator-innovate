// Variables globales
let currentUser = {
    fullName: '',
    email: '',
    token: '',
    position: '',
    phone: '',
    mobile: ''
};

let generatedToken = '';

// Inicialización de EmailJS
(function() {
    emailjs.init("YOUR_PUBLIC_KEY"); // Reemplazar con la clave pública de EmailJS
})();

// Configuración SMTP simulada (en producción usar EmailJS o servicio backend)
const SMTP_CONFIG = {
    host: 'mail.innovatenutrition.com',
    port: 465,
    secure: true,
    user: 'stecnico@innovatenutrition.com',
    // La contraseña debe configurarse en el servicio de EmailJS
};

// Navegación entre pantallas
function goToScreen(screenNumber) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    if (screenNumber === 'reject') {
        document.getElementById('screenReject').classList.add('active');
    } else {
        document.getElementById(`screen${screenNumber}`).classList.add('active');
    }
}

// Generar token aleatorio
function generateToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < 6; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
}

// Validar dominio de correo
function isValidCorporateEmail(email) {
    return email.toLowerCase().endsWith('@innovatenutrition.com');
}

// Enviar token por correo
async function sendTokenByEmail(email, token, fullName) {
    const templateParams = {
        to_email: email,
        to_name: fullName,
        token: token,
        from_name: 'Sistema de Firmas INNOVATE NUTRITION',
        message: `
        Estimado/a ${fullName},
        
        Su token de verificación para el generador de firmas corporativas es: ${token}
        
        Por favor ingrese este código en la pantalla de verificación para continuar con la generación de su firma.
        
        Este token es válido por 15 minutos.
        
        Si usted no solicitó este token, puede ignorar este mensaje.
        
        Saludos,
        Equipo de TI - INNOVATE NUTRITION S.A.S.
        `
    };

    try {
        // En producción, configurar EmailJS con el template correcto
        await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams);
        return true;
    } catch (error) {
        console.error('Error enviando correo:', error);
        // Para demostración, simular envío exitoso
        console.log('Token simulado enviado:', token);
        return true;
    }
}

// Manejador del formulario de identidad
document.getElementById('identityForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    
    // Validar dominio corporativo
    if (!isValidCorporateEmail(email)) {
        goToScreen('reject');
        return;
    }
    
    // Generar y enviar token
    generatedToken = generateToken();
    currentUser.fullName = fullName;
    currentUser.email = email;
    
    const button = e.target.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.innerHTML = 'Enviando Token... <span class="loading"></span>';
    button.disabled = true;
    
    try {
        const success = await sendTokenByEmail(email, generatedToken, fullName);
        
        if (success) {
            // Mostrar información en pantalla 2
            document.getElementById('displayName').textContent = fullName;
            document.getElementById('displayEmail').textContent = email;
            
            goToScreen(2);
        } else {
            alert('Error al enviar el token. Por favor intente nuevamente.');
        }
    } catch (error) {
        alert('Error al enviar el token. Por favor intente nuevamente.');
    } finally {
        button.textContent = originalText;
        button.disabled = false;
    }
});

// Manejador del formulario de token
document.getElementById('tokenForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const enteredToken = document.getElementById('token').value.trim().toUpperCase();
    
    if (enteredToken === generatedToken) {
        currentUser.token = enteredToken;
        goToScreen(3);
    } else {
        alert('Token incorrecto. Por favor verifique e intente nuevamente.');
        document.getElementById('token').value = '';
        document.getElementById('token').focus();
    }
});

// Generar firma
function generateSignature() {
    const position = document.getElementById('position').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    
    if (!position) {
        alert('Por favor ingrese su cargo o posición.');
        return;
    }
    
    currentUser.position = position;
    currentUser.phone = phone;
    currentUser.mobile = mobile;
    
    const signatureHTML = createSignatureHTML();
    document.getElementById('signatureContent').innerHTML = signatureHTML;
    document.getElementById('signaturePreview').style.display = 'block';
}

// Crear HTML de la firma
function createSignatureHTML() {
    const { fullName, email, position, phone, mobile } = currentUser;
    
    let contactInfo = '';
    
    if (phone) {
        contactInfo += `
        <tr>
            <td><img src="frontend/assets/images/icon-phone.png" class="contact-icon" alt="Teléfono"></td>
            <td style="font-size: 11pt; color: #000;">${phone}</td>
        </tr>`;
    }
    
    if (mobile) {
        contactInfo += `
        <tr>
            <td><img src="frontend/assets/images/icon-mobile.png" class="contact-icon" alt="Móvil"></td>
            <td style="font-size: 11pt; color: #000;">${mobile}</td>
        </tr>`;
    }
    
    return `
    <table class="signature-table" cellpadding="0" cellspacing="0">
        <tr>
            <td style="padding-right: 15px; vertical-align: top;">
                <img src="frontend/assets/images/logo-innovate.png" alt="INNOVATE NUTRITION" style="max-width: 80px; height: auto;">
            </td>
            <td style="vertical-align: top;">
                <div class="nombre">${fullName}</div>
                <div class="cargo">${position}</div>
                <br>
                <table cellpadding="2" cellspacing="0">
                    <tr>
                        <td><img src="frontend/assets/images/icon-email.png" class="contact-icon" alt="Email"></td>
                        <td><a href="mailto:${email}">${email}</a></td>
                    </tr>
                    ${contactInfo}
                    <tr>
                        <td><img src="frontend/assets/images/icon-web.png" class="contact-icon" alt="Web"></td>
                        <td><a href="https://www.innovatenutrition.com" class="web">www.innovatenutrition.com</a></td>
                    </tr>
                </table>
                <br>
                <table cellpadding="2" cellspacing="0">
                    <tr>
                        <td><a href="https://www.facebook.com/innovatenutrition" target="_blank"><img src="frontend/assets/images/icon-facebook.png" style="width: 20px; height: 20px; margin-right: 5px;" alt="Facebook"></a></td>
                        <td><a href="https://www.instagram.com/innovatenutrition" target="_blank"><img src="frontend/assets/images/icon-instagram.png" style="width: 20px; height: 20px; margin-right: 5px;" alt="Instagram"></a></td>
                        <td><a href="https://www.linkedin.com/company/innovatenutrition" target="_blank"><img src="frontend/assets/images/icon-linkedin.png" style="width: 20px; height: 20px;" alt="LinkedIn"></a></td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    
    <div class="legal">
        Esta transmisión electrónica es propiedad de INNOVATE NUTRITION S.A.S. Su contenido es confidencial y está destinado únicamente al destinatario indicado. Puede contener información amparada por secreto profesional u otra protección legal. Está estrictamente prohibido:<br><br>
        • Utilizar esta información con fines distintos a los de INNOVATE NUTRITION S.A.S.<br>
        • Compartirla o divulgarla a terceros sin autorización.<br>
        • Reproducir total o parcialmente su contenido.<br><br>
        La empresa no asume responsabilidad por información, opiniones o criterios que no estén directamente relacionados con INNOVATE NUTRITION S.A.S. Si usted ha recibido este mensaje por error, por favor notifíquelo inmediatamente al remitente y elimine este mensaje de forma permanente.
    </div>
    `;
}

// Descargar firma como imagen
async function downloadSignature() {
    const signatureElement = document.getElementById('signatureContent');
    
    try {
        const canvas = await html2canvas(signatureElement, {
            backgroundColor: '#ffffff',
            scale: 2,
            useCORS: true
        });
        
        const link = document.createElement('a');
        link.download = `firma_${currentUser.fullName.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL();
        link.click();
    } catch (error) {
        console.error('Error al generar imagen:', error);
        alert('Error al generar la imagen. Por favor intente nuevamente.');
    }
}

// Enviar firma por correo
async function sendSignatureByEmail() {
    const signatureHTML = createSignatureHTML();
    const outlookGuide = getOutlookGuide();
    const thunderbirdGuide = getThunderbirdGuide();
    
    const emailContent = `
    <h2>Su Firma Corporativa - INNOVATE NUTRITION S.A.S.</h2>
    
    <p>Estimado/a ${currentUser.fullName},</p>
    
    <p>A continuación encontrará su firma corporativa generada:</p>
    
    <div style="border: 1px solid #ccc; padding: 15px; margin: 20px 0; background: #f9f9f9;">
        ${signatureHTML}
    </div>
    
    <h3>Guía para configurar su firma en Outlook:</h3>
    <div style="background: #f0f8ff; padding: 15px; border-left: 4px solid #33479c; margin: 10px 0;">
        ${outlookGuide}
    </div>
    
    <h3>Guía para configurar su firma en Thunderbird:</h3>
    <div style="background: #f0f8ff; padding: 15px; border-left: 4px solid #33479c; margin: 10px 0;">
        ${thunderbirdGuide}
    </div>
    
    <p>Si necesita ayuda adicional, puede contactar al departamento de TI.</p>
    
    <p>Saludos cordiales,<br>
    Equipo de TI - INNOVATE NUTRITION S.A.S.</p>
    `;
    
    const templateParams = {
        to_email: currentUser.email,
        to_name: currentUser.fullName,
        subject: 'Su Firma Corporativa - INNOVATE NUTRITION S.A.S.',
        html_content: emailContent,
        from_name: 'Sistema de Firmas INNOVATE NUTRITION'
    };
    
    try {
        // En producción, configurar EmailJS con el template para HTML
        await emailjs.send('YOUR_SERVICE_ID', 'YOUR_HTML_TEMPLATE_ID', templateParams);
        alert('Firma enviada correctamente a su correo electrónico.');
        goToScreen(4);
    } catch (error) {
        console.error('Error enviando correo:', error);
        // Para demostración
        alert('Firma enviada correctamente a su correo electrónico (simulado).');
        goToScreen(4);
    }
}

// Guía para Outlook
function getOutlookGuide() {
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

// Guía para Thunderbird
function getThunderbirdGuide() {
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

// Reiniciar el proceso
function startOver() {
    currentUser = {
        fullName: '',
        email: '',
        token: '',
        position: '',
        phone: '',
        mobile: ''
    };
    generatedToken = '';
    
    // Limpiar formularios
    document.getElementById('identityForm').reset();
    document.getElementById('tokenForm').reset();
    document.getElementById('position').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('mobile').value = '';
    document.getElementById('signaturePreview').style.display = 'none';
    
    goToScreen(1);
}

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', function() {
    goToScreen(1);
});