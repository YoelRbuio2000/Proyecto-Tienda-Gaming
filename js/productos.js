/* ========================================================================
   Recordatorio personal: Captura de DOM y Memoria
   1. Capturamos los elementos del HTML por su ID para poder manipularlos.
   2. 'catalogo' guardará los productos del JSON.
   3. 'miCarrito' lee del LocalStorage (o arranca vacío []) para no perder 
      la compra si se recarga la página.
   4. 'categoriaActual' recuerda qué filtro de categoría eligió el usuario.
   ======================================================================== */
const cajaProductos = document.getElementById("contenedor-productos");
const cajaCarrito = document.getElementById("carrito-productos");
const totalTxt = document.getElementById("total-carrito");
const nroCarrito = document.getElementById("cuenta-carrito");
const panelLateral = document.getElementById("carrito-lateral");
const inputBuscador = document.getElementById("input-buscador");

let catalogo = [];
let miCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
let categoriaActual = "todos";

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(miCarrito));
}

/* ========================================================================
   Recordatorio personal: Función Fetch (Carga Asíncrona)
   1. 'async / await' nos permite esperar a que los datos se descarguen  
      del archivo JSON sin congelar la pantalla.
   2. 'fetch("data/tienda.json")' busca el archivo de los productos.
   3. 'res.json()' convierte ese texto de respuesta en objetos JS manipulables.
   4. 'try / catch' ataja cualquier error (ej. si el archivo no existe).
   ======================================================================== */

async function iniciarTienda() {
    try {
        const res = await fetch("http://localhost:3000/api/productos");
        catalogo = await res.json();
        dibujarTienda(catalogo);
    } catch (err) {
        console.error("Error al obtener los productos desde la API:", err);
    }
}

/* ========================================================================
   Recordatorio personal: Renderizado de Productos en Pantalla
   1. 'cajaProductos.innerHTML = ""' limpia la pantalla antes de dibujar.
   2. Si la lista filtrada viene vacía (0 elementos), muestra un mensaje.
   3. 'lista.forEach' recorre cada producto del catálogo.
   4. 'document.createElement("div")' crea la tarjeta en memoria.
   5. Usamos comillas invertidas (`...`) para inyectar variables dinámicas.
   6. 'cajaProductos.append(article)' inserta la tarjeta armada en el HTML.
   ======================================================================== */

function dibujarTienda(lista) {
    if (!cajaProductos) return;
    cajaProductos.innerHTML = "";

    if (lista.length === 0) {
        cajaProductos.innerHTML = `<p style="color:#888; grid-column: 1 / -1;">No se encontraron productos.</p>`;
        return;
    }

    lista.forEach(p => {
        const article = document.createElement("div");
        article.className = "product-card";
        article.innerHTML = `
            <img src="${p.imagen}" alt="${p.nombre}">
            <div class="product-info">
                <h4>${p.nombre}</h4>
                <p class="precio">$${p.precio} USD</p>
                <button class="btn-add" data-id="${p.id}">SUMAR AL CARRITO</button>
            </div>
        `;
        cajaProductos.append(article);
    });
}

/* ========================================================================
   Recordatorio personal: Motor Combinado de Filtros
   1. Lee los 3 criterios al mismo tiempo: texto del buscador, rango de precio 
      y categoría/marca seleccionada.
   2. 'catalogo.filter()' evalúa cada producto contra las 3 condiciones.
   3. Pasa todo a minúsculas (.toLowerCase()) para evitar fallos por mayúsculas.
   4. Si el producto cumple A, B y C simultáneamente, pasa la prueba.
   5. 'dibujarTienda(resultado)' pinta en pantalla únicamente los filtrados.
   ======================================================================== */
function aplicarFiltros() {
    const texto = inputBuscador ? inputBuscador.value.trim().toLowerCase() : "";

    const minInput = document.getElementById("precio-min")?.value;
    const maxInput = document.getElementById("precio-max")?.value;
    const min = minInput !== "" && !isNaN(minInput) ? Number(minInput) : 0;
    const max = maxInput !== "" && !isNaN(maxInput) ? Number(maxInput) : Infinity;

    const resultado = catalogo.filter(producto => {
        let cumpleCategoria = false;
        if (categoriaActual.toLowerCase() === "todos") {
            cumpleCategoria = true;
        } else {
            const catFiltro = categoriaActual.toLowerCase();
            cumpleCategoria = (
                (producto.categoria && producto.categoria.toLowerCase() === catFiltro) ||
                (producto.marca && producto.marca.toLowerCase() === catFiltro) ||
                (producto.subcategoria && producto.subcategoria.toLowerCase() === catFiltro)
            );
        }

        const cumplePrecio = producto.precio >= min && producto.precio <= max;

        const cumpleTexto = texto === "" || (
            producto.nombre.toLowerCase().includes(texto) ||
            producto.categoria.toLowerCase().includes(texto) ||
            producto.marca.toLowerCase().includes(texto)
        );

        return cumpleCategoria && cumplePrecio && cumpleTexto;
    });

    dibujarTienda(resultado);
}

/* ========================================================================
   Recordatorio personal: Event Listeners para Filtros y Submenús
   1. Submenús: Controla la apertura/cierre de acordeones en el sidebar.
   2. Categorías: Asigna la 'categoriaActual' según el ID/texto seleccionado
      y ejecuta 'aplicarFiltros()'.
   3. Buscador y Precios: Escuchan los eventos 'input' y 'click' para filtrar.
   ======================================================================== */

