document.addEventListener("DOMContentLoaded",  () => {
    const form = document.getElementById("form");
    const error = document.getElementById("error");
      
    form.addEventListener("submit", e => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        fetch('http://127.0.0.1:5000/connect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password}),
        })
        .then(response => {
            if(response.status == 200 || response.status == 403 || response.status == 401) return response.json();
        })
        .then(data => {
            if(data.error) {
                return error.textContent = data.error;
            } else {
                localStorage.setItem('token', data.token);
                window.location.href = "./profile.html";
            }
        })
        .catch(e => {
            console.log(`[WEB ERROR][LOGIN] - ${e}`);
            return error.textContent = "Erreur interne. Contactez un administrateur."
        });
    });
});