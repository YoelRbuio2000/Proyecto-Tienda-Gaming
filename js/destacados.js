document.addEventListener("DOMContentLoaded", async () => {
    const contenedor = document.querySelector("#contenedor-destacados");
    if (!contenedor) return;

    try {
        const respuesta = await fetch("https://proyecto-tienda-gaming-production.up.railway.app/api/productos");
        const productos = await respuesta.json();

        contenedor.innerHTML = "";
        const destacados = productos.slice(0, 3);

        destacados.forEach(producto => {
            const card = document.createElement("article");
            card.classList.add("producto-card");

            card.innerHTML = `
                <div class="producto-img">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                </div>
                <div class="producto-texto">
                    <h3>${producto.nombre}</h3>
                    <p class="precio">$${producto.precio} USD</p>
                </div>
            `;
            contenedor.appendChild(card);
        });
    } catch (error) {
        console.error("Error al cargar los productos destacados", error);
    }
});