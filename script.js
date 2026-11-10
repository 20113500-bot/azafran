// =====================================================
//  PARTE 1: CALCULADOR DE PORCIONES
// =====================================================

// La receta original está pensada para 4 personas.
const porcionesBase = 4;

// Lista de ingredientes con la cantidad necesaria para 4 personas.
const ingredientes = [
  { cantidad: 500, unidad: "g",    nombre: "pechuga de pollo" },
  { cantidad: 8,   unidad: "",     nombre: "tortillas de maíz" },
  { cantidad: 2,   unidad: "",     nombre: "limones" },
  { cantidad: 2,   unidad: "",     nombre: "aguacates" },
  { cantidad: 1,   unidad: "",     nombre: "cebolla morada" },
  { cantidad: 30,  unidad: "ml",   nombre: "aceite de oliva" },
  { cantidad: 20,  unidad: "g",    nombre: "cilantro fresco" },
  { cantidad: 4,   unidad: "g",    nombre: "sal" }
];

// Guardamos en variables las piezas del HTML que vamos a usar.
const campoPorciones = document.getElementById("campo-porciones");
const botonMenos = document.getElementById("boton-menos");
const botonMas = document.getElementById("boton-mas");
const listaIngredientes = document.getElementById("lista-ingredientes");

// Esta función vuelve a escribir la lista de ingredientes en la página.
function mostrarIngredientes() {
  // 1. Leemos cuántas personas ha puesto el usuario.
  let porciones = Number(campoPorciones.value);

  // 2. Si el número no vale (vacío, 0, negativo...), usamos 1.
  //    Y si se pasa de 20, lo dejamos en 20.
  if (porciones < 1 || isNaN(porciones)) {
    porciones = 1;
  }
  if (porciones > 20) {
    porciones = 20;
  }

  // 3. Vaciamos la lista para escribirla de nuevo.
  listaIngredientes.innerHTML = "";

  // 4. Recorremos los ingredientes uno por uno.
  for (const ingrediente of ingredientes) {
    // Regla de tres: cantidad para 1 persona × número de personas.
    const cantidadPorPersona = ingrediente.cantidad / porcionesBase;
    let cantidadNueva = cantidadPorPersona * porciones;

    // Redondeamos a un decimal para que no salga 1.3333333.
    cantidadNueva = Math.round(cantidadNueva * 10) / 10;

    // Creamos un <li> nuevo y lo metemos en la lista.
    const elemento = document.createElement("li");
    elemento.innerHTML =
      "<strong>" + cantidadNueva + " " + ingrediente.unidad + "</strong> " +
      ingrediente.nombre;
    listaIngredientes.appendChild(elemento);
  }
}

// Botón "−": resta una porción (sin bajar de 1).
botonMenos.addEventListener("click", function () {
  const porciones = Number(campoPorciones.value);
  if (porciones > 1) {
    campoPorciones.value = porciones - 1;
  }
  mostrarIngredientes();
});

// Botón "+": suma una porción (sin pasar de 20).
botonMas.addEventListener("click", function () {
  const porciones = Number(campoPorciones.value);
  if (porciones < 20) {
    campoPorciones.value = porciones + 1;
  }
  mostrarIngredientes();
});

// Si el usuario escribe el número a mano, también recalculamos.
campoPorciones.addEventListener("input", mostrarIngredientes);

// Al abrir la página mostramos la lista por primera vez.
mostrarIngredientes();


// =====================================================
//  PARTE 2: BUSCADOR DE RECETAS
// =====================================================

const campoBusqueda = document.getElementById("campo-busqueda");
const filtroTiempo = document.getElementById("filtro-tiempo");
const tarjetas = document.querySelectorAll(".tarjeta");
const mensajeSinResultados = document.getElementById("sin-resultados");

function filtrarRecetas() {
  // Lo que ha escrito el usuario, en minúsculas y sin espacios sobrantes.
  const texto = campoBusqueda.value.toLowerCase().trim();

  // Tiempo máximo elegido (0 significa "cualquier tiempo").
  const tiempoMaximo = Number(filtroTiempo.value);

  let recetasVisibles = 0;

  for (const tarjeta of tarjetas) {
    // Leemos los datos guardados en el HTML de cada tarjeta.
    const ingredientesTarjeta = tarjeta.dataset.ingredientes.toLowerCase();
    const titulo = tarjeta.querySelector("h3").textContent.toLowerCase();
    const tiempo = Number(tarjeta.dataset.tiempo);

    // ¿Coincide el texto con el título o con algún ingrediente?
    const coincideTexto =
      ingredientesTarjeta.includes(texto) || titulo.includes(texto);

    // ¿Entra dentro del tiempo elegido?
    const coincideTiempo = tiempoMaximo === 0 || tiempo <= tiempoMaximo;

    // Si cumple las dos cosas se muestra; si no, se esconde.
    if (coincideTexto && coincideTiempo) {
      tarjeta.classList.remove("oculta");
      recetasVisibles = recetasVisibles + 1;
    } else {
      tarjeta.classList.add("oculta");
    }
  }

  // Si no queda ninguna receta a la vista, enseñamos el mensaje.
  if (recetasVisibles === 0) {
    mensajeSinResultados.classList.remove("oculta");
  } else {
    mensajeSinResultados.classList.add("oculta");
  }
}

// Filtramos cada vez que el usuario escribe o cambia el tiempo.
campoBusqueda.addEventListener("input", filtrarRecetas);
filtroTiempo.addEventListener("change", filtrarRecetas);
