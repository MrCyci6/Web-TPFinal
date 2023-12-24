// Wait for the DOM content to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", () => {
    // Retrieve the user token from localStorage
    let token = localStorage.getItem('token');

    // Send a request to get user information using the token
    fetch(`http://2.58.56.147:5001/getuser/${token}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        // Check the response status
        if(response.status == 200) return response.json();
        // If the status is 403 or 401, the user is not authenticated, so return null
        if(response.status == 403 || response.status == 401) return;
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
                fetch(`http://2.58.56.147:5001/logout`, {
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
        }
    })
    .catch(e => console.log(e));
});