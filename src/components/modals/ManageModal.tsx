import React, { useState } from 'react';

interface ManageModalProps {
  styles: any;
  obra: any;
  onClose: () => void;
  onGuardar: (nuevoTitulo: string) => void;
  onEliminar: () => void;
}

export default function ManageModal({ styles, obra, onClose, onGuardar, onEliminar }: ManageModalProps) {
  const [nuevoTitulo, setNuevoTitulo] = useState(obra.titulo || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar(nuevoTitulo);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Gestionar Obra</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ width: '100%', height: '200px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={obra?.imagen_url} alt="Obra" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <form onSubmit={handleSubmit} className={styles.uploadForm} style={{ gap: '15px' }}>
            <div className={styles.inputGroup}>
              <label>TÍTULO DE LA OBRA</label>
              <input 
                type="text" 
                value={nuevoTitulo}
                onChange={(e) => setNuevoTitulo(e.target.value)}
                required 
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className={styles.btnPrimaryFull} style={{ flex: 2 }}>
                Guardar Cambios
              </button>
              <button 
                type="button" 
                onClick={onEliminar}
                style={{ flex: 1, backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Eliminar Obra
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}