'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './Dashboard.module.css';

export default function DashboardView() {
  const [artworks, setArtworks] = useState<any[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  const [obraSeleccionada, setObraSeleccionada] = useState<any>(null);
  const [nuevoTituloObra, setNuevoTituloObra] = useState("");
  
  const [artistName, setArtistName] = useState("Artista Anónimo");
  const [artistEmail, setArtistEmail] = useState("");

  const [tituloObra, setTituloObra] = useState("");
  const [archivoImagen, setArchivoImagen] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cargarMisObras = async () => {
    const token = localStorage.getItem('tokenArtBlock');
    if (!token) return;

    try {
      const respuesta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/obras/mias`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const datos = await respuesta.json();
      
      if (datos.exito) {
        // BLINDAJE 1: Nos aseguramos de que lo que llega es realmente un arreglo (lista) válido
        if (Array.isArray(datos.obras)) {
          setArtworks(datos.obras);
        } else {
          setArtworks([]);
        }
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
    cargarMisObras();
  }, []);

  const cerrarModalSubida = () => {
    setIsModalOpen(false);
    setTituloObra("");
    setArchivoImagen(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArchivoImagen(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setArchivoImagen(null);
      setPreviewUrl(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!archivoImagen) return alert("Por favor selecciona una imagen.");

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
        cerrarModalSubida();
        cargarMisObras(); 
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

  const abrirGestionObra = (obra: any) => {
    if (!obra) return; // BLINDAJE 2: Si la obra es nula, no hacemos nada
    setObraSeleccionada(obra);
    setNuevoTituloObra(obra.titulo || ""); 
  };

  const handleEditarObra = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!obraSeleccionada || !obraSeleccionada.id) return; // BLINDAJE 3

    const token = localStorage.getItem('tokenArtBlock');
    
    try {
      const respuesta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/obras/${obraSeleccionada.id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ titulo: nuevoTituloObra })
      });
      
      const datos = await respuesta.json();
      if (datos.exito) {
        alert("¡Título actualizado!");
        setObraSeleccionada(null);
        cargarMisObras(); 
      } else {
        alert("Error: " + datos.mensaje);
      }
    } catch (error) {
      alert("Error al conectar con el servidor.");
    }
  };

  const handleEliminarObra = async () => {
    if (!obraSeleccionada || !obraSeleccionada.id) return; // BLINDAJE 4

    const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar permanentemente "${obraSeleccionada.titulo}"? Esta acción no se puede deshacer.`);
    if (!confirmar) return;

    const token = localStorage.getItem('tokenArtBlock');
    
    try {
      const respuesta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/obras/${obraSeleccionada.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const datos = await respuesta.json();
      if (datos.exito) {
        setObraSeleccionada(null); 
        cargarMisObras(); 
      } else {
        alert("Error: " + datos.mensaje);
      }
    } catch (error) {
      alert("Error al conectar con el servidor.");
    }
  };

  return (
    <div className={styles.dashboardLayout}>
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

        <section className={styles.artGrid}>
          <button className={styles.addPieceCard} onClick={() => setIsModalOpen(true)}>
            <div className={styles.addIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            </div>
            <h4>AÑADIR PIEZA</h4>
            <p>Formatos soportados: JPG, PNG.</p>
          </button>

          {artworks.map((obra, index) => {
            // BLINDAJE 5: Si por alguna razón la base de datos nos manda un objeto corrupto, lo saltamos visualmente
            if (!obra || !obra.id) return null;

            return (
              <div 
                key={obra.id} 
                className={styles.artCard} 
                onClick={() => abrirGestionObra(obra)}
                style={{ cursor: 'pointer' }}
                title="Haz clic para editar o eliminar"
              >
                <div className={styles.imageWrapper}>
                  <img src={obra.imagen_url} alt={obra.titulo || "Obra sin título"} className={styles.artImage} />
                </div>
                <div className={styles.artInfo}>
                  <div className={styles.infoTop}>
                    <h4>{obra.titulo || "Sin título"}</h4>
                    <span className={styles.edition}>ÚNICA</span>
                  </div>
                  <p className={styles.collection}>Protegida en ArtBlock</p>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      {/* MODAL PARA SUBIR OBRA */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Subir Nueva Obra</h2>
              <button className={styles.closeBtn} onClick={cerrarModalSubida}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <form onSubmit={handleUpload} className={styles.uploadForm}>
              <div 
                className={styles.dropZone} 
                onClick={() => fileInputRef.current?.click()} 
                style={{ cursor: 'pointer', padding: previewUrl ? '0' : '2rem', overflow: 'hidden', border: previewUrl ? 'none' : '2px dashed #333' }}
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Previsualización" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : (
                  <>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    <p>Haz clic aquí para <strong>seleccionar un archivo</strong> de tu equipo</p>
                  </>
                )}
                <input type="file" accept="image/png, image/jpeg" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
              </div>
              <div className={styles.inputGroup}>
                <label>TÍTULO DE LA OBRA</label>
                <input type="text" value={tituloObra} onChange={(e) => setTituloObra(e.target.value)} required />
              </div>
              <button type="submit" className={styles.btnPrimaryFull}>Proteger y Subir a ArtBlock</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE GESTIÓN (EDITAR / ELIMINAR) */}
      {obraSeleccionada && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
             <div className={styles.modalHeader}>
              <h2>Gestionar Obra</h2>
              <button className={styles.closeBtn} onClick={() => setObraSeleccionada(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ width: '100%', height: '200px', borderRadius: '8px', overflow: 'hidden' }}>
                <img src={obraSeleccionada?.imagen_url} alt="Obra" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <form onSubmit={handleEditarObra} className={styles.uploadForm} style={{ gap: '15px' }}>
                <div className={styles.inputGroup}>
                  <label>TÍTULO DE LA OBRA</label>
                  <input 
                    type="text" 
                    value={nuevoTituloObra}
                    onChange={(e) => setNuevoTituloObra(e.target.value)}
                    required 
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className={styles.btnPrimaryFull} style={{ flex: 2 }}>
                    Guardar Cambios
                  </button>
                  <button 
                    type="button" 
                    onClick={handleEliminarObra}
                    style={{ flex: 1, backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Eliminar Obra
                  </button>
                </div>
              </form>
            </div>
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
                <input type="text" value={artistName} onChange={(e) => setArtistName(e.target.value)} required />
              </div>
              <button type="submit" className={styles.btnPrimaryFull}>Guardar Cambios</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}