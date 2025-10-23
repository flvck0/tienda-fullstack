import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import { useCart } from './context/CartContext';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false); // Tu lógica

  const { carrito, eliminarDelCarrito, vaciarCarrito } = useCart();
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrecio = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  const handleFinalizarCompra = () => {
    if (carrito.length === 0) return alert("Tu carrito está vacío 🛒");
    vaciarCarrito();
    setIsModalOpen(false);
  };

  // Tu lógica para el botón de scroll (se mantiene intacta)
  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      {/* --- HEADER REFACTORIZADO CON NAVBAR DE BOOTSTRAP --- */}
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
          <div className="container">
            <Link className="navbar-brand" to="/">
              Botillería Donde el Chico Terry
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Inicio</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/registro">Registrarse</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Ingresar</Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-warning ms-lg-3"
                    onClick={() => setIsModalOpen(true)}
                  >
                    🛒 Carrito ({totalItems})
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* --- RUTAS (Esto se queda igual) --- */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>

      {/* --- FOOTER REFACTORIZADO CON BOOTSTRAP --- */}
      <footer className="bg-dark text-white text-center p-4 mt-5">
        <div className="container">
          <p className="mb-1">&copy; 2025 Botillería Donde el Chico Terry</p>
          <p className="mb-1">📍 Dirección: Av. Siempre Viva 123, Santiago, Chile</p>
          <p className="mb-1">📧 <a href="mailto:contacto@chicoterry.cl" className="text-warning">contacto@chicoterry.cl</a></p>
          <p className="mb-1">🕑 Horario: Lunes a viernes de 10:00 a 22:00 hrs</p>
          <div className="redes">
            <a href="#" className="text-white mx-2">📘 Facebook</a> |
            <a href="#" className="text-white mx-2">📸 Instagram</a> |
            <a href="#" className="text-white mx-2">💬 WhatsApp</a>
          </div>
        </div>
      </footer>

      {/* --- TU BOTÓN (Se mantiene intacto) --- */}
      <button className={`back-top ${showBackTop ? 'show' : ''}`} onClick={scrollTop} aria-label="Subir">
        <span>🍺</span>
      </button>

      {/* --- MODAL REFACTORIZADO CON BOOTSTRAP --- */}
      {isModalOpen && (
        <div
          className="modal"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => {
            if (e.target.className === 'modal') setIsModalOpen(false);
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">🛍️ Tu Carrito</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                {carrito.length === 0 ? (
                  <p>Tu carrito está vacío.</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {carrito.map(item => (
                      <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          {item.nombre} (x{item.cantidad})
                          <br />
                          <small className="text-muted">${(item.precio * item.cantidad).toLocaleString()}</small>
                        </div>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => eliminarDelCarrito(item.id)}
                        >
                          ❌
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="modal-footer d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Total: ${totalPrecio.toLocaleString()}</h5>
                <button
                  id="finalizarCompra"
                  className="btn btn-success"
                  onClick={handleFinalizarCompra}
                  disabled={carrito.length === 0}
                >
                  Finalizar compra
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