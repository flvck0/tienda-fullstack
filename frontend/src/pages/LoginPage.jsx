import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- AÑADIDO: para redirigir

// Tu lógica (sin cambios)
const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function LoginPage() {
  // Tu lógica (sin cambios)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const navigate = useNavigate(); // <-- AÑADIDO

  // Tu lógica (solo 1 línea añadida)
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    let ok = true;

    if (!validarEmail(email)) { newErrors.email = "Correo no válido."; ok = false; }
    if (password.length < 8) { newErrors.password = "La contraseña debe tener al menos 8 caracteres."; ok = false; }

    setErrors(newErrors);

    if (ok) {
      console.log("¡Formulario Login OK!", { email, password });
      fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      .then(res => res.json())
      .then(data => { 
        alert(data.message);
        navigate('/'); // <-- AÑADIDO: Redirige al inicio
      })
      .catch(() => alert("Error al conectar con el servidor."));
    }
  };

  // --- TU JSX (Refactorizado con Bootstrap) ---
  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        {/* Usamos una columna más estrecha para el login */}
        <div className="col-lg-5 col-md-7">
          {/* Añadimos un Card de Bootstrap para enmarcar */}
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <h2 id="login-titulo" className="text-center h3 mb-4">Ingresar al sitio</h2>

              <form id="formLogin" noValidate onSubmit={handleSubmit}>
                
                {/* Estructura de formulario Bootstrap para "Email" */}
                <div className="mb-3">
                  <label htmlFor="loginEmail" className="form-label">Correo electrónico</label>
                  <input 
                    id="loginEmail" 
                    type="email" 
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`} // Clase dinámica
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                  {/* Mensaje de error de Bootstrap */}
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                {/* Estructura de formulario Bootstrap para "Password" */}
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

                {/* Botón de Bootstrap (w-100 = full width) */}
                <button className="btn btn-warning w-100 btn-lg mt-3" type="submit">Ingresar</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;