// Execute the script when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get the registration form and error element
    const form = document.getElementById("registerForm");
    const error = document.getElementById("RegError");
    
    // Add an event listener for the form submission
    form.addEventListener('submit', event => {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Retrieve user input values from the form
        const email = document.getElementById("regEmail").value;
        const password = document.getElementById("regPassword").value;
        const username = document.getElementById("username").value;

        // Send a request to the server to register a new user
        fetch('http://2.58.56.147:5001/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password, username}),
        })
        .then(response => {
            // Check the response status for successful registration or error
            if(response.status == 200 || response.status == 403 || response.status == 401) return response.json();
        })
        .then(data => {
            // Check if data is available
            if(!data) return error.textContent = "Erreur interne. Contactez un administrateur."
            if(data.error) {
                // Log the registration error and display it to the user
                console.log(`[WEB ERROR][REGISTER] - ${data.error}`);
                return error.textContent = data.error;
            } else {
                // Store the token in localStorage and redirect to the profile page
                localStorage.setItem('token', data.token);
                window.location.href = "./profile.html"
            }
        })
        .catch(e => {
            // Log and display internal error if any
            console.log(`[WEB ERROR][REGISTER] - ${e}`);
            return error.textContent = "Erreur interne. Contactez un administrateur."
        });
    });
});