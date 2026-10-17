const preguntas = [
  {
    id: 'nombre',
    titulo: '¡Empecemos! 👋',
    subtitulo: '1. ¿Cuál es tu nombre completo?',
    tipo: 'texto',
    placeholder: 'Tu nombre completo...'
  },
  {
    id: 'cancion',
    titulo: 'Música 🎶',
    subtitulo: '2. ¿Cuál es tu canción favorita del momento?',
    tipo: 'texto',
    placeholder: 'Nombre de la canción o artista...'
  },
  {
    id: 'pelicula',
    titulo: 'Cine 🎬',
    subtitulo: '3. ¿Cuál es tu película favorita?',
    tipo: 'texto',
    placeholder: 'Tu peli preferida...'
  },
  {
    id: 'cumpleanos',
    titulo: 'Fecha especial 🎂',
    subtitulo: '4. ¿Cuándo es tu cumpleaños?',
    tipo: 'texto',
    placeholder: 'Ej. 15 de marzo...'
  },
  {
    id: 'color',
    titulo: 'Colores 🎨',
    subtitulo: '5. ¿Cuál es tu color favorito?',
    tipo: 'texto',
    placeholder: 'Tu color favorito...'
  },
  {
    id: 'suenos',
    titulo: 'A futuro ✨',
    subtitulo: '6. ¿Cuáles son tus más grandes sueños o metas?',
    tipo: 'texto',
    placeholder: 'Cuéntame un poco sobre tus sueños...'
  },
  {
    id: 'cecytem',
    titulo: 'Escuela 🏫',
    subtitulo: '7. ¿Por qué elegiste estudiar en el CECyTEM?',
    tipo: 'texto',
    placeholder: '¿Qué te motivó a entrar ahí?...'
  },
  {
    id: 'juegos',
    titulo: 'Gaming / Juegos 🎮',
    subtitulo: '8. ¿Te gusta algún juego (de mesa, celular, consola)?',
    tipo: 'texto',
    placeholder: 'Ej. UNO, Roblox, Mario Kart...'
  },
  {
    id: 'entretenimiento',
    titulo: 'Tiempo libre 🎧',
    subtitulo: '9. ¿Qué haces para entretenerte en tus ratos libres?',
    tipo: 'texto',
    placeholder: 'Tus pasatiempos o hobbies...'
  },
  {
    id: 'cita_ideal',
    titulo: 'Una última pregunta...',
    subtitulo: '10. ¿Te gustan los libros?, ¿Si es asi cual es tu libro favorito?',
    tipo: 'texto',
    placeholder: 'Tu libro favorito es...'
  }
];

let pasoActual = 0;
const usuarioRespuestas = {};

function renderizarPaso() {
  const container = document.getElementById('quiz-container');
  const progressBar = document.getElementById('progress-bar');

  // Actualización de la barra de progreso
  progressBar.style.width = `${((pasoActual + 1) / preguntas.length) * 100}%`;

  const q = preguntas[pasoActual];

  const htmlContent = `
    <div class="fade-in">
      <h2 class="text-2xl font-bold text-gray-800 mb-1">${q.titulo}</h2>
      <p class="text-gray-600 mb-5 font-medium">${q.subtitulo}</p>
      <input type="text" id="input-respuesta" placeholder="${q.placeholder}" 
             onkeydown="if(event.key === 'Enter') guardarTexto('${q.id}')"
             class="w-full p-3.5 border border-pink-300 rounded-2xl mb-6 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200">
      <button onclick="guardarTexto('${q.id}')" 
              class="btn-option w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold py-3.5 rounded-2xl shadow-md">
        ${pasoActual === preguntas.length - 1 ? 'Enviar todo ✨' : 'Siguiente ✨'}
      </button>
    </div>
  `;

  container.innerHTML = htmlContent;

  // Auto-enfoque en el cuadro de texto para mayor comodidad
  setTimeout(() => {
    const input = document.getElementById('input-respuesta');
    if (input) input.focus();
  }, 100);
}

function transicionSiguiente(callback) {
  const container = document.getElementById('quiz-container');
  const elementoActual = container.firstElementChild;
  if (elementoActual) {
    elementoActual.classList.remove('fade-in');
    elementoActual.classList.add('slide-out');
    setTimeout(callback, 230);
  } else {
    callback();
  }
}

function guardarTexto(id) {
  const input = document.getElementById('input-respuesta');
  const val = input ? input.value.trim() : '';
  if (!val) return;

  usuarioRespuestas[id] = val;
  transicionSiguiente(avanzar);
}

function avanzar() {
  pasoActual++;
  if (pasoActual < preguntas.length) {
    renderizarPaso();
  } else {
    enviarRespuestas();
  }
}

async function enviarRespuestas() {
  const container = document.getElementById('quiz-container');
  container.innerHTML = `
    <div class="text-center py-8 fade-in">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent mb-4"></div>
      <p class="text-gray-600 font-medium">Guardando tus respuestas... ✨</p>
    </div>
  `;

  const nombre = usuarioRespuestas['nombre'] || 'Anónimo';
  delete usuarioRespuestas['nombre'];

  try {
    const res = await fetch('/api/guardar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, respuestas: usuarioRespuestas })
    });

    if (res.ok) {
      container.innerHTML = `
        <div class="text-center py-6 pop-in">
          <span class="text-6xl inline-block mb-3 animate-bounce">🎉</span>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">¡Muchas gracias!</h2>
          <p class="text-gray-600">Guardé todas tus respuestas. Ya te conozco mas JAJA</p>
        </div>
      `;
    } else {
      throw new Error();
    }
  } catch (err) {
    container.innerHTML = `
      <div class="text-center text-red-500 font-medium py-4 fade-in">
        Ocurrió un error al enviar las respuestas. Revisa que el backend esté encendido.
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', renderizarPaso);