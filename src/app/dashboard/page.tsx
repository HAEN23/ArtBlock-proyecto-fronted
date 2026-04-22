'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './Dashboard.module.css';

// 1. IMPORTAMOS TUS PIEZAS DE LEGO
import Sidebar from '@/components/layout/Sidebar';
import ArtCard from '@/components/ui/ArtCard';
import ManageModal from '@/components/modals/ManageModal';

export default function DashboardView() {
  const [artworks, setArtworks] = useState<any[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  const [obraSeleccionada, setObraSeleccionada] = useState<any>(null);
  
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
    if (!obra) return; 
    setObraSeleccionada(obra);
  };

  // Ajustado para recibir el "nuevoTitulo" desde el componente ManageModal
  const handleEditarObra = async (nuevoTitulo: string) => {
    if (!obraSeleccionada || !obraSeleccionada.id) return; 

    const token = localStorage.getItem('tokenArtBlock');
    
    try {
      const respuesta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/obras/${obraSeleccionada.id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ titulo: nuevoTitulo }) // Usamos el parámetro que nos manda el modal
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
    if (!obraSeleccionada || !obraSeleccionada.id) return; 

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
      
      {/* 2. USAMOS EL COMPONENTE SIDEBAR */}
      <Sidebar 
        styles={styles} 
        onEditProfileClick={() => setIsProfileModalOpen(true)} 
      />

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

          {artworks.map((obra) => {
            if (!obra || !obra.id) return null;

            return (
              // 3. USAMOS EL COMPONENTE ARTCARD
              <ArtCard 
                key={obra.id} 
                obra={obra} 
                styles={styles} 
                onClick={() => abrirGestionObra(obra)} 
              />
            );
          })}
        </section>
      </main>

      {/* MODAL PARA SUBIR OBRA (Lo mantenemos aquí por el manejo de archivos) */}
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

      {/* 4. USAMOS EL COMPONENTE MANAGEMODAL */}
      {obraSeleccionada && (
        <ManageModal 
          styles={styles}
          obra={obraSeleccionada}
          onClose={() => setObraSeleccionada(null)}
          onGuardar={handleEditarObra}
          onEliminar={handleEliminarObra}
        />
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