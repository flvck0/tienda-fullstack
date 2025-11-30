import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

// Importación de Páginas
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage'; // 👈 Tu nueva página

// Contextos y Seguridad
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './ProtectedRoute'; // Asegúrate de crear este archivo (código abajo)

// --- Componentes Placeholder (Para cumplir rúbrica si no tienes las páginas hechas) ---
const OrdersPage = () => (
  <div className="container mt-5 text-center">
    <h1>📦 Gestión de Órdenes</h1>
    <p className="lead">Zona exclusiva para vendedores.</p>
  </div>
);

const NoAuth = () => (
  <div className="container mt-5 text-center">
    <h1 className="text-danger display-1">403</h1>
    <h2>Acceso Denegado ❌</h2>
    <p>No tienes permisos para ver esta página.</p>
    <Link to="/" className="btn btn-primary mt-3">Volver al Inicio</Link>
  </div>
);
// ----------------------------------------------------------------------------------

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);

  const { carrito, eliminarDelCarrito, vaciarCarrito, comprar } = useCart(); // Agregamos 'comprar'
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Cálculos del carrito
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrecio = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  // Lógica de Scroll
  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Manejador de Compra
  const handleFinalizarCompra = async () => {
    if (carrito.length === 0) return alert("Tu carrito está vacío 🛒");
    
    // Verificamos si el usuario está logueado antes de comprar
    if (!user) {
        alert("Debes iniciar sesión para finalizar la compra.");
        setIsModalOpen(false);
        navigate('/login');
        return;
    }

    // Llamamos a la función comprar del Context (que conecta con el Backend)
    const exito = await comprar(user.token, user.id);
    if (exito) setIsModalOpen(false);
  };

  return (
    <>
      {/* ---------- NAVBAR ---------- */}
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
          <div className="container">

            <Link className="navbar-brand fw-bold" to="/">
              Botillería Donde el Chico Terry 🍻
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto align-items-center">

                {/* LINKS PÚBLICOS (Si no está logueado) */}
                {!user && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/">Inicio</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/register">Registrarse</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link btn btn-outline-light ms-2 px-3" to="/login">Ingresar</Link>
                    </li>
                  </>
                )}

                {/* LINKS PRIVADOS (Si está logueado) */}
                {user && (
                  <>
                    <li className="nav-item me-3">
                      <span className="text-white">
                        Hola, <strong>{user.nombre}</strong>
                        {user.role === 'ADMIN' && <span className="badge bg-danger ms-2">ADMIN</span>}
                      </span>
                    </li>

                    {/* Botón Panel Admin */}
                    {user.role === "ADMIN" && (
                      <li className="nav-item">
                        <Link className="btn btn-sm btn-outline-info me-2" to="/admin">⚙️ Panel</Link>
                      </li>
                    )}

                    <li className="nav-item">
                      <button className="btn btn-sm btn-danger" onClick={logout}>
                        Salir
                      </button>
                    </li>
                  </>
                )}

                {/* BOTÓN CARRITO (Siempre visible) */}
                <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
                  <button
                    className="btn btn-warning position-relative"
                    onClick={() => setIsModalOpen(true)}
                  >
                    🛒 Carrito
                    {totalItems > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {totalItems}
                      </span>
                    )}
                  </button>
                </li>

              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* ---------- RUTAS ---------- */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Ojo: asegúrate que en RegisterPage la URL sea /register o cambia aquí a /registro */}
        <Route path="/register" element={<RegisterPage />} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/no-autorizado" element={<NoAuth />} />

        {/* 🔒 RUTA PROTEGIDA: ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* 🔒 RUTA PROTEGIDA: VENDEDOR */}
        <Route
          path="/ordenes"
          element={
            <ProtectedRoute allowedRoles={["VENDEDOR", "ADMIN"]}>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* ---------- FOOTER ---------- */}
      <footer className="bg-dark text-white text-center p-4 mt-5">
        <div className="container">
          <p className="mb-1">&copy; 2025 Botillería Donde el Chico Terry</p>
          <p className="mb-1 text-muted small">Desarrollado con Spring Boot & React</p>
        </div>
      </footer>

      {/* ---------- BOTÓN SUBIR ---------- */}
      <button className={`back-top ${showBackTop ? 'show' : ''}`} onClick={scrollTop}>
        ⬆️
      </button>

      {/* ---------- MODAL CARRITO ---------- */}
      {isModalOpen && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => { if (e.target.className.includes('modal')) setIsModalOpen(false); }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header bg-warning">
                <h5 className="modal-title fw-bold">🛒 Tu Pedido</h5>
                <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
              </div>

              <div className="modal-body">
                {carrito.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="mb-0">Tu carrito está vacío 😢</p>
                  </div>
                ) : (
                  <ul className="list-group list-group-flush">
                    {carrito.map(item => (
                      <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <span className="badge bg-secondary me-2">{item.cantidad}x</span>
                            <div>
                                <h6 className="mb-0">{item.nombre}</h6>
                                <small className="text-muted">${item.precio.toLocaleString()} c/u</small>
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <span className="fw-bold me-3">${(item.precio * item.cantidad).toLocaleString()}</span>
                            <button
                            className="btn btn-outline-danger btn-sm rounded-circle"
                            onClick={() => eliminarDelCarrito(item.id)}
                            title="Eliminar"
                            >
                            🗑️
                            </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="modal-footer d-flex justify-content-between">
                <h5 className="fw-bold">Total: ${totalPrecio.toLocaleString()}</h5>
                <button
                  className="btn btn-success px-4"
                  onClick={handleFinalizarCompra}
                  disabled={carrito.length === 0}
                >
                  Pagar Ahora 💳
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;