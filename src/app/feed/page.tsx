'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
// 1. Aquí recuperamos la importación de los estilos
import styles from './Feed.module.css';

// 2. Importamos tus nuevas piezas de LEGO
import Navbar from '@/components/layout/Navbar';
import HeroBanner from '@/components/ui/HeroBanner';
import ArtCard from '@/components/ui/ArtCard';

export default function FeedView() {
  const router = useRouter();
  
  // ==========================================
  // LÓGICA DE SESIÓN
  // ==========================================
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nombreArtista, setNombreArtista] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // ==========================================
  // LÓGICA DEL FEED (Aquí recuperamos obrasPublicas)
  // ==========================================
  const [obrasPublicas, setObrasPublicas] = useState<any[]>([]);
  const [pagina, setPagina] = useState(1);
  const [hayMasObras, setHayMasObras] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('tokenArtBlock');
    const nombre = localStorage.getItem('nombreArtBlock');
    if (token) {
      setIsLoggedIn(true);
      if (nombre) setNombreArtista(nombre);
    }
    cargarObras(1, true);
  }, []);

  const cargarObras = async (numeroPagina: number, esPrimeraCarga = false) => {
    try {
      setCargando(true);
      const respuesta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/obras/publicas?pagina=${numeroPagina}&limite=6`);
      const datos = await respuesta.json();

      if (datos.exito) {
        if (esPrimeraCarga) {
          setObrasPublicas(datos.obras);
        } else {
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
      
      {/* ALERTA DE INICIO DE SESIÓN */}
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

      {/* 3. USAMOS EL COMPONENTE NAVBAR */}
      <Navbar 
        styles={styles} 
        isLoggedIn={isLoggedIn} 
        nombreArtista={nombreArtista}
        onMyGalleryClick={handleMyGalleryClick}
        onLogout={handleLogout}
      />

      <main className={styles.mainContent}>
        
        {/* 4. USAMOS EL COMPONENTE HEROBANNER */}
        <HeroBanner 
          styles={styles} 
          cantidadObras={obrasPublicas.length} 
        />

        <section className={styles.filterSection}>
          <button className={`${styles.filterBtn} ${styles.activeFilter}`}>ALL WORKS</button>
          <button className={styles.filterBtn}>MINIMALISM</button>
          <button className={styles.filterBtn}>BRUTALISM</button>
        </section>

        <section className={styles.gridSection}>
          <div className={styles.masonry}>
            {obrasPublicas.length === 0 && !cargando ? (
              <div style={{ padding: '4rem', textAlign: 'center', color: '#666', gridColumn: '1 / -1' }}>
                Aún no hay obras protegidas en The Vault. ¡Sé el primero en subir una!
              </div>
            ) : (
              // 5. USAMOS EL COMPONENTE ARTCARD (y le decimos a TypeScript que 'obra' es 'any')
              obrasPublicas.map((obra: any) => (
                <ArtCard 
                  key={obra.id} 
                  obra={obra} 
                  styles={styles} 
                />
              ))
            )}
          </div>
        </section>

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