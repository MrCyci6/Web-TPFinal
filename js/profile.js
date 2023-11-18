document.addEventListener("DOMContentLoaded", () => {
    let token = localStorage.getItem('token');

    fetch(`http://127.0.0.1:5000/getuser/${token}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if(response.status == 200) return response.json();
        if(response.status == 403 || response.status == 401) return window.location.href = "./login.html";
    })
    .then(data => {
        if(data) {
            // CONNEXION
            let username = data.username;
            let email = data.email;
            let role = data.role;

            let htmlUsername = document.getElementById("profile-username");
            let htmlEmail = document.getElementById("profile-email");

            htmlUsername.textContent = username;
            htmlEmail.textContent = email;

            // DECONNEXION
            let logoutButton = document.getElementById("logout");
        
            logoutButton.addEventListener("click", e => {
                
                fetch(`http://127.0.0.1:5000/logout`, {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then(response => {
                    if(response.status == 200) {
                        console.log({succes: "Succesfully deconnected"});

                        localStorage.removeItem('token');
                        window.location.href = "./login.html";
                    } else {
                        console.error("Erreur lors de la déconnexion : ", response.statusText);
                    }
                }).catch(e => {
                    console.error("Erreur lors de la déconnexion : ", e);
                });
            });

            // MODIFICATIONS
            let usernameB = document.getElementById("username-button");
            let passwordB = document.getElementById("password-button");

            let newUsername = document.getElementById("new-username");
            let newPassword = document.getElementById("new-password");

            let error = document.getElementById("error")

            // MOT DE PASSE
            passwordB.addEventListener("click", e => {

                newPassword = newPassword.value;
                
                if(newPassword && newPassword != "") {
                    fetch(`http://127.0.0.1:5000/changeprofile`, {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({newPassword, email, token})
                    })
                    .then(response => {
                        if(response.status == 200) {
                            console.log({succes: `Password changed`});
                            window.location.href = "./profile.html"
                        } else {
                            console.log(`[WEB ERROR][CHANGE PROFILE] - ${e}`);
                            return error.textContent = "Erreur interne. Contactez un administrateur."
                        }
                    }).catch(e => {
                        console.log(`[WEB ERROR][CHANGE PROFILE] - ${e}`);
                        return error.textContent = "Erreur interne. Contactez un administrateur."
                    });
                } else {
                    error.textContent = "Modification impossible (Recharger la page peut résoudre le problème)"
                }
            })

            // USERNAME
            usernameB.addEventListener("click", e => {

                newUsername = newUsername.value;
                
                if(newUsername && newUsername != "") {
                    fetch(`http://127.0.0.1:5000/changeprofile`, {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({newUsername, email})
                    }).then(response => {
                        if(response.status == 200) {

                            updateProfil(newUsername, email, token);

                            console.log({succes: `Username changed`});
                        } else {
                            console.log(`[WEB ERROR][CHANGE PROFILE] - ${e}`);
                            return error.textContent = "Erreur interne. Contactez un administrateur."
                        }
                    }).catch(e => {
                        console.log(`[WEB ERROR][CHANGE PROFILE] - ${e}`);
                        return error.textContent = "Erreur interne. Contactez un administrateur."
                    });
                } else {
                    return error.textContent = "Modification impossible (Recharger la page peut résoudre le problème)"
                }
            })

        } else {
            console.log(`[WEB ERROR][PROFILE] - Profile not found`)
            return window.location.href = "./login.html"
        }
    })
    .catch(e => {
        console.log(`[WEB ERROR][GET TOKEN] - ${e}`);
        return window.location.href = "./login.html"
    });
});

function updateProfil(newUsername, email, token) {
    
    fetch(`http://127.0.0.1:5000/updateuser/${token}`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({newUsername, email})
    })
    .then(response => {
        if(response.status == 200) {
            return response.json();
        } else {
            console.log(`[WEB ERROR][CHANGE PROFILE] - ${response.statusText}`)
            return error.textContent = "Erreur interne. Contactez un administrateur."
        }
    })
    .then(data => {
        if(data) {
            console.log("Succesfully update");
            localStorage.removeItem('token');
            localStorage.setItem('token', data.token);
            
            window.location.href = "./profile.html";
        } else {
            return error.textContent = "Erreur interne. Contactez un administrateur."
        }
    })
    .catch(e => {
        console.log(`[WEB ERROR][CHANGE PROFILE] - ${e}`);
        return error.textContent = "Erreur interne. Contactez un administrateur."
    });
}