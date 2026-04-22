import React from 'react';

interface HeroBannerProps {
  styles: any;
  cantidadObras: number;
}

export default function HeroBanner({ styles, cantidadObras }: HeroBannerProps) {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroText}>
        <span className={styles.collectionLabel}>ARCHIVE COLLECTION // 2026</span>
        <h1 className={styles.heroTitle}>Curated Vision.<br/>Protected Heritage.</h1>
        <p className={styles.heroSubtitle}>
          A secure haven for the world's most evocative digital artistry.<br/>
          Every piece in ArtBlock is cryptographically secured and<br/>
          verified for provenance.
        </p>
      </div>
      <div className={styles.heroStats}>
        <div className={styles.stat}>
          <h2>{cantidadObras > 0 ? `+${cantidadObras}` : '0'}</h2>
          <span>ARTWORKS</span>
        </div>
        <div className={styles.stat}>
          <h2>Global</h2>
          <span>ARCHIVE</span>
        </div>
      </div>
    </section>
  );
}