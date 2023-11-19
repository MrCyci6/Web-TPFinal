document.addEventListener("DOMContentLoaded",  () => {
    listTicket();
})

function openPopup() {
    document.getElementById("popup").style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

// Création de ticket
function createTicket() {
    
    // Récupération des variables nécessaires
    const subject = document.getElementById("subject").value;
    const description = document.getElementById("description").value;
    const email = "cyriac.lenoir@isen-ouest.yncrea.fr";

    // Envoie d'une requête à l'api pour créer un ticket
    fetch('http://127.0.0.1:5000/createTicket', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({subject, description, email}),
    })
    .then(response => { 
        document.getElementById("ticketForm").reset();
        closePopup();
        listTicket();
    })
    .catch(e => console.error(e));
}

function listTicket() {
    const email = "cyriac.lenoir@isen-ouest.yncrea.fr";
    const replace = document.getElementById("replace");
    const list = document.getElementsByClassName("list")[0];

    fetch(`http://127.0.0.1:5000/listTicket/${email}`, {
        method: 'GET'
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        if(!data) {
            return replace.innerHTML = "Vous n'avez aucun ticket"
        }
        console.log(data)
        let htmlContent = "";
        let i = 1;
        data.forEach(ticket => {

            let title = ticket.title;
            let number = `${ticket.number}`;
            let status = ticket.status == "open" ? "open" : "close";
            let statusText = status == "open" ? "ouvert" : "fermé";

            htmlContent += `
                <button onclick="readTicket(${number})" class="ticket-card" type="submit">
                    <div class="left">
                        <i class="fa-solid fa-address-book fa-2xl" style="color: #cac8c8;"></i>
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

function readTicket(number) {
    
    const email = "cyriac.lenoir@isen-ouest.yncrea.fr";
    const replace = document.getElementById("replace");
    const list = document.getElementsByClassName("list")[0];

    fetch(`http://127.0.0.1:5000/readTicket/${number.toString().padStart(3, '0')}/${email}`, {
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
                        <button onclick="writeTicket(${data.number}); return false;" id="send-message"><i class="fa-solid fa-paper-plane fa-2xl" style="color: #0D73E2;"></i></button>
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

function writeTicket(ticket) {
    
    const message = document.getElementById("text").value;
    const user = "cyriac.lenoir@isen-ouest.yncrea.fr";
    const number = ticket.toString().padStart(3, '0');

    fetch('http://127.0.0.1:5000/writeTicket', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({message, user, number}),
    })
    .then(response => {
        console.log(response);
    })
    .catch(e => console.error(e));
}