import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  const [productos, setProductos] = useState([]);
  const { user } = useAuth(); // Obtenemos al usuario y su rol
  const navigate = useNavigate();

  useEffect(() => {
    // 🔒 PROTECCIÓN DE RUTA
    // Si no hay usuario o el rol no es ADMIN, lo mandamos al home
    if (!user || user.role !== 'ADMIN') {
      console.warn("Intento de acceso no autorizado a Admin");
      navigate('/'); 
      return;
    }

    // Usar la variable de entorno para la URL
    const API_URL = import.meta.env.VITE_API_URL;

    // Cargar productos desde el backend
    fetch(`${API_URL}/api/productos`)
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error("Error cargando inventario:", err));
  }, [user, navigate]);

  // Función para eliminar (Visual por ahora, para conectar luego)
  const handleDelete = (id) => {
    if(window.confirm("¿Seguro que quieres eliminar este producto?")) {
        // Aquí iría el fetch DELETE...
        // const API_URL = import.meta.env.VITE_API_URL;
        // fetch(`${API_URL}/api/productos/${id}`, { method: 'DELETE' })
        alert("Función de eliminar pendiente de conectar");
    }
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Panel de Administración 🛠️</h1>
        <div className="text-end">
            <p className="mb-0 text-muted">Hola, {user?.nombre}</p>
            <span className="badge bg-danger">MODO ADMINISTRADOR</span>
        </div>
      </div>

      <div className="card shadow">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Inventario de Productos</h4>
          <button className="btn btn-success btn-sm">+ Agregar Nuevo</button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Imagen</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map(prod => (
                  <tr key={prod.id}>
                    <td>#{prod.id}</td>
                    <td>
                      <img 
                        src={`/${prod.imagenUrl}`} 
                        alt="prod" 
                        style={{width: '50px', height: '50px', objectFit: 'contain'}} 
                        className="border rounded bg-white"
                        onError={(e) => { e.target.src = '/imgs/placeholder.jpg'; }}
                      />
                    </td>
                    <td className="fw-bold">{prod.nombre}</td>
                    <td>
                      <span className="badge bg-secondary">{prod.categoria}</span>
                    </td>
                    <td>${prod.precio.toLocaleString()}</td>
                    <td>
                      {/* Semáforo de Stock: Rojo < 10, Amarillo < 30, Verde el resto */}
                      <span className={`badge ${prod.stock < 10 ? 'bg-danger' : prod.stock < 30 ? 'bg-warning text-dark' : 'bg-success'}`}>
                        {prod.stock} un.
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-outline-primary btn-sm me-2" title="Editar">✏️</button>
                      <button 
                        className="btn btn-outline-danger btn-sm" 
                        title="Eliminar"
                        onClick={() => handleDelete(prod.id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;