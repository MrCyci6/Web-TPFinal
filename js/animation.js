// Event listener to ensure the DOM is fully loaded before executing the script
document.addEventListener("DOMContentLoaded",  () => {
    // Get the canvas element and its 2D rendering context
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions to match the window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Array to store bubble objects
    const bulles = [];

    
    // Function to create a new bubble object and add it to the array
    function creerBulle() {
        const bulle = {
            x: Math.random() * canvas.width,
            y: canvas.height,
            rayon: 0.2,
            vitesseY: Math.random() * 0.8, 
            couleur: "rgba(15, 86, 219, 1)"
        };
        bulles.push(bulle);
    }

    // Function to draw all bubbles on the canvas
    function dessinerBulles() {
        for (let i = 0; i < bulles.length; i++) {
            const bulle = bulles[i];

            // Draw a filled circle for each bubble
            ctx.beginPath();
            ctx.arc(bulle.x, bulle.y, bulle.rayon, 0, Math.PI * 2);
            ctx.fillStyle = bulle.couleur;
            ctx.fill();

            // Move the bubble upwards
            bulle.y -= bulle.vitesseY;

            // Remove the bubble from the array if it goes above the canvas
            if (bulle.y < -bulle.rayon) {
                bulles.splice(i, 1);
                i--;
            }
        }
    }

    // Function to animate the bubbles by creating, drawing, and clearing the canvas
    function animer() {
        creerBulle();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        dessinerBulles();
        requestAnimationFrame(animer);
    }

    // Start the animation loop
    animer();
})
