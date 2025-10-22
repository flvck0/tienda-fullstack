import React, { useState } from 'react';

const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

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
      .then(data => { alert(data.message); })
      .catch(() => alert("Error al conectar con el servidor."));
    }
  };

  return (
    <main className="contenedor">
      <section className="form-section" aria-labelledby="login-titulo">
        <h2 id="login-titulo">Ingresar al sitio</h2>

        <form id="formLogin" noValidate onSubmit={handleSubmit}>
          <div className="campo">
            <label htmlFor="loginEmail">Correo electrónico</label>
            <input id="loginEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            {errors.email && <small className="error">{errors.email}</small>}
          </div>

          <div className="campo">
            <label htmlFor="loginPassword">Contraseña</label>
            <input id="loginPassword" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {errors.password && <small className="error">{errors.password}</small>}
          </div>

          <button className="btn full" type="submit">Ingresar</button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
