import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

function HomePage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroActivo, setFiltroActivo] = useState('todos');

  // toast visual simple
  const [toast, setToast] = useState(null);

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

  // badge por categoría (visual)
  const getBadgeClass = (cat) => {
    switch (String(cat).toLowerCase()) {
      case 'cerveza': return 'badge cerveza';
      case 'vino': return 'badge vino';
      case 'whisky': return 'badge whisky';
      case 'vodka': return 'badge vodka';
      case 'ron': return 'badge ron';
      case 'tequila': return 'badge tequila';
      case 'energetico': return 'badge energetico';
      default: return 'badge';
    }
  };

  const addToCartWithToast = (prod) => {
    agregarAlCarrito(prod);
    setToast({ title: 'Agregado al carrito', msg: prod.nombre });
    setTimeout(() => setToast(null), 1800);
  };

  return (
    <main className="contenedor">
      {/* --- HERO (foto por CSS) --- */}
      <section className="hero">
        <div className="hero-overlay">
          <h2>Bienvenidos a la botillería más prendida 🍻</h2>
          <p>¡Ofertas exclusivas y delivery rápido a tu puerta!</p>
          <a href="#productos-titulo" className="btn">Ver productos</a>
        </div>
        <div className="hard-sep" aria-hidden="true"></div>
      </section>

      {/* --- CATEGORÍAS --- */}
      <section className="categorias">
        <h2 className="sr-only">Categorías</h2>
        <div className="chips" id="filtrosCategorias">
          <button className={filtroActivo === 'todos' ? 'chip active' : 'chip'} onClick={() => setFiltroActivo('todos')}>Todos</button>
          <button className={filtroActivo === 'cerveza' ? 'chip active' : 'chip'} onClick={() => setFiltroActivo('cerveza')}>Cervezas</button>
          <button className={filtroActivo === 'whisky' ? 'chip active' : 'chip'} onClick={() => setFiltroActivo('whisky')}>Whisky</button>
          <button className={filtroActivo === 'vodka' ? 'chip active' : 'chip'} onClick={() => setFiltroActivo('vodka')}>Vodka</button>
          <button className={filtroActivo === 'ron' ? 'chip active' : 'chip'} onClick={() => setFiltroActivo('ron')}>Ron</button>
          <button className={filtroActivo === 'tequila' ? 'chip active' : 'chip'} onClick={() => setFiltroActivo('tequila')}>Tequila</button>
          <button className={filtroActivo === 'vino' ? 'chip active' : 'chip'} onClick={() => setFiltroActivo('vino')}>Vinos</button>
          <button className={filtroActivo === 'energetico' ? 'chip active' : 'chip'} onClick={() => setFiltroActivo('energetico')}>Energéticos</button>
        </div>
      </section>

      {/* --- PRODUCTOS --- */}
      <section aria-labelledby="productos-titulo" className="productos">
        <h2 id="productos-titulo">Copetes destacados</h2>

        {/* Skeletons mientras carga */}
        {loading && (
          <div className="skel-grid">
            {Array.from({length: 8}).map((_,i) => (
              <div className="skel-card" key={i}>
                <div className="skel-img"></div>
                <div className="skel-line" style={{width:'80%'}}></div>
                <div className="skel-line" style={{width:'60%'}}></div>
                <div className="skel-line" style={{width:'40%'}}></div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <div className="grid-productos" id="gridProductos">
            {productosFiltrados.map(prod => (
              <article className="producto-card" data-cat={prod.categoria} key={prod.id}>
                <span className={getBadgeClass(prod.categoria)}>
                  {String(prod.categoria).toLowerCase() === 'cerveza' ? '2x1' : 'Destacado'}
                </span>

                <div className="img-wrap">
                  <img src={prod.img} alt={prod.alt || prod.nombre} />
                </div>

                <h3>{prod.nombre}</h3>
                <p className="precio">${prod.precio.toLocaleString()}</p>
                <p>{prod.descripcion}</p>
                <button className="btn" onClick={() => addToCartWithToast(prod)}>Pedir ahora</button>
              </article>
            ))}

            {!loading && productosFiltrados.length === 0 && (
              <p>No se encontraron productos en esta categoría.</p>
            )}
          </div>
        )}
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
          <blockquote>⭐⭐⭐⭐⭐
            <p>"Soy adicto a comprar ron a las 3 am! Me encanta jiji."</p>
            <cite>- Benjamin Ramirez.</cite>
          </blockquote>
          <blockquote>⭐⭐⭐⭐⭐
            <p>"Me gusta el pisco que venden aqui, me quedan de pana las piscolas!."</p>
            <cite>- Jose Fluck.</cite>
          </blockquote>
          <blockquote>⭐⭐⭐⭐⭐
            <p>"Siempre compro aqui, mucha variedad y entregan rapido, viva el copete!"</p>
            <cite>- Martin Gauna.</cite>
          </blockquote>
          <blockquote>⭐⭐⭐⭐⭐
            <p>"Lo bueno es que tienen beefeater de mora, aguante los cabros!!"</p>
            <cite>- Benjamin Stagnaro.</cite>
          </blockquote>
          <blockquote>⭐⭐⭐⭐⭐
            <p>"Gracias por tener las chelas baratas, hice el medio asado."</p>
            <cite>- Bastian Garrido.</cite>
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
            allowFullScreen
          />
        </div>
      </section>

      {/* Toast */}
      {toast && (
        <div className="toast ok" role="status" aria-live="polite">
          <div className="t-title">🍺 {toast.title}</div>
          <div>{toast.msg}</div>
        </div>
      )}
    </main>
  );
}

export default HomePage;
