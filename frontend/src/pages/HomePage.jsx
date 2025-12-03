import React, { useState, useEffect } from 'react';
// Asegúrate de que esta ruta sea correcta
import { useCart } from '../context/CartContext'; 

// --- Componente SKELETON ---
const ProductSkeleton = () => (
  <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
    <div className="card h-100" aria-hidden="true">
      <div className="card-body placeholder-glow">
        <span className="placeholder col-12" style={{height: '150px'}}></span>
        <span className="placeholder col-8 mt-3"></span>
        <span className="placeholder col-6"></span>
        <span className="placeholder col-4"></span>
      </div>
    </div>
  </div>
);

function HomePage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroActivo, setFiltroActivo] = useState('todos');
  const [toast, setToast] = useState(null); 
  const { agregarAlCarrito, carrito } = useCart(); 

  useEffect(() => {
    // URL del Backend (Dinámica: Local o Nube)
    const API_URL = import.meta.env.VITE_API_URL;

    console.log("Conectando a:", API_URL); // Para depuración

    fetch(`${API_URL}/api/productos`)
      .then(res => {
        if (!res.ok) {
            throw new Error('Error al conectar con el backend');
        }
        return res.json();
      })
      .then(data => {
        console.log("Productos cargados:", data);
        setProductos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al hacer fetch:", err);
        setLoading(false);
      });
  }, []);

  const productosFiltrados = productos.filter(prod => {
    if (filtroActivo === 'todos') return true;
    return prod.categoria && prod.categoria.toLowerCase() === filtroActivo.toLowerCase();
  });

  const addToCartWithToast = (prod) => {
    if (prod.stock <= 0) {
        alert("Lo sentimos, este producto está agotado.");
        return;
    }

    agregarAlCarrito(prod);
    setToast({ title: 'Agregado al carrito', msg: prod.nombre });
    setTimeout(() => setToast(null), 1800);
  };

  return (
    <main>
      {/* --- HERO --- */}
      <section className="hero">
        <div className="hero-overlay d-flex align-items-center justify-content-center text-center">
          <div className="container text-white">
            <h2 className="display-4 fw-bold">Bienvenidos a la botillería 🍻</h2>
            <p className="lead">¡Ofertas exclusivas y delivery rápido a tu puerta!</p>
            <a href="#productos-titulo" className="btn btn-warning btn-lg">Ver productos</a>
          </div>
        </div>
        <div className="hard-sep" aria-hidden="true"></div>
      </section>

      {/* --- CATEGORÍAS --- */}
      <section className="container my-5">
        <h2 className="sr-only">Categorías</h2>
        <div id="filtrosCategorias" className="d-flex justify-content-center flex-wrap gap-2">
          <button 
            className={`btn ${filtroActivo === 'todos' ? 'btn-warning' : 'btn-outline-secondary'}`} 
            onClick={() => setFiltroActivo('todos')}>Todos</button>
          <button 
            className={`btn ${filtroActivo === 'cerveza' ? 'btn-warning' : 'btn-outline-secondary'}`} 
            onClick={() => setFiltroActivo('cerveza')}>Cervezas</button>
          <button 
            className={`btn ${filtroActivo === 'whisky' ? 'btn-warning' : 'btn-outline-secondary'}`} 
            onClick={() => setFiltroActivo('whisky')}>Whisky</button>
          <button 
            className={`btn ${filtroActivo === 'vodka' ? 'btn-warning' : 'btn-outline-secondary'}`} 
            onClick={() => setFiltroActivo('vodka')}>Vodka</button>
          <button 
            className={`btn ${filtroActivo === 'ron' ? 'btn-warning' : 'btn-outline-secondary'}`} 
            onClick={() => setFiltroActivo('ron')}>Ron</button>
          <button 
            className={`btn ${filtroActivo === 'tequila' ? 'btn-warning' : 'btn-outline-secondary'}`} 
            onClick={() => setFiltroActivo('tequila')}>Tequila</button>
          <button 
            className={`btn ${filtroActivo === 'vino' ? 'btn-warning' : 'btn-outline-secondary'}`} 
            onClick={() => setFiltroActivo('vino')}>Vinos</button>
          <button 
            className={`btn ${filtroActivo === 'energetico' ? 'btn-warning' : 'btn-outline-secondary'}`} 
            onClick={() => setFiltroActivo('energetico')}>Energéticos</button>
        </div>
      </section>

      {/* --- PRODUCTOS --- */}
      <section className="container">
        <div className="section-title-wrap">
          <h2 id="productos-titulo" className="section-title">Copetes destacados</h2>
        </div>

        <div className="row g-4" id="gridProductos">
          {loading && (
            Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
          )}

          {!loading && productosFiltrados.length === 0 && (
            <p className="text-center col-12">No se encontraron productos en esta categoría o no hay conexión con el servidor.</p>
          )}

          {!loading && productosFiltrados.map(prod => {
            const sinStock = prod.stock <= 0;
            const pocoStock = prod.stock > 0 && prod.stock < 5;

            return (
              <div className="col-lg-3 col-md-4 col-sm-6" key={prod.id}>
                
                <div className={`card h-100 shadow-sm position-relative ${sinStock ? 'border-danger' : ''}`}>
                  
                  <span
                    className={`badge ${
                      sinStock 
                        ? 'bg-danger' 
                        : (String(prod.categoria).toLowerCase() === 'cerveza' ? 'bg-warning text-dark' : 'bg-success')
                    } position-absolute top-0 start-0 ms-2 mt-2 rounded-3 shadow-sm px-3 py-1`}
                  >
                    {sinStock ? 'AGOTADO' : (String(prod.categoria).toLowerCase() === 'cerveza' ? '2x1' : 'Destacado')}
                  </span>

                  <div className="img-wrap" style={{ opacity: sinStock ? 0.5 : 1 }}>
                    <img 
                      src={`/${prod.imagenUrl}`} 
                      className="card-img-top" 
                      alt={prod.nombre} 
                      onError={(e) => { e.target.src = '/imgs/placeholder.jpg'; }} 
                      style={{height: '200px', objectFit: 'contain', padding: '15px'}}
                    />
                  </div>
                  
                  <div className="card-body d-flex flex-column">
                    <h3 className="card-title h5">{prod.nombre}</h3>
                    <p className="card-text small text-muted flex-grow-1">{prod.descripcion}</p>
                    
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="h4 text-warning fw-bold mb-0">${prod.precio.toLocaleString()}</span>
                        <small className={`fw-bold ${sinStock ? 'text-danger' : pocoStock ? 'text-warning' : 'text-success'}`}>
                            {sinStock ? 'Sin stock' : `${prod.stock} unid.`}
                        </small>
                    </div>

                    <button 
                      className={`btn ${sinStock ? 'btn-secondary' : 'btn-warning'} mt-auto`}
                      onClick={() => addToCartWithToast(prod)}
                      disabled={sinStock} 
                    >
                      {sinStock ? 'Agotado 🚫' : 'Pedir ahora'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- PROMOCIONES --- */}
      <section className="container my-5">
        <div className="promo-banner text-center">
          <h2 className="promo-title">🔥 Promoción de la semana 🔥</h2>
          <p className="promo-subtitle">2x1 en cervezas Corona todos los viernes de 18:00 a 21:00 🍺</p>
        </div>
      </section>

      {/* --- RESEÑAS --- */}
      <section className="container my-5">
        <h2 className="text-center mb-4">Lo que dicen nuestros clientes</h2>
        <div className="row g-4">
          <div className="col-lg col-md-6">
            <div className="card h-100">
              <div className="card-body text-center">
                <p className="fs-3 mb-1">⭐⭐⭐⭐⭐</p>
                <blockquote className="blockquote mb-0">
                  <p>"Soy adicto a comprar ron a las 3 am! Me encanta jiji."</p>
                  <footer className="blockquote-footer"><cite>- Benjamin Ramirez.</cite></footer>
                </blockquote>
              </div>
            </div>
          </div>
          <div className="col-lg col-md-6">
            <div className="card h-100">
              <div className="card-body text-center">
                <p className="fs-3 mb-1">⭐⭐⭐⭐⭐</p>
                <blockquote className="blockquote mb-0">
                  <p>"Me gusta el pisco que venden aqui, me quedan de pana las piscolas!."</p>
                  <footer className="blockquote-footer"><cite>- Jose Fluck.</cite></footer>
                </blockquote>
              </div>
            </div>
          </div>
          <div className="col-lg col-md-6">
            <div className="card h-100">
              <div className="card-body text-center">
                <p className="fs-3 mb-1">⭐⭐⭐⭐⭐</p>
                <blockquote className="blockquote mb-0">
                  <p>"Siempre compro aqui, mucha variedad y entregan rapido, viva el copete!"</p>
                  <footer className="blockquote-footer"><cite>- Martin Gauna.</cite></footer>
                </blockquote>
              </div>
            </div>
          </div>
          <div className="col-lg col-md-6">
            <div className="card h-100">
              <div className="card-body text-center">
                <p className="fs-3 mb-1">⭐⭐⭐⭐⭐</p>
                <blockquote className="blockquote mb-0">
                  <p>"Lo bueno es que tienen beefeater de mora, aguante los cabros!!"</p>
                  <footer className="blockquote-footer"><cite>- Benjamin Stagnaro.</cite></footer>
                </blockquote>
              </div>
            </div>
          </div>
          <div className="col-lg col-md-6">
            <div className="card h-100">
              <div className="card-body text-center">
                <p className="fs-3 mb-1">⭐⭐⭐⭐⭐</p>
                <blockquote className="blockquote mb-0">
                  <p>"Gracias por tener las chelas baratas, hice el medio asado."</p>
                  <footer className="blockquote-footer"><cite>- Bastian Garrido.</cite></footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- VIDEO --- */}
      <section className="container my-5">
        <h2 id="video-titulo" className="text-center mb-4">Cerveza Corona: "La vida más fina"</h2>
        <p className="text-center">Disfruta de la campaña oficial de una de las cervezas más populares del mundo.</p>
        
        <div className="ratio ratio-16x9 shadow rounded">
          <iframe
            src="https://www.youtube.com/embed/C0H0zippfBQ"
            title="Comercial de Cerveza Corona"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </section>

      {/* --- TOAST --- */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
        {toast && (
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header bg-warning">
              <strong className="me-auto">🍺 {toast.title}</strong>
              <button type="button" className="btn-close" onClick={() => setToast(null)}></button>
            </div>
            <div className="toast-body">
              {toast.msg}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default HomePage;