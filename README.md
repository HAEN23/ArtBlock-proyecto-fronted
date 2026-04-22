## ArtBlock - Frontend (Next.js)
ArtBlock es una plataforma pensada para que los artistas puedan compartir sus obras de una manera segura, es decir, protegiéndose del uso no autorizado para el entrenamiento de modelos de Inteligencia Artificial, para uso algún que sea para estos fines de lucro. El repositorio contiene la interfase de usuario moderna y minimalista. Hecha para ofrecer una experiencia fluida tanto a los visitantes como a los creadores.

## Características Principales
Galería Pública Dinámica: Feed interactivo donde se muestran las obras protegidas por la comunidad.
Estudio del Artista (Dashboard): Panel de control privado donde gestionar obras, permitiendo subir, editar y eliminar contenido.
Autenticación Segura: Sistema de autenticación protegido mediante tokens JWT que garantiza que el autor sea quien gestione su galería.
Arquitectura Componentizada: UI refactorizada en componentes reutilizables (Navbar, Sidebar, ArtCard, Modales), entregando un código limpio y escalable.
Diseño UX/UI Minimalista: Interfaz que tiene como propósito el foco en la obra visual del artista.

## Stack Tecnológico
Framework: Next.js 14+ (App Router)
Lenguaje: TypeScript
Estilos: CSS Modules (Diseño modular y sin colisiones)
Estado y Efectos: React Hooks (useState, useEffect)
Despliegue: Vercel

## Arquitectura Orientada a Servicios
Este proyecto forma parte de un ecosistema desacoplado que cumple con los estándares de arquitectura orientada a servicios:
Backend: ArtBlock-proyecto-backend - API REST en Node.js/Express.
Infraestructura: ArtBlock-proyecto-infra - Configuración de contenedores y despliegue.

## Equipo
Escobar Nuricumbo Heber Alexander-243691
Cuc López Axel Rodrigo-243702
Santillan Montesinos Eduardo-243747

## Docente: Viviana López Rojo