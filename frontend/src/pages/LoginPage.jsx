import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Validación simple de email con Regex
const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    let ok = true;

    if (!validarEmail(email)) { newErrors.email = "Correo no válido."; ok = false; }
    if (password.length < 8) { newErrors.password = "Mínimo 8 caracteres."; ok = false; }

    setErrors(newErrors);
    if (!ok) return;

    // --- CONEXIÓN AL BACKEND ---
    // Usamos la variable de entorno
    const API_URL = import.meta.env.VITE_API_URL;

    fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Credenciales inválidas');
        return res.json();
      })
      .then((data) => {
        console.log("Datos recibidos del login:", data);
        
        // 1. Guardamos la sesión con TODOS los datos reales
        login({
          token: data.token,
          email: data.email,
          nombre: data.nombre,
          id: data.id,
          role: data.role // Aquí viene 'ADMIN' o 'USER'
        });

        alert("¡Bienvenido " + data.nombre + "!");

        // 2. REDIRECCIÓN INTELIGENTE 🚦
        if (data.role === 'ADMIN') {
            // Si es jefe, lo mandamos al panel de control
            navigate('/admin');
        } else {
            // Si es cliente, lo mandamos al home a comprar
            navigate('/');
        }
      })
      .catch((err) => {
        console.error('Error en login:', err);
        setErrors({ ...errors, general: "Correo o contraseña incorrectos." });
      });
  };

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-7">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <h2 id="login-titulo" className="text-center h3 mb-4">Ingresar al sitio</h2>
              
              {/* Alerta de error si falla el login */}
              {errors.general && (
                <div className="alert alert-danger text-center" role="alert">
                  {errors.general}
                </div>
              )}

              <form id="formLogin" noValidate onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="loginEmail" className="form-label">Correo electrónico</label>
                  <input
                    id="loginEmail"
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="loginPassword" className="form-label">Contraseña</label>
                  <input
                    id="loginPassword"
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <button className="btn btn-warning w-100 btn-lg mt-3" type="submit">
                  Ingresar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;