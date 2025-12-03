import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function RegisterPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [pais, setPais] = useState('');
  const [terminos, setTerminos] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    let ok = true;

    if (nombre.length < 3) { newErrors.nombre = "Ingresa tu nombre (mínimo 3 caracteres)."; ok = false; }
    if (!validarEmail(email)) { newErrors.email = "Ingresa un correo válido."; ok = false; }
    if (password.length < 8) { newErrors.password = "La contraseña debe tener al menos 8 caracteres."; ok = false; }
    if (confirmar !== password) { newErrors.confirmar = "Las contraseñas no coinciden."; ok = false; }
    if (!pais) { newErrors.pais = "Ingresa tu dirección."; ok = false; }
    if (!terminos) { newErrors.terminos = "Debes aceptar los términos y condiciones."; ok = false; }

    setErrors(newErrors);
    if (!ok) return;

    // CONEXIÓN AL BACKEND SPRING BOOT
    // Usamos la variable de entorno
    const API_URL = import.meta.env.VITE_API_URL;

    fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        email,
        password,
        direccion: pais, // Mapeamos 'pais' del form a 'direccion' del backend
        rol: "USER"      // Forzamos el rol USER por seguridad
      })
    })
      .then(async (res) => {
        if (!res.ok) {
          // Intentamos leer el mensaje de error del backend (ej: "Email ya existe")
          const errorText = await res.text();
          throw new Error(errorText || 'Error en el registro');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Registro exitoso:', data);
        alert("¡Cuenta creada exitosamente! Ahora puedes ingresar.");
        navigate('/login');
      })
      .catch((err) => {
        console.error(err);
        alert("Error: " + err.message);
      });
  };

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <h2 id="registro-titulo" className="text-center h3 mb-4">Crear cuenta</h2>

              <form id="formRegistro" noValidate onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre completo</label>
                  <input
                    id="nombre"
                    type="text"
                    className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                  {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Correo electrónico</label>
                  <input
                    id="email"
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    id="password"
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmar" className="form-label">Confirmar contraseña</label>
                  <input
                    id="confirmar"
                    type="password"
                    className={`form-control ${errors.confirmar ? 'is-invalid' : ''}`}
                    value={confirmar}
                    onChange={(e) => setConfirmar(e.target.value)}
                  />
                  {errors.confirmar && <div className="invalid-feedback">{errors.confirmar}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="pais" className="form-label">Dirección</label>
                  <input
                    id="pais"
                    type="text"
                    className={`form-control ${errors.pais ? 'is-invalid' : ''}`}
                    value={pais}
                    onChange={(e) => setPais(e.target.value)}
                  />
                  {errors.pais && <div className="invalid-feedback">{errors.pais}</div>}
                </div>

                <div className="form-check mb-3">
                  <input
                    id="terminos"
                    type="checkbox"
                    className={`form-check-input ${errors.terminos ? 'is-invalid' : ''}`}
                    checked={terminos}
                    onChange={(e) => setTerminos(e.target.checked)}
                  />
                  <label htmlFor="terminos" className="form-check-label">
                    Acepto los términos y condiciones
                  </label>
                  {errors.terminos && <div className="invalid-feedback d-block">{errors.terminos}</div>}
                </div>

                <button className="btn btn-warning w-100 btn-lg" type="submit">
                  Registrarme
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default RegisterPage;