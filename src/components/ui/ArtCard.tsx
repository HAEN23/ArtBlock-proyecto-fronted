import React from 'react';

// Le decimos qué datos necesita recibir este "LEGO"
interface ArtCardProps {
  obra: any;
  styles: any; // Recibe los estilos exactos del Feed o Dashboard
  onClick?: () => void; // Opcional, por si le das clic en el Dashboard
}

export default function ArtCard({ obra, styles, onClick }: ArtCardProps) {
  return (
    <div 
      className={styles.artCard} 
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      <div className={styles.imageWrapper}>
        <div className={styles.aiBadge}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          AI-PROTECTED
        </div>
        <img src={obra.imagen_url || obra.imgUrl} alt={obra.titulo || obra.title} className={styles.artImage} />
      </div>
      
      <div className={styles.artInfo}>
        <div className={styles.artMeta}>
          <h3 className={styles.artTitle}>{obra.titulo || obra.title}</h3>
          <p className={styles.artArtist}>
            {obra.artista?.nombre_usuario || obra.artist || "Artista de The Vault"}
          </p>
        </div>
        <span className={styles.artTag}>ARTBLOCK SECURED</span>
      </div>
    </div>
  );
}