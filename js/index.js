firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(async user => {
    if (user) {
        let div = document.getElementById("is-connected");

        div.innerHTML = `
        <a href="">Contact</a>
        <a class="btn-login" href="./profile.html"><i class="fa fa-user-circle"></i></a>
        <button id="logout" type="submit"><i class="fa fa-window-close-o"></i></button>`
    
        // LOGOUT
        let logoutButton = document.getElementById("logout");
        
        logoutButton.addEventListener("click", e => {
            
            firebase.auth().signOut()
            .then(() => {
    
                console.log("Déconnexion réussie.");
                window.location.href = "./login.html"
            }).catch(e => {
                console.error("Erreur lors de la déconnexion : ", e);
            });
        });
    }
});