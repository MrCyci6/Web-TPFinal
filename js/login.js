document.addEventListener("DOMContentLoaded",  () => {
    const form = document.getElementById("form");
    const error = document.getElementById("error");
      
    firebase.initializeApp(firebaseConfig);

    form.addEventListener("submit", e => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(user => {
                //console.log("Connexion réussie :", user);
                console.log(`Connexion réussie.\nEmail: ${email}`);
                
                window.location.href = "profile.html"
            })
            .catch(e => {
                const json = JSON.parse(e.message)

                if(json && json.error.message == "INVALID_LOGIN_CREDENTIALS") {
                    error.textContent = "Identifiants incorrects.";
                } else {
                    console.error("Erreur :", e);
                    error.textContent = "Erreur interne.";
                }
            });
    });
});