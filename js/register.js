document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("registerForm");
    const error = document.getElementById("RegError");
    
    form.addEventListener('submit', event => {
        event.preventDefault();

        const email = document.getElementById("regEmail").value;
        const password = document.getElementById("regPassword").value;
        const username = document.getElementById("username").value;

        fetch('http://127.0.0.1:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password, username}),
        })
        .then(response => {
            if(response.status == 200 || response.status == 403 || response.status == 401) return response.json();
        })
        .then(data => {
            if(!data) return error.textContent = "Erreur interne. Contactez un administrateur."
            if(data.error) {
                console.log(`[WEB ERROR][REGISTER] - ${data.error}`);
                return error.textContent = data.error;
            } else {
                localStorage.setItem('token', data.token);
                window.location.href = "./profile.html"
            }
        })
        .catch(e => {
            console.log(`[WEB ERROR][REGISTER] - ${e}`);
            return error.textContent = "Erreur interne. Contactez un administrateur."
        });
    });
});