const btnIniciar = document.getElementById('btn-iniciar');
const introScreen = document.getElementById('intro-screen');
const mainContent = document.getElementById('main-content');
const bgMusic = document.getElementById('bg-music');

const btnRegalo = document.getElementById('btn-regalo');
const btnRuleta = document.getElementById('btn-ruleta');
const ruletaContainer = document.getElementById('ruleta-container');
const regaloContainer = document.getElementById('regalo-container');
const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-btn');
const resultadoTexto = document.getElementById('resultado');
const btnReclamar = document.getElementById('btn-reclamar');
const intentosSpan = document.getElementById('intentos');

// Lógica de música de fondo
const musicTracks = [
    'gmWfEwJvOAw', // Inicio original
    '_UATI8gQ1_8', // Alternativo anterior
    'IGMabBGydC0',
    'XvDw0LXZCNI',
    'GX89AGfXMnY',
    '4tf_NXK-X_Y',
    '6cF6b6pLijE',
    'g3nvyY81GqU',
    'mvqmzuVV-zY'
];
let currentTrackIndex = 0;

// Al hacer clic en Iniciar
btnIniciar.addEventListener('click', () => {
    // Ocultar pantalla inicial y mostrar contenido
    introScreen.classList.add('hidden');
    mainContent.classList.remove('hidden');
    
    // Iniciar música SIEMPRE con la primera
    const trackId = musicTracks[currentTrackIndex];
    bgMusic.src = `https://www.youtube.com/embed/${trackId}?autoplay=1&loop=1&playlist=${trackId}`;
});

const btnCambiarMusica = document.getElementById('btn-cambiar-musica');
if (btnCambiarMusica) {
    btnCambiarMusica.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex + 1) % musicTracks.length;
        const trackId = musicTracks[currentTrackIndex];
        bgMusic.src = `https://www.youtube.com/embed/${trackId}?autoplay=1&loop=1&playlist=${trackId}`;
    });
}

let intentos = 5;
let girando = false;
let currentRotation = 0;
let winsLeft = 2;
let losesLeft = 3;

// 8 opciones, alternando premios y vuelve a intentarlo
const opciones = [
    "Un Almuerzo Especial", 
    "Vuelve a intentarlo",
    "Noche de Cócteles",
    "Vuelve a intentarlo",
    "Ruta de Postres",
    "Un abrazo a la distancia",
    "Picnic al Aire Libre",
    "Vuelve a intentarlo",
    "Pase libre / Vale por un deseo"
];

// Generar colores dinámicos y variados para la ruleta
let gradientStr = "";
const step = 360 / opciones.length;
// 9 colores diferentes para que cada premio destaque
const colores = ['#e74c3c', '#3498db', '#f1c40f', '#9b59b6', '#e67e22', '#2ecc71', '#ff7979', '#00cec9', '#6c5ce7'];
for (let i = 0; i < opciones.length; i++) {
    const color = colores[i % colores.length];
    gradientStr += `${color} ${i * step}deg ${(i + 1) * step}deg`;
    if (i < opciones.length - 1) gradientStr += ", ";
    
    // Añadir el texto en la ruleta
    const textDiv = document.createElement('div');
    textDiv.className = 'wheel-text';
    textDiv.textContent = opciones[i];
    // Alinear las letras como rayos (spokes) dentro de su triángulo
    const angle = (i * step) + (step / 2);
    textDiv.style.transform = `rotate(${angle - 90}deg) translateX(15px)`;
    wheel.appendChild(textDiv);
}
wheel.style.background = `conic-gradient(${gradientStr})`;

btnRegalo.addEventListener('click', () => {
    ruletaContainer.classList.add('hidden');
    regaloContainer.classList.remove('hidden');
});

btnRuleta.addEventListener('click', () => {
    regaloContainer.classList.add('hidden');
    ruletaContainer.classList.remove('hidden');
});