// A) Submenús (Abrir / Cerrar acordeón)
document.querySelectorAll(".categoria-desplegable > .btn-categoria, .categoria-desplegable > a").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        const li = btn.closest(".categoria-desplegable");

        if (li) {
            document.querySelectorAll(".categoria-desplegable").forEach(otro => {
                if (otro !== li) otro.classList.remove("abierto");
            });

            li.classList.toggle("abierto");
        }
    });
});

// B) Clics en categorías y subcategorías
document.querySelectorAll(".btn-categoria, .btn-sub-categoria, .categoria-desplegable ul a, .sidebar a").forEach(btn => {
    btn.addEventListener("click", (e) => {
        if (btn.getAttribute("href") === "#" || !btn.getAttribute("href")) {
            e.preventDefault();
        }

        const idSeleccionado = btn.id ? btn.id : btn.innerText.trim();

        document.querySelectorAll(".btn-categoria").forEach(b => b.classList.remove("active"));

        if (btn.classList.contains("btn-categoria") && !btn.closest(".categoria-desplegable")) {
            btn.classList.add("active");
        }

        categoriaActual = idSeleccionado;
        aplicarFiltros();
    });
});

// C) Buscador
if (inputBuscador) {
    inputBuscador.addEventListener("input", () => {
        aplicarFiltros();
    });
}

// D) Botón Precio
const btnPrecio = document.getElementById("btn-filtrar-precio") || document.querySelector(".filtrar-precio button");
if (btnPrecio) {
    btnPrecio.addEventListener("click", (e) => {
        e.preventDefault();
        aplicarFiltros();
    });
}

/* ========================================================================
   Recordatorio personal: Renderizado y Cálculo del Carrito
   1. Si 'miCarrito' está vacío (length === 0), muestra el mensaje de alerta.
   2. Acumula el total a pagar ($) y la cantidad global de ítems.
   3. Construye dinámicamente cada fila del carrito con sus botones de suma,
      resta y eliminación asignando el índice correspondiente (${index}).
   4. Actualiza los contadores en el HTML y guarda el estado en LocalStorage.
   ======================================================================== */
function refrescarCarrito() {
    if (!cajaCarrito) return;

    if (miCarrito.length === 0) {
        cajaCarrito.innerHTML = `<p class="carrito-vacio">El carrito está vacío</p>`;
    } else {
        cajaCarrito.innerHTML = "";
    }

    let suma = 0;
    let totalItems = 0;

    miCarrito.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        suma += subtotal;
        totalItems += item.cantidad;

        const fila = document.createElement("div");
        fila.className = "producto-carrito";
        fila.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}">
            <div style="flex-grow:1;">
                <p style="font-size:13px; margin:0 0 4px 0;">${item.nombre}</p>
                <p style="color:#c1a35f; margin:0; font-weight:600;">$${item.precio} x ${item.cantidad}</p>
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
                <button onclick="cambiarCantidad(${index}, -1)" style="background:#222; border:none; color:white; width:24px; height:24px; cursor:pointer; border-radius:3px;">−</button>
                <span style="min-width:20px; text-align:center;">${item.cantidad}</span>
                <button onclick="cambiarCantidad(${index}, 1)" style="background:#222; border:none; color:white; width:24px; height:24px; cursor:pointer; border-radius:3px;">+</button>
                <button onclick="borrarDelCarrito(event, ${index})" style="color:#ff5555; background:none; border:none; cursor:pointer; font-size:18px; margin-left:6px;">×</button>
            </div>
        `;
        cajaCarrito.append(fila);
    });

    if (totalTxt) totalTxt.innerText = `$${suma}`;
    if (nroCarrito) nroCarrito.innerText = totalItems;

    guardarCarrito();
}

/* ========================================================================
   Recordatorio personal: Delegación de Eventos Global (Panel Lateral y Carrito)
   1. Escucha todos los clics del documento en un solo 'addEventListener'.
   2. 'btn-add': Busca el producto por su 'data-id' en el catálogo. Si ya 
      existe en el carrito incrementa su cantidad; si no, lo agrega.
   3. Abre el panel lateral (.active) al presionar el contador o botón del header.
   4. Cierra el panel lateral al presionar el botón de cierre (#cerrar-carrito).
   ======================================================================== */

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-add")) {
        const id = e.target.getAttribute("data-id");
        const prod = catalogo.find(x => x.id == id);

        if (prod) {
            const existente = miCarrito.find(item => item.id === prod.id);

            if (existente) {
                existente.cantidad += 1;
            } else {
                miCarrito.push({ ...prod, cantidad: 1 });
            }

            refrescarCarrito();
            if (panelLateral) panelLateral.classList.add("active");
        }
    }

    if (e.target.id === "cuenta-carrito" || e.target.closest(".nav-links-right a")) {
        if (panelLateral) panelLateral.classList.add("active");
    }

    if (e.target.id === "cerrar-carrito") {
        if (panelLateral) panelLateral.classList.remove("active");
    }
});

window.cambiarCantidad = (index, cambio) => {
    miCarrito[index].cantidad += cambio;
    if (miCarrito[index].cantidad <= 0) {
        miCarrito.splice(index, 1);
    }
    refrescarCarrito();
};

window.borrarDelCarrito = (e, idx) => {
    e.stopPropagation();
    miCarrito.splice(idx, 1);
    refrescarCarrito();
};

/* ========================================================================
   7. INICIALIZACIÓN
   ======================================================================== */
iniciarTienda();
refrescarCarrito();