'use client';

import React, { useState } from 'react';
import Link from 'next/link';
// Si usas App Router, importa useRouter para la navegación
import { useRouter } from 'next/navigation'; 
import styles from './Feed.module.css';

// Mock de datos para simular las obras de arte
const obrasMock = [
  {
    id: 1,
    title: "Vortex of Silence",
    artist: "Elias Thorne",
    year: "2024",
    imgUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    tag: "EDITION 1/1"
  },
  {
    id: 2,
    title: "Organic Decay No. 4",
    artist: "Sora Matsu",
    year: "2024",
    imgUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop",
    tag: null
  },
  {
    id: 3,
    title: "Structure 09",
    artist: "Lana Volkov",
    year: "2023",
    imgUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    tag: null
  },
  {
    id: 4,
    title: "The Lone Signal",
    artist: "Marcus Chen",
    year: "2024",
    imgUrl: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1000&auto=format&fit=crop",
    tag: "LIMITED RELEASE"
  },
  {
    id: 5,
    title: "Oxidized Memory",
    artist: "David Aris",
    year: "2024",
    imgUrl: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop",
    tag: null
  },
  {
    id: 6,
    title: "Continuity I",
    artist: "Sora Matsu",
    year: "2024",
    imgUrl: "https://images.unsplash.com/photo-1618005192384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    tag: null
  },
  {
    id: 7,
    title: "Refraction Studies",
    artist: "Lana Volkov",
    year: "2023",
    imgUrl: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=800&auto=format&fit=crop",
    tag: null
  }
];

export default function FeedView() {
  const router = useRouter();
  
  // Estado para simular si el usuario está autenticado o no (cambia a true para probar si lo deja pasar)
  const [isRegistered, setIsRegistered] = useState(false);
  
  // Estado para controlar la visibilidad del mensaje de error
  const [showAlert, setShowAlert] = useState(false);

  // Función que maneja el clic en "My gallery"
  const handleMyGalleryClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita que el enlace recargue la página o salte
    
    if (!isRegistered) {
      // Si no está registrado, mostramos la alerta y la ocultamos después de 3 segundos
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } else {
      // Si está registrado, lo mandamos al dashboard
      router.push('/dashboard');
    }
  };

  return (
    <div className={styles.pageContainer}>
      
      {/* MENSAJE DE ALERTA FLOTANTE (ESTILO ARTBLOCK) */}
      {showAlert && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#111',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'fadeInDown 0.3s ease-out'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff4d4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Debes iniciar sesión para acceder al estudio del artista.
        </div>
      )}

      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.logo}>ArtBlock</div>
        <nav className={styles.navLinks}>
          <a href="#" className={styles.active}>Gallery</a>
          {/* Cambiamos el enlace por nuestro manejador de eventos */}
          <a href="#" onClick={handleMyGalleryClick} style={{ cursor: 'pointer' }}>My gallery</a>
        </nav>
        <div className={styles.authButtons}>
          <Link href="/login" className={styles.signInBtn}>Sign In</Link>
          <Link href="/login" className={styles.joinBtn}>Join ArtBlock</Link>
        </div>
      </header>

      <main className={styles.mainContent}>
        
        {/* HERO SECTION */}
        <section className={styles.heroSection}>
          <div className={styles.heroText}>
            <span className={styles.collectionLabel}>ARCHIVE COLLECTION // 2024</span>
            <h1 className={styles.heroTitle}>Curated Vision.<br/>Protected Heritage.</h1>
            <p className={styles.heroSubtitle}>
              A secure haven for the world's most evocative digital artistry.<br/>
              Every piece in ArtBlock is cryptographically secured and<br/>
              verified for provenance.
            </p>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <h2>12.4k</h2>
              <span>ARTWORKS</span>
            </div>
            <div className={styles.stat}>
              <h2>850</h2>
              <span>ARTISTS</span>
            </div>
          </div>
        </section>

        {/* FILTERS */}
        <section className={styles.filterSection}>
          <button className={`${styles.filterBtn} ${styles.activeFilter}`}>ALL WORKS</button>
          <button className={styles.filterBtn}>MINIMALISM</button>
          <button className={styles.filterBtn}>BRUTALISM</button>
          <button className={styles.filterBtn}>NEO-CLASSICAL</button>
          <button className={styles.filterBtn}>GENERATIVE</button>
        </section>

        {/* MASONRY GRID */}
        <section className={styles.gridSection}>
          <div className={styles.masonry}>
            {obrasMock.map((obra) => (
              <div key={obra.id} className={styles.artCard}>
                <div className={styles.imageWrapper}>
                  {/* Etiqueta de Protección IA */}
                  <div className={styles.aiBadge}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    AI-PROTECTED
                  </div>
                  {/* Usamos etiqueta img normal para evitar configurar dominios en next.config.js por ahora */}
                  <img src={obra.imgUrl} alt={obra.title} className={styles.artImage} />
                </div>
                
                <div className={styles.artInfo}>
                  <div className={styles.artMeta}>
                    <h3 className={styles.artTitle}>{obra.title}</h3>
                    <p className={styles.artArtist}>{obra.artist}, {obra.year}</p>
                  </div>
                  {obra.tag && (
                    <span className={styles.artTag}>{obra.tag}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER ACTION */}
        <div className={styles.loadMoreContainer}>
          <button className={styles.loadMoreBtn}>VIEW FULL ARCHIVE</button>
        </div>

      </main>
    </div>
  );
}