spinBtn.addEventListener('click', () => {
    if (intentos > 0 && !girando) {
        girando = true;
        intentos--;
        intentosSpan.textContent = intentos;
        resultadoTexto.textContent = "Girando...";
        btnReclamar.classList.add('hidden');

        let isWin = false;
        if (winsLeft > 0 && losesLeft > 0) {
            isWin = Math.random() < (winsLeft / (winsLeft + losesLeft));
        } else if (winsLeft > 0) {
            isWin = true;
        } else {
            isWin = false;
        }

        const winIndices = [0, 2, 4, 5, 6, 8];
        const loseIndices = [1, 3, 7];
        let randomIndex;

        if (isWin) {
            winsLeft--;
            randomIndex = winIndices[Math.floor(Math.random() * winIndices.length)];
        } else {
            losesLeft--;
            randomIndex = loseIndices[Math.floor(Math.random() * loseIndices.length)];
        }
        const sectionAngle = 360 / opciones.length;
        const centerOffset = sectionAngle / 2;
        const targetAngle = 360 - (randomIndex * sectionAngle + centerOffset);
        const spins = 360 * 5;
        
        currentRotation += spins + targetAngle - (currentRotation % 360);
        wheel.style.transform = `rotate(${currentRotation}deg)`;

        setTimeout(() => {
            girando = false;
            const premio = opciones[randomIndex];
            
            if (premio === "Vuelve a intentarlo") {
                resultadoTexto.textContent = "¡Uy! " + premio;
                if (intentos === 0) {
                    resultadoTexto.textContent += ". ¡Se acabaron los intentos!";
                    spinBtn.disabled = true;
                }
            } else {
                resultadoTexto.textContent = "¡Ganaste: " + premio + "!";
                btnReclamar.classList.remove('hidden');
                btnReclamar.setAttribute('data-premio', premio); // Guardar el premio actual
            }
        }, 4000); 
    }
});

btnReclamar.addEventListener('click', () => {
    const premioGano = btnReclamar.getAttribute('data-premio');
    let mensaje = "";
    
    if (winsLeft === 1) {
        // Primer premio ganado (winsLeft bajó de 2 a 1)
        mensaje = `¡Hola! Acabo de jugar en mi página de cumpleaños y gané: *${premioGano}*. ¡Aquí te envío la captura de pantalla!`;
    } else {
        // Segundo premio ganado (winsLeft bajó de 1 a 0)
        mensaje = `¡Hola de nuevo! ¡Gané mi segundo regalo en la ruleta! Es: *${premioGano}*. ¡Aquí te envío la captura de pantalla!`;
    }
    
    const whatsappUrl = `https://api.whatsapp.com/send?phone=51925449328&text=${encodeURIComponent(mensaje)}`;
    
    alert("¡Felicidades Veredis! Te vamos a redirigir a WhatsApp. No olvides tomar la captura de pantalla antes o adjuntarla en el chat para reclamar tu premio.");
    window.open(whatsappUrl, '_blank');
});

