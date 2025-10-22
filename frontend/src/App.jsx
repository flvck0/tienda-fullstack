import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Importamos las paginas
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

// importacion del carrito
import { useCart } from './context/CartContext';

function App() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { 
    carrito, 
    eliminarDelCarrito, 
    vaciarCarrito 
  } = useCart();

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrecio = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  
  const handleFinalizarCompra = () => {
    if (carrito.length === 0) return alert("Tu carrito está vacío 🛒");
    vaciarCarrito();
    setIsModalOpen(false);
  };

  return (
    <> 
      <header>
        <div className="header-contenido">
          <h1 className="site-title">
            <Link to="/">Botillería Donde el Chico Terry</Link>
          </h1>
          <nav>
            <Link to="/">Inicio</Link>
            <Link to="/registro">Registrarse</Link>
            <Link to="/login">Ingresar</Link>
            
            <button 
              className="btn-carrito" 
              onClick={() => setIsModalOpen(true)}
            >
              🛒 Carrito (<span id="carritoCantidad">{totalItems}</span>)
            </button>
          </nav>
        </div>
      </header>

      {/* --- ÁREA DE CONTENIDO DINÁMICO --- */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      
      <footer>
        <div className="footer-contenido">
          <p>&copy; 2025 Botillería Donde el Chico Terry</p>
          <p>📍 Dirección: Av. Siempre Viva 123, Santiago, Chile</p>
          <p>📧 <a href="mailto:contacto@chicoterry.cl">contacto@chicoterry.cl</a></p>
          <p>🕑 Horario: Lunes a viernes de 10:00 a 22:00 hrs</p>
          <div className="redes">
            <a href="#">📘 Facebook</a> |
            <a href="#">📸 Instagram</a> |
            <a href="#">💬 WhatsApp</a>
          </div>
        </div>
      </footer>
      
      {isModalOpen && (
        <div 
          id="carritoModal" 
          className="carrito-modal" 
          style={{ display: 'block' }} 
          onClick={(e) => { if (e.target.id === 'carritoModal') setIsModalOpen(false); }}
        >
          <div className="carrito-contenido">
            <span className="cerrar" onClick={() => setIsModalOpen(false)}>&times;</span>
            <h2>🛍️ Tu Carrito</h2>
            <ul id="listaCarrito">
              {carrito.length === 0 ? <p>Tu carrito está vacío.</p> : (
                carrito.map(item => (
                  <li key={item.id}>
                    <span>{item.nombre} (x{item.cantidad}) - ${ (item.precio * item.cantidad).toLocaleString() }</span>
                    <button onClick={() => eliminarDelCarrito(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '10px' }}>❌</button>
                  </li>
                ))
              )}
            </ul>
            <p id="totalCarrito"><strong>Total:</strong> ${totalPrecio.toLocaleString()}</p>
            <button id="finalizarCompra" className="btn full" onClick={handleFinalizarCompra}>
              Finalizar compra
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;