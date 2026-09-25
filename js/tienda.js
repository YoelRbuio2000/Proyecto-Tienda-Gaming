// =========================================
// SUBMENÚS (abrir / cerrar)
// =========================================
document.querySelectorAll(".categoria-desplegable > .btn-categoria").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();

        const li = btn.closest(".categoria-desplegable");

        // Cerrar los demás
        document.querySelectorAll(".categoria-desplegable").forEach(otro => {
            if (otro !== li) {
                otro.classList.remove("abierto");
            }
        });

        // Abrir / cerrar el actual
        li.classList.toggle("abierto");
    });
});


// =========================================
// FILTRADO POR CATEGORÍA
// =========================================
document.querySelectorAll(".btn-categoria, .btn-sub-categoria").forEach(btn => {
    btn.addEventListener("click", (e) => {
        // Si es un botón de submenú, no cerramos el menú
        if (!btn.classList.contains("btn-sub-categoria")) {
            // Ya se maneja arriba
        }

        const id = btn.id;

        // Quitar active de todos
        document.querySelectorAll(".btn-categoria").forEach(b => b.classList.remove("active"));

        // Poner active solo si es categoría principal
        if (btn.classList.contains("btn-categoria")) {
            btn.classList.add("active");
        }

        // Filtrar productos
        if (id === "todos") {
            dibujarTienda(catalogo);
        } else {
            // Filtrado simple por ahora (según el id)
            const filtrados = catalogo.filter(p => {
                // Ajustá esta lógica según cómo estén los datos en el JSON
                return (
                    p.categoria === id ||
                    p.subcategoria === id ||
                    (p.nombre && p.nombre.toLowerCase().includes(id.toLowerCase()))
                );
            });
            dibujarTienda(filtrados);
        }
    });
});