// --- Lógica del Fondo de Estrellas 3D ---
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
const numStars = 500;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Star {
    constructor() { 
        this.colors = [
            [255, 255, 255], // Blanco
            [255, 215, 0],   // Dorado
            [46, 204, 113],  // Verde (combina con tu tema)
            [231, 76, 60],   // Rojo
            [52, 152, 219],  // Azul claro
            [155, 89, 182],  // Morado
            [255, 105, 180]  // Rosa
        ];
        this.reset(); 
    }
    reset() {
        this.x = (Math.random() - 0.5) * canvas.width;
        this.y = (Math.random() - 0.5) * canvas.height;
        this.z = Math.random() * canvas.width;
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.r = color[0];
        this.g = color[1];
        this.b = color[2];
    }
    update() {
        this.z -= 4; // Velocidad de las estrellas hacia adelante
        if (this.z <= 0) { this.reset(); this.z = canvas.width; }
    }
    draw() {
        let x = (this.x / this.z) * canvas.width + canvas.width / 2;
        let y = (this.y / this.z) * canvas.height + canvas.height / 2;
        let radius = 2 * (canvas.width / this.z); // Tamaño
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${1 - this.z / canvas.width})`;
        ctx.fill();
    }
}

for (let i = 0; i < numStars; i++) { stars.push(new Star()); }

function animateStars() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => { star.update(); star.draw(); });
    requestAnimationFrame(animateStars);
}
animateStars();

// --- Lógica de Animación de Texto (Anagramas y Frases) ---
const animH1 = document.getElementById('animated-text');
const phrasesPool = [
    "FELIZ CUMPLEAÑOS VEREDIS SOFIA",
    "¿QUE HACES LEYENDO ESTE MENSAJE (º_º) SI PUEDES LLAMARME?",
    "LLEVO TIEMPO DICIENDOME 'SOLO ES UNA AMIGA', PERO HOY QUE CUMPLES AÑOS SE ME OLVIDO LA EXCUSA. FELIZ CUMPLE",
    "TE QUIERO INVITAR A CENAR. ¿ALGUNA OBJECION? 🍰",
    "TE HE PERDONADO POR EXISTIR Y POR SER TAN GUAPA. DE NADA. 🎂",
    "SI HOY TE TOCA PEDIR UN DESEO, PIDE QUE YO ESTE EN EL. PARA MOLESTARTE",
    "HOY ES TU CUMPLEAÑOS, NO EL MIO. PERO SI DE ALGO ME ALEGRO ES DE QUE NACISTE, PORQUE SI NO, NO ME HABRIAS CONOCIDO. DE NADA, UNIVERSO.",
    "NO SE QUE PONERTE, ASI QUE: TU PASTEL HOY LO PONGO YO. ¿TRATO?"
];

let currentPhraseIdx = 0;
let spans = [];
const textColors = ['#ffffff', '#ffd700', '#2ecc71', '#e74c3c', '#3498db', '#9b59b6', '#ff69b4'];

function initTextAnimation() {
    animH1.innerHTML = '';
    const maxLen = Math.max(...phrasesPool.map(p => p.length));
    
    // Crear spans iniciales
    for (let i = 0; i < maxLen; i++) {
        const sp = document.createElement('span');
        sp.className = 'letter-span';
        let char = phrasesPool[0][i] || ' ';
        sp.textContent = char;
        if(char === ' ') {
            sp.style.width = '15px'; // Ancho del espacio
            sp.style.opacity = 0;
        } else {
            sp.style.color = textColors[Math.floor(Math.random() * textColors.length)];
        }
        animH1.appendChild(sp);
        spans.push(sp);
    }
    
    // Cambiar frase cada 10 segundos
    setInterval(changePhrase, 10000);
}

function changePhrase() {
    currentPhraseIdx = (currentPhraseIdx + 1) % phrasesPool.length;
    let target = phrasesPool[currentPhraseIdx].split('');
    
    // Fase 1: Esparcir las letras aleatoriamente (como si se reorganizaran)
    spans.forEach((sp, i) => {
        sp.style.transform = `translate(${(Math.random()-0.5)*400}px, ${(Math.random()-0.5)*400}px) rotate(${(Math.random()-0.5)*360}deg) scale(0)`;
        sp.style.opacity = 0;
    });
    
    // Fase 2: Formar la nueva frase
    setTimeout(() => {
        spans.forEach((sp, i) => {
            let char = target[i] || ' ';
            sp.textContent = char;
            sp.style.transform = 'translate(0, 0) rotate(0deg) scale(1)';
            if (char !== ' ') {
                sp.style.opacity = 1;
                sp.style.width = 'auto';
                sp.style.color = textColors[Math.floor(Math.random() * textColors.length)];
            } else {
                sp.style.opacity = 0;
                sp.style.width = '15px';
            }
        });
    }, 1500); 
}

// Iniciar cuando se hace clic en Iniciar para asegurar el rendimiento
btnIniciar.addEventListener('click', () => {
    initTextAnimation();
});
