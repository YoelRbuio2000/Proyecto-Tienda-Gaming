const contenedorProductos = document.querySelector("#contenedor-productos");

async function cargarProductos() {
    try {
        
        const respuesta = await fetch("js/productos.json"); 
        const productos = await respuesta.json();
        
        contenedorProductos.innerHTML = "";

        productos.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("product-card");
            div.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div class="product-info">
                    <h4>${producto.nombre}</h4>
                    <p class="precio">$${producto.precio} USD</p>
                    <button class="btn-add" id="${producto.id}">Sumar al carrito</button>
                </div>
            `;
            contenedorProductos.append(div);
        });
    } catch (error) {
        console.error("Error al cargar el JSON:", error);
    }
}


function configurarMenu(botonId, menuId) {
    const boton = document.querySelector(botonId);
    const menu = document.querySelector(menuId);

    if (boton && menu) {
        boton.onclick = (e) => { 
            e.preventDefault();
            menu.classList.toggle("open");
            boton.parentElement.classList.toggle("active");
            console.log("Clic en:", botonId); 
        };
    }
}


document.addEventListener("DOMContentLoaded", () => {
    configurarMenu("#Procesadores", "#sub-procesadores");
    configurarMenu("[id='Placas-de-Video']", "#placas-de-video");
    configurarMenu("#Motherboard", "#motherboards");
    cargarProductos();
});