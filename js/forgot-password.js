// Wait for the DOM content to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded",  () => {

    // Get references to form, success message, and error message elements
    let form = document.getElementById("reset");
    let success = document.getElementById("success");
    let error = document.getElementById("error")

    // Attach event listener to the form submission
    form.addEventListener("submit", e => {
        // Prevent the default form submission behavior
        e.preventDefault();

        // Retrieve the email value from the form
        let email = document.getElementById("email").value;

        // Check if email is not empty
        if(email && email != "") {
            // Send a request to the forgotpassword endpoint
            fetch('http://2.58.56.147:5001/forgotpassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password}),
            })
            .then(response => {
                // Check the response status
                if(response.status == 200 || response.status == 403 || response.status == 401) return response.json();
            })
            .then(data => {
                // Handle the response data
                if(data.error) {
                    return error.textContent = data.error;
                } else {
                    return success.textContent = "E-mail de réinitialisation de mot de passe envoyé !"
                }
            })
            .catch(e => {
                // Handle errors in the fetch operation
                console.log(`[WEB ERROR][LOGIN] - ${e}`);
                return error.textContent = "Erreur interne. Contactez un administrateur."
            });
        }
    });

});