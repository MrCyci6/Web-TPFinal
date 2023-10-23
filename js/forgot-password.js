firebase.initializeApp(firebaseConfig);

document.addEventListener("DOMContentLoaded",  () => {

    let auth = firebase.auth();
    let form = document.getElementById("reset");
    let success = document.getElementById("success");
    let error = document.getElementById("error")

    form.addEventListener("submit", e => {
        e.preventDefault();

        let email = document.getElementById("email").value;

        if(email && email != "") {
            auth.sendPasswordResetEmail(email)
            .then(() => {
                success.textContent = "E-mail envoyé, verifiez votre boîte mail.";
            })
            .catch(e => {
                console.error("Erreur :" + e);
                error.textContent = "Ereur lors de l'envoie du mail.";
            });
        }
    });

});