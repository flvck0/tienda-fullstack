import React, { useState } from 'react';

const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function RegisterPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [pais, setPais] = useState('');
  const [terminos, setTerminos] = useState(false);
  const [errors, setErrors] = useState({});

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
      .then(data => { alert(data.message); })
      .catch(() => alert("Error al conectar con el servidor."));
    }
  };

  return (
    <main className="contenedor">
      <section className="form-section" aria-labelledby="registro-titulo">
        <h2 id="registro-titulo">Crear cuenta</h2>

        <form id="formRegistro" noValidate onSubmit={handleSubmit}>
          <div className="campo">
            <label htmlFor="nombre">Nombre completo</label>
            <input id="nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            {errors.nombre && <small className="error">{errors.nombre}</small>}
          </div>

          <div className="campo">
            <label htmlFor="email">Correo electrónico</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            {errors.email && <small className="error">{errors.email}</small>}
          </div>

          <div className="campo">
            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {errors.password && <small className="error">{errors.password}</small>}
          </div>

          <div className="campo">
            <label htmlFor="confirmar">Confirmar contraseña</label>
            <input id="confirmar" type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} />
            {errors.confirmar && <small className="error">{errors.confirmar}</small>}
          </div>

          <div className="campo">
            <label htmlFor="pais">País</label>
            <input id="pais" list="paises" value={pais} onChange={(e) => setPais(e.target.value)} />
            <datalist id="paises">
              <option value="Chile"></option>
              <option value="Argentina"></option>
              <option value="Perú"></option>
            </datalist>
            {errors.pais && <small className="error">{errors.pais}</small>}
          </div>

          <div className="campo checkbox">
            <input id="terminos" type="checkbox" checked={terminos} onChange={(e) => setTerminos(e.target.checked)} />
            <label htmlFor="terminos">Acepto los términos y condiciones</label>
            {errors.terminos && <small className="error" style={{display: 'block', marginLeft: '2rem'}}>{errors.terminos}</small>}
          </div>

          <button className="btn full" type="submit">Registrarme</button>
        </form>
      </section>
    </main>
  );
}

export default RegisterPage;
