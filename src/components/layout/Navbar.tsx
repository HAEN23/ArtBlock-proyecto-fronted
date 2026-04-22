import React from 'react';
import Link from 'next/link';

interface NavbarProps {
  styles: any;
  isLoggedIn: boolean;
  nombreArtista: string;
  onMyGalleryClick: (e: React.MouseEvent) => void;
  onLogout: () => void;
}

export default function Navbar({ styles, isLoggedIn, nombreArtista, onMyGalleryClick, onLogout }: NavbarProps) {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>ArtBlock</div>
      <nav className={styles.navLinks}>
        <a href="#" className={styles.active}>Gallery</a>
        <a href="#" onClick={onMyGalleryClick} style={{ cursor: 'pointer' }}>My gallery</a>
      </nav>
      
      <div className={styles.authButtons}>
        {isLoggedIn ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: '500' }}>
              Conectado como <strong style={{ color: '#000' }}>{nombreArtista || 'Artista'}</strong>
            </span>
            <Link href="/dashboard" className={styles.joinBtn}>Mi Panel</Link>
            <button onClick={onLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '0.8rem', textDecoration: 'underline' }}>
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
  );
}