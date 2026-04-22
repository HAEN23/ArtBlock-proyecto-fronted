'use client';

import React, { useState } from 'react';
import styles from './Auth.module.css';

export default function AuthView() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Estados para los campos del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Solo para registro

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        // ==========================================
        // LÓGICA DE INICIO DE SESIÓN
        // ==========================================
        const respuesta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        const datos = await respuesta.json();

        if (datos.exito) {
          // 1. Guardamos el token y el correo en el navegador
          localStorage.setItem('tokenArtBlock', datos.token);
          localStorage.setItem('emailArtBlock', email);
          
          // 2. Redirigimos al dashboard automáticamente
          window.location.href = '/dashboard';
        } else {
          alert('Error: ' + datos.mensaje);
        }

      } else {
        // ==========================================
        // LÓGICA DE REGISTRO CON AUTO-LOGIN
        // ==========================================
        const respuesta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/registro`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre_usuario: username, email, password })
        });
        
        const datos = await respuesta.json();

        if (datos.exito) {
          // ¡Truco!: Iniciamos sesión por el usuario inmediatamente después de registrarse
          const resLogin = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const dataLogin = await resLogin.json();

          if (dataLogin.exito) {
            // 1. Guardamos todo en la memoria del navegador
            localStorage.setItem('tokenArtBlock', dataLogin.token);
            localStorage.setItem('nombreArtBlock', username); 
            localStorage.setItem('emailArtBlock', email);
            
            // 2. ¡Redirigimos al dashboard ya logueados!
            window.location.href = '/dashboard';
          } else {
            // Por si acaso el auto-login falla
            alert('Cuenta creada exitosamente. Por favor inicia sesión.');
            setPassword('');
            setIsLogin(true);
          }
        } else {
          alert('Error: ' + datos.mensaje);
        }
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('Error al conectar con el servidor. Verifica que tu backend esté encendido.');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1 className={styles.logo}>ArtBlock</h1>
        <nav className={styles.navLinks}>
          <a href="./feed">Gallery</a>
        </nav>
        <div className={styles.headerIcons}>
          <div className={styles.iconCircle}></div>
          <div className={styles.iconCircle}></div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.authCard}>
          <div className={styles.cardHeader}>
            <h2>ACCESA A ARTBLOCK</h2>
            <p>Enter the private viewing room.</p>
          </div>

          <div className={styles.toggleContainer}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${isLogin ? styles.active : ''}`}
              onClick={() => setIsLogin(true)}
            >
              INICIAR SESIÓN
            </button>
            <button
              type="button"
              className={`${styles.toggleBtn} ${!isLogin ? styles.active : ''}`}
              onClick={() => setIsLogin(false)}
            >
              REGISTRARSE
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {!isLogin && (
              <div className={styles.inputGroup}>
                <label htmlFor="username">NOMBRE DE ARTISTA</label>
                <input
                  type="text"
                  id="username"
                  placeholder="Tu nombre o seudónimo"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="email">CORREO ELECTRÓNICO</label>
              <input
                type="email"
                id="email"
                placeholder="archive@thevault.art"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">CONTRASEÑA</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Alternar visibilidad de contraseña"
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn}>
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </button>
          </form>

          {isLogin && (
            <a href="#" className={styles.forgotPassword}>
              ¿OLVIDASTE TU CONTRASEÑA?
            </a>
          )}

          <div className={styles.securityBox}>
            <div className={styles.securityHeader}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <h4>PROTECCIÓN DE DATOS E IA</h4>
            </div>
            <p>
              Toda la obra alojada en The Vault está protegida contra el raspado de datos para entrenamiento de IA. Tus datos personales y activos creativos están cifrados bajo protocolos de seguridad bancaria.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}