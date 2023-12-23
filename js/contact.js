document.addEventListener("DOMContentLoaded",  () => {
    let token = localStorage.getItem('token');

    fetch(`http://2.58.56.147:5001/getuser/${token}`, {
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

            listTicket(role);
            
            let listBtn = document.getElementById("list");
            listBtn.addEventListener("click", event => {
                listTicket(role);
            });

            let ticketBtn = document.getElementById("ticketBtn");
            ticketBtn.addEventListener("click", event => {
                // event.preventDefault();
                createTicket();
            });

            // Création de ticket
            function createTicket() {
                
                // Récupération des variables nécessaires
                const subject = document.getElementById("subject").value;
                const description = document.getElementById("description").value;

                // Envoie d'une requête à l'api pour créer un ticket
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

            // Liste de tous les tickets
            function listTicket(role) {
                const replace = document.getElementById("replace");
                const list = document.getElementsByClassName("footer")[0];
            
                fetch(`http://2.58.56.147:5001/listTicket/${email}/${role}`, {
                    method: 'GET'
                })
                .then(response => {
                    return response.json();
                })
                .then(data => {
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
            window.location.href = "./login.html";
        }
    })
    .catch(e => {
        console.log(e)
    })
})

function openPopup() {
    document.getElementById("popup").style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

function closeTicket(ticket) {    
    const number = ticket.toString().padStart(3, '0');

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

// Lecture de Ticket
function readTicket(number, email, username, role) {

    const replace = document.getElementById("replace");
    const list = document.getElementsByClassName("footer")[0];

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

        data.messages.forEach(message => {
            htmlContent += `
                <div class="message">
                    <h4>${message.utilisateur}</h4>
                    <h6>${message.message}</h6>
                </div>
            `
        });

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

// Ecriture dans un ticket
function writeTicket(number, email, username, role) {
    
    const message = document.getElementById("text").value;
    number = number.toString().padStart(3, '0');

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