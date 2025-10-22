import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext'; 

function HomePage() {
  const [productos, setProductos] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [filtroActivo, setFiltroActivo] = useState('todos'); 
  
  const { agregarAlCarrito } = useCart();

  useEffect(() => {
    // Pedimos los productos a nuestra API de Node
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
    if (filtroActivo === 'todos') {
      return true; 
    }
    return prod.categoria === filtroActivo; 
  });

  return (
    <main className="contenedor">
      {/* --- HERO --- */}
      <section className="hero">
        <div className="hero-overlay">
          <h2>Bienvenidos a la botillería más prendida 🍻</h2>
          <p>¡Ofertas exclusivas y delivery rápido a tu puerta!</p>
          <a href="#productos-titulo" className="btn">Ver productos</a>
        </div>
      </section>

      {/* --- CATEGORÍAS (Conectadas al estado) --- */}
      <section className="categorias">
        <h2 className="sr-only">Categorías</h2>
        <div className="chips" id="filtrosCategorias">
            
            {/* className es dinámico y onClick actualiza el estado */}
            <button 
              className={filtroActivo === 'todos' ? 'chip active' : 'chip'}
              onClick={() => setFiltroActivo('todos')}
            >
              Todos
            </button>
            <button 
              className={filtroActivo === 'cerveza' ? 'chip active' : 'chip'}
              onClick={() => setFiltroActivo('cerveza')}
            >
              Cervezas
            </button>
            <button 
              className={filtroActivo === 'whisky' ? 'chip active' : 'chip'}
              onClick={() => setFiltroActivo('whisky')}
            >
              Whisky
            </button>
            <button 
              className={filtroActivo === 'vodka' ? 'chip active' : 'chip'}
              onClick={() => setFiltroActivo('vodka')}
            >
              Vodka
            </button>
            <button 
              className={filtroActivo === 'ron' ? 'chip active' : 'chip'}
              onClick={() => setFiltroActivo('ron')}
            >
              Ron
            </button>
            <button 
              className={filtroActivo === 'tequila' ? 'chip active' : 'chip'}
              onClick={() => setFiltroActivo('tequila')}
            >
              Tequila
            </button>
            <button 
              className={filtroActivo === 'vino' ? 'chip active' : 'chip'}
              onClick={() => setFiltroActivo('vino')}
            >
              Vinos
            </button>
            <button 
              className={filtroActivo === 'energetico' ? 'chip active' : 'chip'}
              onClick={() => setFiltroActivo('energetico')}
            >
              Energéticos
            </button>
        </div>
      </section>

      {/* --- PRODUCTOS --- */}
      <section aria-labelledby="productos-titulo" className="productos">
        <h2 id="productos-titulo">Copetes destacados</h2>
        <div className="grid-productos" id="gridProductos">
          {loading && <p>Cargando copetes...</p>}
          
          {/* 'productosFiltrados' */}
          {!loading && productosFiltrados.map(prod => (
            <article className="producto-card" data-cat={prod.categoria} key={prod.id}>
              <img src={prod.img} alt={prod.alt} />
              <h3>{prod.nombre}</h3>
              <p className="precio">${prod.precio.toLocaleString()}</p>
              <p>{prod.descripcion}</p>
              <button
                className="btn"
                onClick={() => agregarAlCarrito(prod)}
              >
                Pedir ahora
              </button>
            </article>
          ))}

          {/* Mensaje si el filtro no encuentra nada */}
          {!loading && productosFiltrados.length === 0 && (
            <p>No se encontraron productos en esta categoría.</p>
          )}
        </div>
      </section>

      {/* --- PROMOCIONES --- */}
      <section className="promo">
        <h2>🔥 Promoción de la semana 🔥</h2>
        <p>2x1 en cervezas Corona todos los viernes de 18:00 a 21:00 🍺</p>
      </section>

      {/* --- RESEÑAS --- */}
      <section className="resenas">
        <h2>Lo que dicen nuestros clientes</h2>
        <div className="grid-resenas">
          <blockquote>
            ⭐⭐⭐⭐⭐
            <p>"El mejor lugar para comprar en la noche, siempre buena atención."</p>
            <cite>- Juan P.</cite>
          </blockquote>
          <blockquote>
            ⭐⭐⭐⭐⭐
            <p>"Me salvaron en un carrete, el delivery llegó rapidísimo."</p>
            <cite>- Camila G.</cite>
          </blockquote>
          <blockquote>
            ⭐⭐⭐⭐⭐
            <p>"Gran variedad y precios justos, recomendado 100%."</p>
            <cite>- Felipe R.</cite>
          </blockquote>
        </div>
      </section>

      {/* --- VIDEO --- */}
      <section aria-labelledby="video-titulo">
        <h2 id="video-titulo">Cerveza Corona: "La vida más fina"</h2>
        <p>Disfruta de la campaña oficial de una de las cervezas más populares del mundo.</p>
        <div className="video-responsivo">
          <iframe
            src="https://www.youtube.com/embed/C0H0zippfBQ"
            title="Comercial de Cerveza Corona"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen>
          </iframe>
        </div>
      </section>
    </main>
  );
}

export default HomePage;