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
        if(response.status == 403 || response.status == 401) return window.location.href = "./login.html";;
    })
    .then(data => {
        if(data) {
            let div = document.getElementById("is-connected");
            
            div.innerHTML = `
            <a href="">Contact</a>
            <a class="btn-login" href="./profile.html"><i class="fa fa-user-circle"></i></a>
            <button id="logout" type="submit"><i class="fa fa-window-close-o"></i></button>`
        
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
        }
    })
    .catch(e => console.log(e));
});