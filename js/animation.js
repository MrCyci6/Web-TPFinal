document.addEventListener("DOMContentLoaded",  () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const bulles = [];

    function creerBulle() {
        const bulle = {
            x: Math.random() * canvas.width,
            y: canvas.height,
            rayon: 0.7,
            vitesseY: Math.random() * 1 + 0.5, 
            couleur: "rgba(15, 86, 219, 1)"
        };
        bulles.push(bulle);
    }


    function dessinerBulles() {
        for (let i = 0; i < bulles.length; i++) {
            const bulle = bulles[i];
            ctx.beginPath();
            ctx.arc(bulle.x, bulle.y, bulle.rayon, 0, Math.PI * 2);
            ctx.fillStyle = bulle.couleur;
            ctx.fill();

            bulle.y -= bulle.vitesseY;

            if (bulle.y < -bulle.rayon) {
                bulles.splice(i, 1);
                i--;
            }
        }
    }

    function animer() {
        creerBulle();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        dessinerBulles();
        requestAnimationFrame(animer);
    }

    animer();
})