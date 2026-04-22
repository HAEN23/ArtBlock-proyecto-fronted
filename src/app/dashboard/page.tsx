'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './Dashboard.module.css';

export default function DashboardView() {
  // 1. Iniciamos la galería vacía (sin relleno)
  const [artworks, setArtworks] = useState<any[]>([]);
  
  // Estados para los modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  // Estados del usuario real
  const [artistName, setArtistName] = useState("Artista Anónimo");
  const [artistEmail, setArtistEmail] = useState("");

  // Estados para el formulario de subida real
  const [tituloObra, setTituloObra] = useState("");
  const [archivoImagen, setArchivoImagen] = useState<File | null>(null);
  
  // Referencia para abrir el explorador de archivos al dar clic en la caja
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 2. Función que va a la base de datos a buscar tus obras guardadas
  const cargarMisObras = async () => {
    const token = localStorage.getItem('tokenArtBlock');
    if (!token) return;

    try {
      const respuesta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/obras/mias`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const datos = await respuesta.json();
      
      if (datos.exito) {
        setArtworks(datos.obras); // Llenamos la galería con la base de datos
      }
    } catch (error) {
      console.error("Error cargando obras:", error);
    }
  };

  useEffect(() => {
    const storedName = localStorage.getItem('nombreArtBlock');
    const storedEmail = localStorage.getItem('emailArtBlock');

    if (storedName) setArtistName(storedName);
    if (storedEmail) setArtistEmail(storedEmail);

    // Cargamos las obras al entrar a la página
    cargarMisObras();
  }, []);

  // 3. Función real para subir la obra usando FormData y tu Backend
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!archivoImagen) return alert("Por favor selecciona una imagen de tu equipo.");

    const token = localStorage.getItem('tokenArtBlock');
    const formData = new FormData();
    formData.append('titulo', tituloObra);
    formData.append('imagen', archivoImagen);

    try {
      const respuesta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/obras/subir`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const datos = await respuesta.json();

      if (datos.exito) {
        alert("¡Obra protegida y subida exitosamente a ArtBlock!");
        setIsModalOpen(false);
        setTituloObra("");
        setArchivoImagen(null);
        cargarMisObras(); // Recargamos la galería para ver la nueva obra de inmediato
      } else {
        alert("Error: " + datos.mensaje);
      }
    } catch (error) {
      alert("Error al conectar con el servidor.");
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('nombreArtBlock', artistName);
    localStorage.setItem('emailArtBlock', artistEmail);
    setIsProfileModalOpen(false);
    alert("¡Perfil actualizado correctamente!");
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
            
            <Link href="/feed" className={styles.navLink}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              Colecciones Públicas
            </Link>
            
            <button className={styles.navButton} onClick={() => setIsProfileModalOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              Editar Perfil
            </button>
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>Galería de {artistName}</h1>
            <span className={styles.pageSubtitle}>MEMBRESÍA ARTBLOCK PRO • PROTECCIÓN ACTIVA</span>
          </div>
          <button className={styles.btnPrimary} onClick={() => setIsModalOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Subir Obra Nueva
          </button>
        </header>

        <section className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>TOTAL DE OBRAS</span>
            <div className={styles.statValue}>
              <h2>{artworks.length}</h2>
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.statDark}`}>
            <span className={styles.statLabelDark}>ESTADO DE PROTECCIÓN</span>
            <h3 className={styles.statTitleDark}>Blindaje Criptográfico<br/>Activo</h3>
          </div>
        </section>

        {/* Grid de Obras Reales */}
        <section className={styles.artGrid}>
          <button className={styles.addPieceCard} onClick={() => setIsModalOpen(true)}>
            <div className={styles.addIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            </div>
            <h4>AÑADIR PIEZA</h4>
            <p>Formatos soportados: JPG, PNG.<br/>Se abrirá el explorador de archivos.</p>
          </button>

          {/* Mapeo dinámico de la base de datos */}
          {artworks.map((obra) => (
            <div key={obra.id} className={styles.artCard}>
              <div className={styles.imageWrapper}>
                <img src={obra.imagen_url} alt={obra.titulo} className={styles.artImage} />
              </div>
              <div className={styles.artInfo}>
                <div className={styles.infoTop}>
                  <h4>{obra.titulo}</h4>
                  <span className={styles.edition}>ÚNICA</span>
                </div>
                <p className={styles.collection}>Protegida en ArtBlock</p>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* MODAL PARA SUBIR OBRA (Con input File real) */}
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
              {/* Esta es la zona clickeable que abre el explorador */}
              <div 
                className={styles.dropZone} 
                onClick={() => fileInputRef.current?.click()} 
                style={{ cursor: 'pointer', border: archivoImagen ? '2px solid #000' : '' }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                <p>
                  {archivoImagen 
                    ? `Seleccionado: ${archivoImagen.name}` 
                    : <>Haz clic aquí para <strong>seleccionar un archivo</strong> de tu equipo</>
                  }
                </p>
                {/* Input oculto real */}
                <input 
                  type="file" 
                  accept="image/png, image/jpeg" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  onChange={(e) => setArchivoImagen(e.target.files?.[0] || null)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>TÍTULO DE LA OBRA</label>
                <input 
                  type="text" 
                  value={tituloObra} 
                  onChange={(e) => setTituloObra(e.target.value)} 
                  placeholder="Ej. Ecos del Mañana" 
                  required 
                />
              </div>
              <button type="submit" className={styles.btnPrimaryFull}>Proteger y Subir a ArtBlock</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PARA EDITAR PERFIL */}
      {isProfileModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
             <div className={styles.modalHeader}>
              <h2>Editar Perfil de Usuario</h2>
              <button className={styles.closeBtn} onClick={() => setIsProfileModalOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <form onSubmit={handleProfileSave} className={styles.uploadForm}>
              <div className={styles.inputGroup}>
                <label>NOMBRE DEL ARTISTA</label>
                <input 
                  type="text" 
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  required 
                />
              </div>
              <button type="submit" className={styles.btnPrimaryFull}>Guardar Cambios</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}