import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- AÑADIDO: para redirigir después del registro

// Tu lógica (sin cambios)
const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function RegisterPage() {
  // Tu lógica (sin cambios)
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [pais, setPais] = useState('');
  const [terminos, setTerminos] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate(); // <-- AÑADIDO

  // Tu lógica (solo 1 línea añadida)
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    let ok = true;

    if (nombre.length < 3) { newErrors.nombre = "Ingresa tu nombre (mínimo 3 caracteres)."; ok = false; }
    if (!validarEmail(email)) { newErrors.email = "Ingresa un correo válido (ej: nombre@dominio.com)."; ok = false; }
    if (password.length < 8) { newErrors.password = "La contraseña debe tener al menos 8 caracteres."; ok = false; }
    if (confirmar !== password) { newErrors.confirmar = "Las contraseñas no coinciden."; ok = false; }
    if (!pais) { newErrors.pais = "Selecciona o escribe tu país."; ok = false; }
    if (!terminos) { newErrors.terminos = "Debes aceptar los términos y condiciones."; ok = false; }

    setErrors(newErrors);

    if (ok) {
      console.log("¡Formulario OK!", { nombre, email, password, pais });
      fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password, pais })
      })
      .then(res => res.json())
      .then(data => { 
        alert(data.message);
        navigate('/login'); // <-- AÑADIDO: Redirige al login
      })
      .catch(() => alert("Error al conectar con el servidor."));
    }
  };

  // --- TU JSX (Refactorizado con Bootstrap) ---
  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          {/* Añadimos un Card de Bootstrap para enmarcar el formulario */}
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <h2 id="registro-titulo" className="text-center h3 mb-4">Crear cuenta</h2>

              <form id="formRegistro" noValidate onSubmit={handleSubmit}>
                
                {/* Estructura de formulario Bootstrap para "Nombre" */}
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre completo</label>
                  <input 
                    id="nombre" 
                    type="text" 
                    className={`form-control ${errors.nombre ? 'is-invalid' : ''}`} // Clase dinámica
                    value={nombre} 
                    onChange={(e) => setNombre(e.target.value)} 
                  />
                  {/* Mensaje de error de Bootstrap */}
                  {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                </div>

                {/* Estructura de formulario Bootstrap para "Email" */}
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

                {/* Estructura de formulario Bootstrap para "Password" */}
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

                {/* Estructura de formulario Bootstrap para "Confirmar" */}
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

                {/* Estructura de formulario Bootstrap para "País" */}
                <div className="mb-3">
                  <label htmlFor="pais" className="form-label">País</label>
                  <input 
                    id="pais" 
                    list="paises" 
                    className={`form-control ${errors.pais ? 'is-invalid' : ''}`} 
                    value={pais} 
                    onChange={(e) => setPais(e.target.value)} 
                  />
                  <datalist id="paises">
                    <option value="Chile"></option>
                    <option value="Argentina"></option>
                    <option value="Perú"></option>
                  </datalist>
                  {errors.pais && <div className="invalid-feedback">{errors.pais}</div>}
                </div>

                {/* Estructura de formulario Bootstrap para "Términos" */}
                <div className="form-check mb-3">
                  <input 
                    id="terminos" 
                    type="checkbox" 
                    className={`form-check-input ${errors.terminos ? 'is-invalid' : ''}`} 
                    checked={terminos} 
                    onChange={(e) => setTerminos(e.target.checked)} 
                  />
                  <label htmlFor="terminos" className="form-check-label">Acepto los términos y condiciones</label>
                  {errors.terminos && <div className="invalid-feedback d-block">{errors.terminos}</div>}
                </div>

                {/* Botón de Bootstrap (w-100 = full width) */}
                <button className="btn btn-warning w-100 btn-lg" type="submit">Registrarme</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default RegisterPage;