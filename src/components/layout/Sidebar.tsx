import React from 'react';
import Link from 'next/link';

interface SidebarProps {
  styles: any;
  onEditProfileClick: () => void;
}

export default function Sidebar({ styles, onEditProfileClick }: SidebarProps) {
  return (
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
          <button className={styles.navButton} onClick={onEditProfileClick}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Editar Perfil
          </button>
        </nav>
      </div>
    </aside>
  );
}