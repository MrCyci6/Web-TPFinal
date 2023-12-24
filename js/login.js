// Execute the script when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded",  () => {
    // Get the login form and error element from the DOM
    const form = document.getElementById("loginForm");
    const error = document.getElementById("error");
        
    // Get elements related to the registration and login toggle functionality
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');
    
    // Add event listeners to the registration and login buttons for toggle functionality
    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
    });
    
    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });

    // Add event listener to the login form for form submission
    form.addEventListener("submit", e => {
        e.preventDefault();

        // Get the email and password values from the form
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Send a request to the server for user authentication
        fetch('http://2.58.56.147:5001/connect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password}),
        })
        .then(response => {
            // Check the response status for successful login or error
            if(response.status == 200 || response.status == 403 || response.status == 401) return response.json();
        })
        .then(data => {
            // Check if the response data is available
            if(!data) return error.textContent = "Erreur interne. Contactez un administrateur.";
            // If there is an error, display it in the error element
            if(data.error) {
                return error.textContent = data.error;
            } else {                    
                // If login is successful, store the token in localStorage and redirect to the profile page
                localStorage.setItem('token', data.token);
                window.location.href = "./profile.html"
            }
        })
        .catch(e => {
            // Log an error if there's an issue with the fetch operation
            console.log(`[WEB ERROR][LOGIN] - ${e}`);
            return error.textContent = "Erreur interne. Contactez un administrateur."
        });
    });
});