"use client"; // Obligatorio en Next.js para usar formularios y localStorage

import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const iniciarSesion = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página recargue al dar enter

    const respuesta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const datos = await respuesta.json();

    if (datos.exito) {
      localStorage.setItem('tokenArtBlock', datos.token);
      alert('¡Bienvenido a ArtBlock!');
      // Aquí después lo enviaremos a su perfil o al feed
    } else {
      alert(datos.mensaje); // "Credenciales inválidas"
    }
  };

  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Iniciar Sesión</h1>
      <form onSubmit={iniciarSesion} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" 
          placeholder="Tu correo" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Tu contraseña" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}