// =========================================
// Simulacion (LocalStorage)
// =========================================

const formRegister = document.getElementById("form-register");
const formLogin = document.getElementById("form-login");
const mensaje = document.getElementById("mensaje");

// REGISTRO 
if (formRegister) {
    formRegister.addEventListener("submit", (e) => {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const password2 = document.getElementById("password2").value;

        if (password !== password2) {
            mostrarMensaje("Las contraseñas no coinciden", "error");
            return;
        }

        
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    
        const existe = usuarios.find(u => u.email === email);
        if (existe) {
            mostrarMensaje("Ese correo ya está registrado", "error");
            return;
        }

    
        usuarios.push({ nombre, email, password });
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        mostrarMensaje("Cuenta creada correctamente. Redirigiendo...", "exito");

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
    });
}

// Login
if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;

        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const usuario = usuarios.find(u => u.email === email && u.password === password);

        if (!usuario) {
            mostrarMensaje("Correo o contraseña incorrectos", "error");
            return;
        }

        // Guardar sesión
        localStorage.setItem("usuarioLogueado", JSON.stringify({
            nombre: usuario.nombre,
            email: usuario.email
        }));

        mostrarMensaje("¡Bienvenido " + usuario.nombre + "!", "exito");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1200);
    });
}

// Mensaje
function mostrarMensaje(texto, tipo) {
    if (!mensaje) return;
    mensaje.textContent = texto;
    mensaje.className = "mensaje " + tipo;
}

// Cerrar sesion
function cerrarSesion() {
    localStorage.removeItem("usuarioLogueado");
    window.location.href = "index.html";
}