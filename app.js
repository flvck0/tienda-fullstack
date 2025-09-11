// app.js: validaciones + carrito + categorías
(function () {
  // --- TOASTS ---
  function showToast(msg, tipo = "success") {
    const toast = document.createElement("div");
    toast.textContent = msg;
    toast.className = "toast " + tipo;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // --- Email válido ---
  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // --- Utilidad: errores ---
  const setError = (id, msg) => { const el = document.getElementById(id); if (el) el.textContent = msg || ""; };

  // --- REGISTRO ---
  const formRegistro = document.getElementById("formRegistro");
  if (formRegistro) {
    formRegistro.addEventListener("submit", (e) => {
      e.preventDefault();
      const nombre = document.getElementById("nombre").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirmar = document.getElementById("confirmar").value;
      const pais = document.getElementById("pais").value.trim();
      const terminos = document.getElementById("terminos").checked;

      setError("err-nombre",""); setError("err-email",""); setError("err-password","");
      setError("err-confirmar",""); setError("err-pais",""); setError("err-terminos","");

      let ok = true;
      if (nombre.length < 3) { setError("err-nombre","Ingresa tu nombre (mínimo 3 caracteres)."); ok = false; }
      if (!validarEmail(email)) { setError("err-email","Ingresa un correo válido (ej: nombre@dominio.com)."); ok = false; }
      if (password.length < 8) { setError("err-password","La contraseña debe tener al menos 8 caracteres."); ok = false; }
      if (confirmar !== password) { setError("err-confirmar","Las contraseñas no coinciden."); ok = false; }
      if (!pais) { setError("err-pais","Selecciona o escribe tu país."); ok = false; }
      if (!terminos) { setError("err-terminos","Debes aceptar los términos y condiciones."); ok = false; }

      if (ok) { showToast("Registro exitoso. ¡Bienvenido/a! 🎉"); formRegistro.reset(); }
    });
  }

  // --- LOGIN ---
  const formLogin = document.getElementById("formLogin");
  if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value.trim();
      const pass = document.getElementById("loginPassword").value;

      setError("err-login-email",""); setError("err-login-password","");
      let ok = true;
      if (!validarEmail(email)) { setError("err-login-email","Correo no válido."); ok = false; }
      if (pass.length < 8) { setError("err-login-password","La contraseña debe tener al menos 8 caracteres."); ok = false; }

      if (ok) { showToast("Ingreso exitoso ✅"); formLogin.reset(); }
    });
  }

  // --- CARRITO ---
  const botonesPedir = document.querySelectorAll(".producto-card .btn");
  const listaCarrito = document.getElementById("listaCarrito");
  const totalCarrito = document.getElementById("totalCarrito");
  const carritoCantidad = document.getElementById("carritoCantidad");
  const btnCarrito = document.getElementById("btnCarrito");
  const carritoModal = document.getElementById("carritoModal");
  const cerrarCarrito = document.getElementById("cerrarCarrito");

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  function renderCarrito() {
    if (!listaCarrito || !totalCarrito || !carritoCantidad) return;
    listaCarrito.innerHTML = "";
    let total = 0;

    carrito.forEach((item, index) => {
      total += item.precio * item.cantidad;
      const li = document.createElement("li");
      li.innerHTML = `
        ${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString()}
        <button class="btnEliminar" data-index="${index}">❌</button>
      `;
      listaCarrito.appendChild(li);
    });

    totalCarrito.innerHTML = `<strong>Total:</strong> $${total.toLocaleString()}`;
    carritoCantidad.textContent = carrito.reduce((acc, it) => acc + it.cantidad, 0);
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  // Agregar productos
  botonesPedir.forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".producto-card");
      const nombre = card.querySelector("h3").textContent;
      const precio = parseInt(card.querySelector(".precio").textContent.replace("$","").replace(/\./g,""));
      const existente = carrito.find((it) => it.nombre === nombre);
      if (existente) existente.cantidad++;
      else carrito.push({ nombre, precio, cantidad: 1 });

      renderCarrito();
      showToast(`${nombre} agregado al carrito 🛒`);
    });
  });

  // Abrir / cerrar carrito
  if (btnCarrito && carritoModal) {
    btnCarrito.addEventListener("click", (e) => { e.preventDefault(); carritoModal.style.display = "block"; });
  }
  if (cerrarCarrito) cerrarCarrito.addEventListener("click", () => carritoModal.style.display = "none");
  window.addEventListener("click", (e) => { if (e.target === carritoModal) carritoModal.style.display = "none"; });

  // Eliminar del carrito
  if (listaCarrito) {
    listaCarrito.addEventListener("click", (e) => {
      if (e.target.classList.contains("btnEliminar")) {
        const idx = +e.target.getAttribute("data-index");
        carrito.splice(idx, 1);
        renderCarrito();
        showToast("Producto eliminado ❌", "error");
      }
    });
  }

  // Finalizar compra
  const finalizarCompra = document.getElementById("finalizarCompra");
  if (finalizarCompra) {
    finalizarCompra.addEventListener("click", () => {
      if (!carrito.length) return showToast("Tu carrito está vacío 🛒", "error");
      showToast("¡Gracias por tu compra! 🎉");
      carrito = [];
      renderCarrito();
      carritoModal.style.display = "none";
    });
  }

  // --- CATEGORÍAS (filtro) ---
  const filtros = document.getElementById("filtrosCategorias");
  const cards = Array.from(document.querySelectorAll(".producto-card"));
  if (filtros && cards.length) {
    filtros.addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      filtros.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
      btn.classList.add("active");

      const cat = btn.getAttribute("data-cat");
      cards.forEach(card => {
        const c = card.getAttribute("data-cat");
        const visible = (cat === "todos") || (c === cat);
        card.style.display = visible ? "" : "none";
      });
      document.getElementById("productos-titulo")?.scrollIntoView({behavior:"smooth", block:"start"});
    });
  }

  // Inicial
  renderCarrito();
})();
