const cajaProductos = document.getElementById("contenedor-productos");
const cajaCarrito = document.getElementById("carrito-productos");
const totalTxt = document.getElementById("total-carrito");
const nroCarrito = document.getElementById("cuenta-carrito");
const panelLateral = document.getElementById("carrito-lateral");

let catalogo = [];
let miCarrito = JSON.parse(localStorage.getItem("carrito")) || [];

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(miCarrito));
}

// =========================================
// Carga de productos
// =========================================
async function iniciarTienda() {
    try {
        const res = await fetch("data/tienda.json"); //  "js/productos.json" según dónde lo tengas
        catalogo = await res.json();
        dibujarTienda(catalogo);
    } catch (err) {
        console.error("Error al cargar el JSON:", err);
    }
}

// =========================================
// DIBUJAR PRODUCTOS
// =========================================

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
            <img src="../${p.imagen}" alt="${p.nombre}">
            <div class="product-info">
                <h4>${p.nombre}</h4>
                <p class="precio">$${p.precio} USD</p>
                <button class="btn-add" data-id="${p.id}">SUMAR AL CARRITO</button>
            </div>
        `;
        cajaProductos.append(article);
    });
}

// =========================================
// CARRITO
// =========================================
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
// =========================================
// Carrito y Botones del  carrito.
// =========================================
document.addEventListener("click", (e) => {
    // Agregar al carrito
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

    // Abrir carrito
    if (e.target.id === "cuenta-carrito" || e.target.closest(".nav-links-right a")) {
        panelLateral.classList.add("active");
    }

    // Cerrar carrito
    if (e.target.id === "cerrar-carrito") {
        panelLateral.classList.remove("active");
    }
});

// =========================================
// Categorias ( Sub Menu )
// =========================================
document.querySelectorAll(".categoria-desplegable > .btn-categoria").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        const li = btn.closest(".categoria-desplegable");

        // Cerrar los demás
        document.querySelectorAll(".categoria-desplegable").forEach(otro => {
            if (otro !== li) otro.classList.remove("abierto");
        });

        // Toggle del actual
        li.classList.toggle("abierto");
    });
});

// =========================================
// Filtro de Categorias.
// =========================================
document.querySelectorAll(".btn-categoria, .btn-sub-categoria").forEach(btn => {
    btn.addEventListener("click", () => {
        const id = btn.id;

        // Quitar active de todos
        document.querySelectorAll(".btn-categoria").forEach(b => b.classList.remove("active"));

        // Poner active solo a categorías principales simples
        if (btn.classList.contains("btn-categoria") && !btn.closest(".categoria-desplegable")) {
            btn.classList.add("active");
        }

        let filtrados = [];

        switch (id) {
            case "todos":
                filtrados = catalogo;
                break;

            case "Combos":
                filtrados = catalogo.filter(p => p.categoria === "Combos");
                break;

            case "Procesadores":
                filtrados = catalogo.filter(p => p.categoria === "Procesadores");
                break;

            case "Placas-de-Video":
                filtrados = catalogo.filter(p => p.categoria === "Placas de Video");
                break;

            case "Motherboard":
                filtrados = catalogo.filter(p => p.categoria === "Motherboards");
                break;

            case "Notebooks":
                filtrados = catalogo.filter(p => p.categoria === "Notebooks");
                break;

            // Sub - Procesadores
            case "AMD":
                filtrados = catalogo.filter(p => p.marca === "AMD" && p.categoria === "Procesadores");
                break;
            case "Intel":
                filtrados = catalogo.filter(p => p.marca === "Intel");
                break;

            // Sub - Placas de Video
            case "Nvidia":
                filtrados = catalogo.filter(p => p.marca === "Nvidia");
                break;
            case "AMD-GPU":
                filtrados = catalogo.filter(p => p.marca === "AMD" && p.categoria === "Placas de Video");
                break;

            // Sub - Motherboards
            case "ASRock-Mother":
                filtrados = catalogo.filter(p => p.marca === "ASRock");
                break;
            case "MSI-Mother":
                filtrados = catalogo.filter(p => p.marca === "MSI");
                break;
            case "Asus":
                filtrados = catalogo.filter(p => p.marca === "Asus");
                break;
            case "Gigabyte-Mother":
                filtrados = catalogo.filter(p => p.marca === "Gigabyte");
                break;

            default:
                filtrados = catalogo;
        }

        dibujarTienda(filtrados);
    });
});

iniciarTienda();
refrescarCarrito();



// =========================================
// FILTRO POR PRECIO
// =========================================
document.getElementById("btn-filtrar-precio")?.addEventListener("click", () => {
    const min = Number(document.getElementById("precio-min").value) || 0;
    const max = Number(document.getElementById("precio-max").value) || Infinity;

    const filtrados = catalogo.filter(p => p.precio >= min && p.precio <= max);
    dibujarTienda(filtrados);
});

// =========================================
// BARRA DE BÚSQUEDA
// =========================================
const inputBuscador = document.getElementById("input-buscador");

if (inputBuscador) {
    inputBuscador.addEventListener("input", () => {
        const texto = inputBuscador.value.trim().toLowerCase();

        if (texto === "") {
            dibujarTienda(catalogo); 
            return;
        }

        const filtrados = catalogo.filter(p => {
            return (
                p.nombre.toLowerCase().includes(texto) ||
                p.categoria.toLowerCase().includes(texto) ||
                p.marca.toLowerCase().includes(texto)
            );
        });

        dibujarTienda(filtrados);
    });
}

// =========================================
// GESTION DE CANTIDAD EN EL CARRITO
// =========================================
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