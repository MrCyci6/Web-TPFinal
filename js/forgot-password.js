
document.addEventListener("DOMContentLoaded",  () => {

    let form = document.getElementById("reset");
    let success = document.getElementById("success");
    let error = document.getElementById("error")

    form.addEventListener("submit", e => {
        e.preventDefault();

        let email = document.getElementById("email").value;

        if(email && email != "") {
            fetch('http://2.58.56.147:5001/forgotpassword', {
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
                    return success.textContent = "E-mail de réinitialisation de mot de passe envoyé !"
                }
            })
            .catch(e => {
                console.log(`[WEB ERROR][LOGIN] - ${e}`);
                return error.textContent = "Erreur interne. Contactez un administrateur."
            });
        }
    });

});