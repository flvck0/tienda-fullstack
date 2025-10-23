import React, { useState, useEffect } from 'react';
// Asegúrate de que esta ruta sea correcta (debe subir un nivel)
import { useCart } from '../context/CartContext'; 

// --- Componente SKELETON (Refactorizado con Bootstrap) ---
// Lo definimos aquí mismo para mantener tu estructura
const ProductSkeleton = () => (
  <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
    <div className="card h-100" aria-hidden="true">
      {/* Usamos placeholders de Bootstrap */}
      <div className="card-body placeholder-glow">
        <span className="placeholder col-12" style={{height: '150px'}}></span>
        <span className="placeholder col-8 mt-3"></span>
        <span className="placeholder col-6"></span>
        <span className="placeholder col-4"></span>
      </div>
    </div>
  </div>
);
// --------------------------------------------------

function HomePage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroActivo, setFiltroActivo] = useState('todos');
  const [toast, setToast] = useState(null); // Tu lógica de toast
  const { agregarAlCarrito } = useCart();

  useEffect(() => {
    fetch('http://localhost:3001/api/productos')
      .then(res => res.json())
      .then(data => {
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
    return prod.categoria === filtroActivo;
  });

  // --- REFACTORIZADO CON BADGES DE BOOTSTRAP ---
  // Tu lógica ahora devuelve clases de Bootstrap
  const getBadgeClass = (cat) => {
    switch (String(cat).toLowerCase()) {
      case 'cerveza': return 'bg-warning text-dark';
      case 'vino': return 'bg-danger';
      case 'whisky': return 'bg-secondary';
      case 'vodka': return 'bg-info text-dark';
      case 'ron': return 'bg-dark';
      case 'tequila': return 'bg-success';
      case 'energetico': return 'bg-primary';
      default: return 'bg-light text-dark';
    }
  };

  // Tu lógica de toast (se mantiene intacta)
  const addToCartWithToast = (prod) => {
    agregarAlCarrito(prod);
    setToast({ title: 'Agregado al carrito', msg: prod.nombre });
    setTimeout(() => setToast(null), 1800);
  };

  return (
    // Ya no usamos <main class="contenedor">, Bootstrap lo maneja
    <main>
      {/* --- HERO (Refactorizado con Bootstrap) --- */}
      {/* Mantenemos tu clase 'hero' para la imagen de fondo de tu styles.css */}
      <section className="hero">
        <div className="hero-overlay d-flex align-items-center justify-content-center text-center">
          <div className="container text-white">
            <h2 className="display-4 fw-bold">Bienvenidos a la botillería 🍻</h2>
            <p className="lead">¡Ofertas exclusivas y delivery rápido a tu puerta!</p>
            {/* Usamos el botón 'warning' de Bootstrap */}
            <a href="#productos-titulo" className="btn btn-warning btn-lg">Ver productos</a>
          </div>
        </div>
        {/* Tu separador (se mantiene intacto) */}
        <div className="hard-sep" aria-hidden="true"></div>
      </section>

      {/* --- CATEGORÍAS (Refactorizado con Bootstrap) --- */}
      <section className="container my-5">
        <h2 className="sr-only">Categorías</h2>
        {/* Usamos 'flex-wrap' de Bootstrap para que sea responsivo */}
        <div id="filtrosCategorias" className="d-flex justify-content-center flex-wrap gap-2">
          {/* Tu lógica de botones, pero con clases 'btn' de Bootstrap */}
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

      {/* --- PRODUCTOS (Refactorizado con Grilla y Cards) --- */}
      <section className="container">
        <h2 id="productos-titulo" className="text-center mb-4">Copetes destacados</h2>

        {/* Usamos la grilla de Bootstrap 'row' y 'g-4' (gap) */}
        <div className="row g-4" id="gridProductos">
          {loading && (
            // Usamos la grilla para los skeletons
            Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
          )}

          {!loading && productosFiltrados.length === 0 && (
            <p className="text-center col-12">No se encontraron productos en esta categoría.</p>
          )}

          {!loading && productosFiltrados.map(prod => (
            // Sistema de columnas responsivo de Bootstrap
            <div className="col-lg-3 col-md-4 col-sm-6" key={prod.id}>
              
              {/* Usamos el componente Card de Bootstrap */}
              <div className="card h-100 shadow-sm position-relative">
                
                {/* Badge de Bootstrap (usando tu lógica) */}
                <span className={`badge ${getBadgeClass(prod.categoria)} position-absolute top-0 end-0 m-2`}>
                  {String(prod.categoria).toLowerCase() === 'cerveza' ? '2x1' : 'Destacado'}
                </span>

                {/* Mantenemos tu clase 'img-wrap' para el estilo de la imagen */}
                <div className="img-wrap">
                  <img 
                    src={prod.img} 
                    className="card-img-top" 
                    alt={prod.alt || prod.nombre} 
                    style={{height: '200px', objectFit: 'contain', padding: '15px'}}
                  />
                </div>
                
                {/* d-flex y flex-column nos ayudan a alinear el botón al fondo */}
                <div className="card-body d-flex flex-column">
                  <h3 className="card-title h5">{prod.nombre}</h3>
                  <p className="card-text small flex-grow-1">{prod.descripcion}</p>
                  <p className="h4 text-warning fw-bold my-2">${prod.precio.toLocaleString()}</p>
                  <button 
                    className="btn btn-warning mt-auto" // mt-auto alinea el botón al fondo
                    onClick={() => addToCartWithToast(prod)}
                  >
                    Pedir ahora
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- PROMOCIONES (Refactorizado) --- */}
      <section className="container-fluid bg-warning-subtle text-center p-5 my-5">
        <h2 className="fw-bold">🔥 Promoción de la semana 🔥</h2>
        <p className="fs-5">2x1 en cervezas Corona todos los viernes de 18:00 a 21:00 🍺</p>
      </section>

      {/* --- RESEÑAS (Refactorizado con Grilla y Cards) --- */}
      <section className="container my-5">
        <h2 className="text-center mb-4">Lo que dicen nuestros clientes</h2>
        <div className="row g-4">
          
          {/* Mapeamos tus reseñas en cards (esto es mucho más limpio que solo <blockquote>) */}
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

      {/* --- VIDEO (Refactorizado con .ratio de Bootstrap) --- */}
      <section className="container my-5">
        <h2 id="video-titulo" className="text-center mb-4">Cerveza Corona: "La vida más fina"</h2>
        <p className="text-center">Disfruta de la campaña oficial de una de las cervezas más populares del mundo.</p>
        
        {/* .ratio y .ratio-16x9 hacen el video responsivo */}
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

      {/* --- TOAST (Refactorizado con Bootstrap) --- */}
      {/* Esto posiciona el toast en la esquina inferior derecha */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
        {toast && (
          // 'toast' y 'show' son las clases de Bootstrap para mostrarlo
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header bg-warning">
              <strong className="me-auto">🍺 {toast.title}</strong>
              <button typeD="button" className="btn-close" onClick={() => setToast(null)}></button>
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