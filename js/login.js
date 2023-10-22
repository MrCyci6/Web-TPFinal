document.addEventListener("DOMContentLoaded",  () => {
    const form = document.getElementById("form");
    const error = document.getElementById("error");

    const firebaseConfig = {
        apiKey: "AIzaSyClU4Zx0UGRdmXBwVENNd1htMo10sdeTLk",
        authDomain: "cyberwatchdogs-b4b84.firebaseapp.com",
        projectId: "cyberwatchdogs-b4b84",
        storageBucket: "cyberwatchdogs-b4b84.appspot.com",
        messagingSenderId: "382424181677",      
        appId: "1:382424181677:web:55804108447bcd0a810f24"
    };
      
    firebase.initializeApp(firebaseConfig);

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                //console.log("Connexion réussie :", userCredential.user);
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