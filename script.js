// ⚠️ REEMPLAZA ESTA DIRECCIÓN POR LA URL DE TU WEBHOOK DE DISCORD:
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1561065860653650007/3xk1Z2VVAdEjvZWXsBquvDt5LjJBa8JVX7AHtvwqNvM0AsuvkCj_VObvCNp_v5qdIV1W';

const preguntas = [
  { pregunta: "1. ¿Cuál es tu color favorito?", opciones: ["Rosa / Pastel", "Azul / Verde", "Negro / Oscuros", "Morado / Lila"] },
  { pregunta: "2. ¿Cuál es tu snack o comida favorita?", opciones: ["Tacos / Antojitos", "Pizza / Pasta", "Postres / Dulces", "Sushi / Comida asiática"] },
  { pregunta: "3. ¿Qué música o artista escuchas más?", opciones: ["Pop / Reggaeton", "Rock / Indie", "K-Pop", "De todo un poco"] },
  { pregunta: "4. ¿Qué te gusta hacer en tu tiempo libre?", opciones: ["Ver series / películas", "Escuchar música / dibujar", "Salir con amigos", "Dormir / descansar"] },
  { pregunta: "5. ¿Cuál es tu bebida preferida?", opciones: ["Café / Frappé", "Boba Tea / Té", "Refresco", "Agua preparada / Jugo"] },
  { pregunta: "6. ¿Cuál sería tu plan ideal para salir?", opciones: ["Ir por un café y platicar", "Ir al cine o un parque", "Plaza comercial / Compras", "Quedarse en casa viendo películas"] },
  { pregunta: "7. ¿Qué te motiva más en el CECyTEM?", opciones: ["Ver a mis amigos", "Aprender mi especialidad", "Los recesos / tiempo libre", "Saber que ya mero termino"] },
  { pregunta: "8. ¿Qué tipo de películas o series prefieres?", opciones: ["Romance / Drama", "Terror / Misterio", "Comedia", "Animadas / Anime"] },
  { pregunta: "9. ¿Te consideras una persona de día o de noche?", opciones: ["De día ☀️", "De noche 🌙"] },
  { pregunta: "10. Para botanear, ¿prefieres dulce o salado?", opciones: ["Dulce 🍫", "Salado / Picante 🌶️"] }
];

let indicePreguntaActual = 0;
let nombreUsuario = "";
let respuestasGuardadas = {};

function empezarQuiz() {
  const inputNombre = document.getElementById("nombre-usuario").value.trim();
  if (!inputNombre) {
    alert("Por favor escribe tu nombre antes de comenzar 😊");
    return;
  }
  nombreUsuario = inputNombre;
  document.getElementById("pantalla-inicio").classList.add("hidden");
  document.getElementById("quiz-container").classList.remove("hidden");
  mostrarPregunta();
}

function mostrarPregunta() {
  const q = preguntas[indicePreguntaActual];
  document.getElementById("pregunta-titulo").innerText = q.pregunta;

  const porcentaje = ((indicePreguntaActual + 1) / preguntas.length) * 100;
  document.getElementById("barra-progreso").style.width = `${porcentaje}%`;

  const container = document.getElementById("opciones-container");
  container.innerHTML = "";

  q.opciones.forEach(opcion => {
    const btn = document.createElement("button");
    btn.className = "opcion-btn";
    btn.innerText = opcion;
    btn.onclick = () => seleccionarRespuesta(q.pregunta, opcion);
    container.appendChild(btn);
  });
}

function seleccionarRespuesta(pregunta, respuesta) {
  respuestasGuardadas[pregunta] = respuesta;
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
  document.getElementById("mensaje-final-titulo").innerText = "Guardando respuestas...";

  let mensajeDiscord = `💖 **¡Nuevas respuestas de ${nombreUsuario}!** 💖\n\n`;
  for (const [preg, resp] of Object.entries(respuestasGuardadas)) {
    mensajeDiscord += `• **${preg}:** ${resp}\n`;
  }

  try {
    if (DISCORD_WEBHOOK_URL && DISCORD_WEBHOOK_URL !== 'PEGA_AQUI_TU_WEBHOOK_DE_DISCORD') {
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