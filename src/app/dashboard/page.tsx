'use client';

import React, { useState } from 'react';
import styles from './Dashboard.module.css';

// Mock de datos iniciales
const initialArtworks = [
  {
    id: 1,
    title: 'Sombras del Éter I',
    collection: 'COLECCIÓN: SILENCIO DIGITAL',
    edition: 'ED. 1/5',
    status: 'PROTEGIDO',
    imgUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Geometría del Vacío',
    collection: 'COLECCIÓN: ARCHIVO 01',
    edition: 'ÚNICA',
    status: 'VENDIDO',
    imgUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Morfología Urbana',
    collection: 'COLECCIÓN: CIUDAD MUERTA',
    edition: 'ED. 10/10',
    status: 'EN REVISIÓN',
    imgUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Textura Mineral IV',
    collection: 'COLECCIÓN: ELEMENTOS',
    edition: 'PIEZA ÚNICA',
    status: '',
    imgUrl: 'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop',
  }
];

export default function DashboardView() {
  const [artworks, setArtworks] = useState(initialArtworks);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función para simular eliminar una obra
  const handleDelete = (id: number) => {
    // Filtramos la obra que queremos eliminar
    const updatedArtworks = artworks.filter(art => art.id !== id);
    setArtworks(updatedArtworks);
  };

  // Función para simular la subida (cierra el modal)
  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    alert("¡Obra subida exitosamente a ArtBlock!");
    // Aquí iría la lógica real para agregar la obra al estado/backend
  };

  return (
    <div className={styles.dashboardLayout}>
      
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.brand}>
            <h2>ARTBLOCK</h2>
            <span>ESTUDIO DE ARTISTA</span>
          </div>

          <nav className={styles.sideNav}>
            <a href="#" className={styles.active}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              Panel del Artista
            </a>
            <a href="#">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              Colecciones
            </a>
            <a href="#">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              Protección AI
            </a>
            <a href="#">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10"></path><path d="M12 20V4"></path><path d="M6 20v-6"></path></svg>
              Estadísticas
            </a>
          </nav>
        </div>

        <div className={styles.sidebarBottom}>
          <a href="#">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            Soporte
          </a>
          <a href="#">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            Archivo Histórico
          </a>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={styles.mainContent}>
        
        {/* Header */}
        <header className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>Galería Privada</h1>
            <span className={styles.pageSubtitle}>MEMBRESÍA ARTBLOCK PRO • PROTECCIÓN ACTIVA</span>
          </div>
          <button className={styles.btnPrimary} onClick={() => setIsModalOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Subir Obra Nueva
          </button>
        </header>

        {/* Stats Row */}
        <section className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>TOTAL DE OBRAS</span>
            <div className={styles.statValue}>
              <h2>48</h2><span>/100</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>VISUALIZACIONES GLOBALES</span>
            <div className={styles.statValue}>
              <h2>12.4K</h2><span className={styles.positive}>+12%</span>
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.statDark}`}>
            <span className={styles.statLabelDark}>ESTADO DE PROTECCIÓN</span>
            <h3 className={styles.statTitleDark}>Blindaje Criptográfico<br/>Activo</h3>
            <div className={styles.statFooterDark}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              Inmune a Scrapers de AI
            </div>
          </div>
        </section>

        {/* Grid de Obras */}
        <section className={styles.artGrid}>
          
          {/* Botón Añadir Pieza (En el Grid) */}
          <button className={styles.addPieceCard} onClick={() => setIsModalOpen(true)}>
            <div className={styles.addIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            </div>
            <h4>AÑADIR PIEZA</h4>
            <p>Formatos soportados: RAW, TIFF, PNG.<br/>Máximo 100MB.</p>
          </button>

          {/* Tarjetas de Obras */}
          {artworks.map((obra) => (
            <div key={obra.id} className={styles.artCard}>
              <div className={styles.imageWrapper}>
                {obra.status && <div className={styles.badge}>{obra.status}</div>}
                
                {/* Botón Eliminar (Aparece en hover, manejado por CSS) */}
                <button 
                  className={styles.deleteBtn} 
                  onClick={() => handleDelete(obra.id)}
                  title="Eliminar obra"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>

                <img src={obra.imgUrl} alt={obra.title} className={styles.artImage} />
              </div>
              <div className={styles.artInfo}>
                <div className={styles.infoTop}>
                  <h4>{obra.title}</h4>
                  <span className={styles.edition}>{obra.edition}</span>
                </div>
                <p className={styles.collection}>{obra.collection}</p>
              </div>
            </div>
          ))}
        </section>

      </main>

      {/* MODAL PARA SUBIR OBRA (Renderizado condicional) */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Subir Nueva Obra</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <form onSubmit={handleUpload} className={styles.uploadForm}>
              <div className={styles.dropZone}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                <p>Arrastra tu archivo aquí o <strong>selecciona desde tu equipo</strong></p>
              </div>

              <div className={styles.inputGroup}>
                <label>TÍTULO DE LA OBRA</label>
                <input type="text" placeholder="Ej. Ecos del Mañana" required />
              </div>
              
              <div className={styles.inputGroup}>
                <label>COLECCIÓN</label>
                <input type="text" placeholder="Ej. Archivo 02" />
              </div>

              <button type="submit" className={styles.btnPrimaryFull}>Proteger y Subir a ArtBlock</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}