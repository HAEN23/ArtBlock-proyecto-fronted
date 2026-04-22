'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import styles from './Feed.module.css';

export default function FeedView() {
  const router = useRouter();
  
  // Estados de Sesión
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nombreArtista, setNombreArtista] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // ==========================================
  // ESTADOS DEL FEED Y PAGINACIÓN
  // ==========================================
  const [obrasPublicas, setObrasPublicas] = useState<any[]>([]);
  const [pagina, setPagina] = useState(1);
  const [hayMasObras, setHayMasObras] = useState(false);
  const [cargando, setCargando] = useState(true);

  // Verificamos sesión al inicio
  useEffect(() => {
    const token = localStorage.getItem('tokenArtBlock');
    const nombre = localStorage.getItem('nombreArtBlock');
    if (token) {
      setIsLoggedIn(true);
      if (nombre) setNombreArtista(nombre);
    }
    
    // Al entrar, cargamos la página 1 del Feed
    cargarObras(1, true);
  }, []);

  // Función para ir al backend por obras
  const cargarObras = async (numeroPagina: number, esPrimeraCarga = false) => {
    try {
      setCargando(true);
      const respuesta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/obras/publicas?pagina=${numeroPagina}&limite=6`);
      const datos = await respuesta.json();

      if (datos.exito) {
        if (esPrimeraCarga) {
          // Si es la primera vez, reemplazamos todo
          setObrasPublicas(datos.obras);
        } else {
          // Si dimos clic al botón, las pegamos al final de las que ya teníamos
          setObrasPublicas((prev) => [...prev, ...datos.obras]);
        }
        setHayMasObras(datos.tieneMas);
      }
    } catch (error) {
      console.error("Error cargando el feed:", error);
    } finally {
      setCargando(false);
    }
  };

  // Acción del botón "Cargar Más"
  const handleCargarMas = () => {
    const siguientePagina = pagina + 1;
    setPagina(siguientePagina);
    cargarObras(siguientePagina, false);
  };

  const handleMyGalleryClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    if (!isLoggedIn) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } else {
      router.push('/dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tokenArtBlock');
    localStorage.removeItem('nombreArtBlock');
    localStorage.removeItem('emailArtBlock');
    setIsLoggedIn(false);
  };

  return (
    <div className={styles.pageContainer}>
      
      {showAlert && (
        <div style={{
          position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#111', color: '#fff', padding: '12px 24px', borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 1000, fontSize: '0.9rem',
          display: 'flex', alignItems: 'center', gap: '10px', animation: 'fadeInDown 0.3s ease-out'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff4d4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Debes iniciar sesión para acceder al estudio del artista.
        </div>
      )}

      <header className={styles.header}>
        <div className={styles.logo}>ArtBlock</div>
        <nav className={styles.navLinks}>
          <a href="#" className={styles.active}>Gallery</a>
          <a href="#" onClick={handleMyGalleryClick} style={{ cursor: 'pointer' }}>My gallery</a>
        </nav>
        
        <div className={styles.authButtons}>
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: '500' }}>
                Conectado como <strong style={{ color: '#000' }}>{nombreArtista || 'Artista'}</strong>
              </span>
              <Link href="/dashboard" className={styles.joinBtn}>Mi Panel</Link>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '0.8rem', textDecoration: 'underline' }}>
                Salir
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className={styles.signInBtn}>Sign In</Link>
              <Link href="/login" className={styles.joinBtn}>Join ArtBlock</Link>
            </>
          )}
        </div>
      </header>

      <main className={styles.mainContent}>
        <section className={styles.heroSection}>
          <div className={styles.heroText}>
            <span className={styles.collectionLabel}>ARCHIVE COLLECTION // 2026</span>
            <h1 className={styles.heroTitle}>Curated Vision.<br/>Protected Heritage.</h1>
            <p className={styles.heroSubtitle}>
              A secure haven for the world's most evocative digital artistry.<br/>
              Every piece in ArtBlock is cryptographically secured and<br/>
              verified for provenance.
            </p>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <h2>{obrasPublicas.length > 0 ? '+100' : '0'}</h2>
              <span>ARTWORKS</span>
            </div>
            <div className={styles.stat}>
              <h2>Global</h2>
              <span>ARCHIVE</span>
            </div>
          </div>
        </section>

        <section className={styles.filterSection}>
          <button className={`${styles.filterBtn} ${styles.activeFilter}`}>ALL WORKS</button>
          <button className={styles.filterBtn}>MINIMALISM</button>
          <button className={styles.filterBtn}>BRUTALISM</button>
        </section>

        {/* GRID REAL CONECTADO A BASE DE DATOS */}
        <section className={styles.gridSection}>
          <div className={styles.masonry}>
            {obrasPublicas.length === 0 && !cargando ? (
              <div style={{ padding: '4rem', textAlign: 'center', color: '#666', gridColumn: '1 / -1' }}>
                Aún no hay obras protegidas en The Vault. ¡Sé el primero en subir una!
              </div>
            ) : (
              obrasPublicas.map((obra) => (
                <div key={obra.id} className={styles.artCard}>
                  <div className={styles.imageWrapper}>
                    <div className={styles.aiBadge}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                      AI-PROTECTED
                    </div>
                    <img src={obra.imagen_url} alt={obra.titulo} className={styles.artImage} />
                  </div>
                  
                  <div className={styles.artInfo}>
                    <div className={styles.artMeta}>
                      <h3 className={styles.artTitle}>{obra.titulo}</h3>
                      {/* ¡AQUÍ ESTÁ EL CAMBIO MÁGICO! Muestra el nombre real o un respaldo si llega a fallar */}
                      <p className={styles.artArtist}>
                        {obra.artista?.nombre_usuario || "Artista de The Vault"}, 2026
                      </p>
                    </div>
                    <span className={styles.artTag}>ARTBLOCK SECURED</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* BOTÓN MÁGICO DE CARGAR MÁS */}
        {hayMasObras && (
          <div className={styles.loadMoreContainer}>
            <button 
              className={styles.loadMoreBtn} 
              onClick={handleCargarMas}
              disabled={cargando}
            >
              {cargando ? 'LOADING...' : 'VIEW MORE ARCHIVES'}
            </button>
          </div>
        )}

      </main>
    </div>
  );
}