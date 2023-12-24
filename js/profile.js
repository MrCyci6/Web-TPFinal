// Execute the script when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Retrieve the user's token from localStorage
    let token = localStorage.getItem('token');

    // Send a request to the server to get user information based on the token
    fetch(`https://2.58.56.147:5001/getuser/${token}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {        
        // Check the response status for successful retrieval or unauthorized access
        if(response.status == 200) return response.json();
        if(response.status == 403 || response.status == 401) return window.location.href = "./login.html";
    })
    .then(data => {
        // Check if user data is available
        if(data) {
            // Get the element with the ID "is-connected"
            let div = document.getElementById("is-connected");
            
            // Update the inner HTML of the div with links and buttons for an authenticated user
            div.innerHTML = `
                <a href="./offres.html">Offres</a>
                <a href="./equipe.html">Equipe</a>
                <a href="./contact.html">Contact</a>
                <a class="btn-login" href="./profile.html"><i class="fa fa-user-circle"></i></a>
                <button id="logout" type="submit"><i class="fa fa-window-close-o"></i></button>
            `
        
            // Logout functionality
            let logoutButton = document.getElementById("logout");
        
            logoutButton.addEventListener("click", e => {
                // Send a logout request
                fetch(`https://2.58.56.147:5001/logout`, {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then(response => {
                    // Check the response status for successful logout
                    if(response.status == 200) {
                        console.log({succes: "Succesfully deconnected"});

                        // Remove the token from localStorage and redirect to login page
                        localStorage.removeItem('token');
                        window.location.href = "./login.html";
                    } else {
                        // Log an error if there's an issue with the logout
                        console.error("Erreur lors de la déconnexion : ", response.statusText);
                    }
                }).catch(e => {
                    // Log an error if there's an issue with the fetch operation
                    console.error("Erreur lors de la déconnexion : ", e);
                });
            });

            // Extract user details
            let username = data.username;
            let email = data.email;
            let role = data.role;

            let htmlUsername = document.getElementById("profile-username");
            let htmlEmail = document.getElementById("profile-email");

            htmlUsername.textContent = username;
            htmlEmail.textContent = email;

            // Modifications buttons
            let usernameB = document.getElementById("username-button");
            let passwordB = document.getElementById("password-button");

            let newUsername = document.getElementById("new-username");
            let newPassword = document.getElementById("new-password");

            let error = document.getElementById("error")

            // Password
            passwordB.addEventListener("click", e => {
                // Retrieve the new password from the input field
                newPassword = newPassword.value;
                
                if(newPassword && newPassword != "") {
                    // Send a request to the server to change the user's password
                    fetch(`https://2.58.56.147:5001/changeprofile`, {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({newPassword, email, token})
                    })
                    .then(response => {
                        // Check if the password change was successful
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

            // Username
            usernameB.addEventListener("click", e => {
                // Retrieve the new username from the input field
                newUsername = newUsername.value;
                
                if(newUsername && newUsername != "") {
                    // Send a request to the server to change the user's username
                    fetch(`https://2.58.56.147:5001/changeprofile`, {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({newUsername, email})
                    }).then(response => {
                        // Check if the username change was successful
                        if(response.status == 200) {                           
                            // Update the profile with the new username
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

// Function to update the user's profile with a new username
function updateProfil(newUsername, email, token) {
    fetch(`https://2.58.56.147:5001/updateuser/${token}`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({newUsername, email})
    })
    .then(response => {
        // Check if the profile update was successful
        if(response.status == 200) {
            return response.json();
        } else {
            console.log(`[WEB ERROR][CHANGE PROFILE] - ${response.statusText}`)
            return error.textContent = "Erreur interne. Contactez un administrateur."
        }
    })
    .then(data => {
        // Check if the updated data is available
        if(data) {
            console.log("Succesfully update");
            // Remove the old token and store the new token in localStorage
            localStorage.removeItem('token');
            localStorage.setItem('token', data.token);
            
            // Redirect to the profile page
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