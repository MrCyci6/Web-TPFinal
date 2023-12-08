document.addEventListener("DOMContentLoaded",  () => {
    const form = document.getElementById("loginForm");
    const error = document.getElementById("error");
    
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');
    
    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
    });
    
    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });
      
    form.addEventListener("submit", e => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        fetch('http://2.58.56.147:5001/connect', {
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
            if(!data) return error.textContent = "Erreur interne. Contactez un administrateur.";
            if(data.error) {
                return error.textContent = data.error;
            } else {
                localStorage.setItem('token', data.token);
                window.location.href = "./profile.html"
            }
        })
        .catch(e => {
            console.log(`[WEB ERROR][LOGIN] - ${e}`);
            return error.textContent = "Erreur interne. Contactez un administrateur."
        });
    });
});