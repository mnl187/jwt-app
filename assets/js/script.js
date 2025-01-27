function base64UrlDecode(str) {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    base64 += '='.repeat((4 - base64.length % 4) % 4); // Uzupełnianie na długość Base64
    return decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

function decodeJWT(token) {
    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('Invalid JWT token');
    }
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    return { header, payload };
}

document.getElementById('decode-btn').addEventListener('click', function() {
    const jwtInput = document.getElementById('jwt-input').value;
    try {
        const decoded = decodeJWT(jwtInput);
        document.getElementById('header-output').textContent = JSON.stringify(decoded.header, null, 2);
        document.getElementById('body-output').textContent = JSON.stringify(decoded.payload, null, 2);
    } catch (e) {
        let errorMessage = 'Invalid token: ' + e.message;
        if (e.message === 'Invalid JWT token') {
            errorMessage = 'Nieprawidłowy token: ' + e.message;
        }
        document.getElementById('header-output').textContent = errorMessage;
        document.getElementById('body-output').textContent = '';
    }
});