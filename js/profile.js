const firebaseConfig = {
    apiKey: "AIzaSyClU4Zx0UGRdmXBwVENNd1htMo10sdeTLk",
    authDomain: "cyberwatchdogs-b4b84.firebaseapp.com",
    projectId: "cyberwatchdogs-b4b84",
    storageBucket: "cyberwatchdogs-b4b84.appspot.com",
    messagingSenderId: "382424181677",      
    appId: "1:382424181677:web:55804108447bcd0a810f24"
};
  
firebase.initializeApp(firebaseConfig);
const database = firebase.firestore()

firebase.auth().onAuthStateChanged(async user => {
    if (user) {

        // SESSION
        let userName = null;
        let userEmail = user.email;
        let isAdmin = false;

        const userRef = database.collection("users").doc(userEmail);
        const doc = await userRef.get();

        if (doc.exists) {
            const userData = doc.data();
            
            userName = userData.identifiant;
            isAdmin = userData.admin;

            let htmlUsername = document.getElementById("profile-username");
            let htmlEmail = document.getElementById("profile-email");

            htmlUsername.textContent = userName;
            htmlEmail.textContent = userEmail;
        } else {
            console.log("Aucun document trouvé pour cet utilisateur.");
        }

        // LOGOUT

        let logoutButton = document.getElementById("logout");
        
        logoutButton.addEventListener("click", e => {
            
            firebase.auth().signOut()
            .then(() => {

                console.log("Déconnexion réussie.");
                window.location.href = "./login.html"
            }).catch(e => {
                console.error("Erreur lors de la déconnexion : ", e);
            });
        });
        
        // MODIFICATIONS

        let emailB = document.getElementById("email-button");
        let usernameB = document.getElementById("username-button");
        let passwordB = document.getElementById("password-button");

        let newEmail = document.getElementById("new-email");
        let newUsername = document.getElementById("new-username");
        let newPassword = document.getElementById("new-password");

        let success = document.getElementById("success");
        let error = document.getElementById("error")

        // EMAIL
        emailB.addEventListener("click", e => {
            
            newEmail = newEmail.value;

            if(user.emailVerified) {
                if(newEmail && newEmail != userEmail && newEmail != "") {

                    user.updateEmail(newEmail)
                    .then(() => {

                        userRef.update({
                            admin: isAdmin,
                            email: newEmail,
                            identifiant: userName
                        }).then(() => {

                            user.sendEmailVerification()
                            .catch(e => {
                                console.error("Erreur :", e);
                            });

                            window.location.href = "./profile.html"
                        }).catch(e => {
                            console.error("Erreur :", e);
                            error.textContent = "Erreur.";
                        });
                        
                    }).catch(e => {
                        console.error("Erreur :", e);
                        error.textContent = "Erreur.";
                    });
                } else {
                    error.textContent = "Modification impossible (Recharger la page peut résoudre le problème)"
                }
            } else {
                error.textContent = "Adresse E-mail non vérifiée."
            }
        })

        // IDENTIFIANT
        usernameB.addEventListener("click", e => {

            newUsername = newUsername.value;
            
            if(newUsername && newUsername != "") {
                userRef.update({
                    admin: isAdmin,
                    email: userEmail,
                    identifiant: newUsername
                }).then(() => {
                    
                    window.location.href = "./profile.html"
                }).catch(e => {
                    console.error("Erreur :", e);
                    error.textContent = "Erreur.";
                });
            } else {
                error.textContent = "Modification impossible (Recharger la page peut résoudre le problème)"
            }
        })

        // MOT DE PASSE
        passwordB.addEventListener("click", e => {

            newPassword = newPassword.value;
            
            if(newPassword && newPassword != "") {
                user.updatePassword(newPassword)
                    .then(() => {
                        
                        window.location.href = "./profile.html"
                    }).catch(e => {
                        if(e.code == "auth/requires-recent-login") {
                            error.textContent = "Erreur, reconnectez vous puis réessayer."
                        } else {
                            console.error("Erreur :", e);
                            error.textContent = "Erreur.";
                        }
                    });
            } else {
                error.textContent = "Modification impossible (Recharger la page peut résoudre le problème)"
            }
        })

    } else {
        window.location.href = "./login.html"
    }
});