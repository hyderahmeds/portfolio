const text = [
    "AI Engineer in the Making",
    "Computer Science Student",
    "Developer",
    "Problem Solver"
];

let index = 0;
let charIndex = 0;

const typingElement = document.getElementById("typing");

function type() {

    if (charIndex < text[index].length) {

        typingElement.textContent += text[index].charAt(charIndex);

        charIndex++;

        setTimeout(type, 80);

    } else {

        setTimeout(erase, 1500);

    }
}

function erase() {

    if (charIndex > 0) {

        typingElement.textContent =
            text[index].substring(0, charIndex - 1);

        charIndex--;

        setTimeout(erase, 40);

    } else {

        index++;

        if (index >= text.length) {
            index = 0;
        }

        setTimeout(type, 500);
    }
}

type();

// Cursor animation for the static portfolio. This does not depend on React.
const cursorCanvas = document.createElement("canvas");
const cursorContext = cursorCanvas.getContext("2d");
const particles = [];
let canvasWidth = 0;
let canvasHeight = 0;

Object.assign(cursorCanvas.style, {
    position: "fixed",
    inset: "0",
    width: "100vw",
    height: "100vh",
    pointerEvents: "none",
    zIndex: "90"
});

document.body.appendChild(cursorCanvas);

function resizeCursorCanvas() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    cursorCanvas.width = Math.floor(canvasWidth * pixelRatio);
    cursorCanvas.height = Math.floor(canvasHeight * pixelRatio);
    cursorContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function addCursorParticles(x, y) {
    for (let i = 0; i < 4; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.4 + Math.random() * 1.8;
        particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 10 + Math.random() * 22,
            life: 1,
            hue: 145 + Math.random() * 45
        });
    }
}

function animateCursor() {
    cursorContext.clearRect(0, 0, canvasWidth, canvasHeight);
    cursorContext.globalCompositeOperation = "lighter";

    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.96;
        particle.vy *= 0.96;
        particle.size *= 0.975;
        particle.life -= 0.025;

        if (particle.life <= 0) {
            particles.splice(i, 1);
            continue;
        }

        const glow = cursorContext.createRadialGradient(
            particle.x,
            particle.y,
            0,
            particle.x,
            particle.y,
            particle.size
        );
        glow.addColorStop(0, `hsla(${particle.hue}, 100%, 65%, ${particle.life * 0.75})`);
        glow.addColorStop(1, `hsla(${particle.hue}, 100%, 50%, 0)`);
        cursorContext.fillStyle = glow;
        cursorContext.beginPath();
        cursorContext.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        cursorContext.fill();
    }

    cursorContext.globalCompositeOperation = "source-over";
    requestAnimationFrame(animateCursor);
}

window.addEventListener("pointermove", (event) => {
    addCursorParticles(event.clientX, event.clientY);
});

window.addEventListener("resize", resizeCursorCanvas);
resizeCursorCanvas();
animateCursor();
