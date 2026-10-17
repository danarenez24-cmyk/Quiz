// ⚠️ Coloca la URL de tu Webhook entre comillas:
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1561065860653650007/3xk1Z2VVAdEjvZWXsBquvDt5LjJBa8JVX7AHtvwqNvM0AsuvkCj_VObvCNp_v5qdIV1W";

const preguntas = [
  "1. ¿Cuál es tu color favorito?",
  "2. ¿Cuál es tu comida favorita?",
  "3. ¿Cual es tu cancion favorita?",
  "4. ¿Qué te gusta hacer en tu tiempo libre?",
  "5. ¿Cuándo es tu cumpleaños?",
  "6. ¿Te gustan los juegos?, ¿Que te gusta jugar?",
  "7. ¿Cual es tu deporte favorito?",
  "8. ¿Qué tipo de películas o series prefieres?",
  "9. ¿Qué es la cosa que mas te gusta en el mundo?",
  "10. ¿Alguna canción que te recuerde a algo especial?"
];

let indicePreguntaActual = 0;
let nombreUsuario = "";
let respuestasGuardadas = {};

function empezarQuiz() {
  const inputNombre = document.getElementById("nombre-usuario");
  if (!inputNombre || !inputNombre.value.trim()) {
    alert("Por favor escribe tu nombre antes de comenzar 😊");
    return;
  }
  nombreUsuario = inputNombre.value.trim();
  document.getElementById("pantalla-inicio").classList.add("hidden");
  document.getElementById("quiz-container").classList.remove("hidden");
  mostrarPregunta();
}

function mostrarPregunta() {
  const preguntaTexto = preguntas[indicePreguntaActual];
  document.getElementById("pregunta-titulo").innerText = preguntaTexto;

  const porcentaje = ((indicePreguntaActual + 1) / preguntas.length) * 100;
  document.getElementById("barra-progreso").style.width = `${porcentaje}%`;

  const inputRespuesta = document.getElementById("respuesta-texto");
  if (inputRespuesta) {
    inputRespuesta.value = "";
  }
}

function detectarEnter(event) {
  if (event.key === "Enter") {
    siguientePregunta();
  }
}

function siguientePregunta() {
  const inputRespuesta = document.getElementById("respuesta-texto");
  if (!inputRespuesta) return;

  const respuesta = inputRespuesta.value.trim();

  if (!respuesta) {
    alert("Por favor escribe tu respuesta antes de continuar ✨");
    return;
  }

  const preguntaActual = preguntas[indicePreguntaActual];
  respuestasGuardadas[preguntaActual] = respuesta;

  indicePreguntaActual++;

  if (indicePreguntaActual < preguntas.length) {
    mostrarPregunta();
  } else {
    enviarRespuestas();
  }
}

async function enviarRespuestas() {
  document.getElementById("quiz-container").classList.add("hidden");
  document.getElementById("pantalla-final").classList.remove("hidden");
  document.getElementById("mensaje-final-titulo").innerText = "Enviando respuestas...";

  let mensajeDiscord = `💖 **¡Nuevas respuestas de ${nombreUsuario}!** 💖\n\n`;
  for (const [preg, resp] of Object.entries(respuestasGuardadas)) {
    mensajeDiscord += `• **${preg}:** ${resp}\n`;
  }

  try {
    if (DISCORD_WEBHOOK_URL && DISCORD_WEBHOOK_URL.startsWith('http')) {
      await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: mensajeDiscord })
      });
    }

    document.getElementById("mensaje-final-titulo").innerText = "¡Muchas gracias!";
    document.getElementById("mensaje-final-texto").innerText = "Tus respuestas se han enviado con éxito. ✨";
  } catch (error) {
    console.error("Error al enviar:", error);
    document.getElementById("mensaje-final-titulo").innerText = "¡Muchas gracias!";
    document.getElementById("mensaje-final-texto").innerText = "Tus respuestas se han guardado. ✨";
  }
}