// Wait for the DOM content to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded",  () => {
    // Retrieve the user token from local storage
    let token = localStorage.getItem('token');

    // Fetch user information using the token
    fetch(`http://2.58.56.147:5001/getuser/${token}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        // Check the response status
        if(response.status == 200) return response.json();
        // Redirect to the login page if unauthorized
        if(response.status == 403 || response.status == 401) return window.location.href = "./login.html";
    })
    .then(data => {
        // If user data is available
        if(data) {
            // Extract user details
            let username = data.username;
            let email = data.email;
            let role = data.role;

            // Call the listTicket function to display tickets
            listTicket(role);
                        
            // Attach event listeners to the "List" and "Create" buttons
            let listBtn = document.getElementById("list");
            listBtn.addEventListener("click", event => {
                listTicket(role);
            });

            let ticketBtn = document.getElementById("ticketBtn");
            ticketBtn.addEventListener("click", event => {
                createTicket();
            });

            // Function to create a new ticket
            function createTicket() {
                const subject = document.getElementById("subject").value;
                const description = document.getElementById("description").value;

                // Send a request to create a new ticket
                fetch('http://2.58.56.147:5001/createTicket', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({subject, description, email}),
                })
                .then(response => { 
                    document.getElementById("ticketForm").reset();
                    closePopup();
                    listTicket(role);
                })
                .catch(e => console.error(e));
            }

            // Function to list all tickets
            function listTicket(role) {
                const replace = document.getElementById("replace");
                const list = document.getElementsByClassName("footer")[0];
            
                // Fetch the list of tickets
                fetch(`http://2.58.56.147:5001/listTicket/${email}/${role}`, {
                    method: 'GET'
                })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    // Display ticket information on the page
                    if(data && data.length == 0) {
                        return replace.innerHTML = "Vous n'avez aucun ticket"
                    }

                    let htmlContent = "";
                    let i = 1;
                    data.forEach(ticket => {
            
                        let title = ticket.title;
                        let number = `${ticket.number}`;
                        let status = ticket.status == "open" ? "open" : "close";
                        let statusText = status == "open" ? "ouvert" : "fermé";
            
                        htmlContent += `
                            <button onclick="readTicket(${number}, '${email}', '${username}', '${role}')" class="ticket-card" type="submit">
                                <div class="left">
                                    <i class="fa-solid fa-address-book fa-2xl" style="color: #0D73E2;"></i>
                                    <h4>${title}</h4>
                                </div>
                    
                                <div class="right">
                                    <span id="${status}">${statusText}</span>
                                </div>
                            </button>
                        `
                        i++;
                    });
            
                    list.style.height = `${100 * (i > 5 ? 5 : i)}px`
                    replace.innerHTML = htmlContent;
                })
                .catch(e => console.error(e));
            }

        } else {
            // Redirect to the login page if user data is not available
            window.location.href = "./login.html";
        }
    })
    .catch(e => {
        console.log(e)
    })
})

// Open the ticket creation popup
function openPopup() {
    document.getElementById("popup").style.display = "block";
}

// Close the ticket creation popup
function closePopup() {
    document.getElementById("popup").style.display = "none";
}

// Close a ticket
function closeTicket(ticket) {    
    const number = ticket.toString().padStart(3, '0');

    // Send a request to close the specified ticket
    fetch('http://2.58.56.147:5001/closeTicket', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({number}),
    })
    .then(response => {
        console.log(response);
        window.location.href = "./contact.html";
    })
    .catch(e => console.error(e));
}

// Read a ticket and display its details
function readTicket(number, email, username, role) {
    const replace = document.getElementById("replace");
    const list = document.getElementsByClassName("footer")[0];

    // Fetch the details of the specified ticket
    fetch(`http://2.58.56.147:5001/readTicket/${number.toString().padStart(3, '0')}/${email}/${role}`, {
        method: 'GET'
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        htmlContent = `
            <header>
                <h3>${data.title}</h3>
                <h5>${data.description}</h5>
                <hr>
            </header>
        `;

        // Display ticket messages
        data.messages.forEach(message => {
            htmlContent += `
                <div class="message">
                    <h4>${message.utilisateur}</h4>
                    <h6>${message.message}</h6>
                </div>
            `
        });

        // If the ticket is open, display a text input for new messages
        if(data.status == "open") {
            
            htmlContent += `
                <div class="text-input">
                    <form id="message-form">
                        <textarea name="text-input" id="text" placeholder="Aidez moi s'il vous plait..." required></textarea>
                        <button onclick="writeTicket(${data.number}, '${email}', '${username}', '${role}'); return false;" id="send-message"><i class="fa-solid fa-paper-plane fa-2xl" style="color: #0D73E2;"></i></button>
                        <button onclick="closeTicket(${data.number}); return false;" id="send-message"><i class="fa-solid fa-x fa-2xl" style="color: #0D73E2;"></i></button>
                    </form>
                </div>
            `
        }

        replace.reset;
        list.style.height = `500px`
        replace.innerHTML = htmlContent;
    })
    .catch(e => console.error(e));
}

// Write a message in a ticket
function writeTicket(number, email, username, role) {
    const message = document.getElementById("text").value;
    number = number.toString().padStart(3, '0');

    // Send a request to add a new message to the specified ticket
    fetch('http://2.58.56.147:5001/writeTicket', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({message, username, number}),
    })
    .then(response => {
        console.log(response);
        readTicket(number, email, username, role);
    })
    .catch(e => console.error(e));
}