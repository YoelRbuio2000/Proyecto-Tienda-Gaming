
const cajaProductos = document.getElementById("contenedor-productos");
const cajaCarrito = document.getElementById("carrito-productos");
const totalTxt = document.getElementById("total-carrito");
const nroCarrito = document.getElementById("cuenta-carrito");
const panelLateral = document.getElementById("carrito-lateral");

let catalogo = [];
let miCarrito = [];


async function iniciarTienda() {
    try {
        const res = await fetch("js/productos.json");
        catalogo = await res.json();
        dibujarTienda(catalogo);
    } catch (err) {
        console.error("Error al cargar el JSON:", err);
    }
}


function dibujarTienda(lista) {
    if (!cajaProductos) return;
    cajaProductos.innerHTML = "";
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


function refrescarCarrito() {
    cajaCarrito.innerHTML = miCarrito.length === 0 ? "<p>El carrito está vacío</p>" : "";
    let suma = 0;

    miCarrito.forEach((item, index) => {
        suma += item.precio;
        const fila = document.createElement("div");
        fila.className = "producto-carrito";
        
    
        fila.innerHTML = `
            <img src="${item.imagen}" style="width:50px; height:50px; object-fit:contain;">
            <div style="flex-grow:1; margin-left:10px;">
                <p style="font-size:12px; margin:0;">${item.nombre}</p>
                <p style="color:#d4af37; margin:0;">$${item.precio}</p>
            </div>
            <button onclick="borrarDelCarrito(event, ${index})" style="color:red; background:none; border:none; cursor:pointer; font-weight:bold; padding:10px;">X</button>
        `;
        cajaCarrito.append(fila);
    });

    totalTxt.innerText = `$${suma} USD`;
    nroCarrito.innerText = miCarrito.length;
}


window.borrarDelCarrito = (e, idx) => {
    e.stopPropagation(); 
    miCarrito.splice(idx, 1);
    refrescarCarrito();
};


document.addEventListener("click", (e) => {
    
    if (e.target.classList.contains("btn-add")) {
        const id = e.target.getAttribute("data-id");
        const prod = catalogo.find(x => x.id == id);
        if (prod) {
            miCarrito.push(prod);
            refrescarCarrito();
            panelLateral.classList.add("active");
        }
    }


    if (e.target.id === "cuenta-carrito" || e.target.closest(".nav-links-right")) {
        panelLateral.classList.add("active");
    }

    
    if (e.target.id === "cerrar-carrito") {
        panelLateral.classList.remove("active");
    }
});

iniciarTienda();