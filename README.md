# 🦇 DC Universe DataBase | AleCodex

¡Bienvenido a la plataforma definitiva de consulta del **Universo DC**! Este proyecto es una aplicación web dinámica diseñada para exploradores y fans de los cómics, permitiendo consultar estadísticas, biografías y datos físicos de personajes icónicos en tiempo real.

## 🚀 Funcionalidades Principales
* **Filtro Editorial Exclusivo:** La aplicación procesa los datos de la API para mostrar únicamente personajes de **DC Comics** y **Detective Comics**.
* **Búsqueda Dinámica:** Localización instantánea de héroes y villanos por nombre.
* **Paginación Inteligente:** Los resultados se dividen en bloques de 18 tarjetas para una navegación fluida y un rendimiento óptimo.
* **Filtros de Orden:** Permite organizar los resultados alfabéticamente (A-Z y Z-A).
* **Ficha Técnica Detallada:** Acceso a Powerstats (Inteligencia, Fuerza, Velocidad, etc.), identidades secretas y conexiones de equipo.

## 🛠️ Stack Tecnológico (Arquitectura)

* **HTML5:** Estructura semántica del sitio.
* **SASS (SCSS):** Utilizado como preprocesador para una gestión avanzada de estilos mediante variables, anidamiento y mixins. 
    > **Nota técnica:** El código fuente en `.scss` se compila a **CSS nativo** para su correcta interpretación en el navegador.
* **Vanilla JavaScript:** Programación pura (sin frameworks) para la manipulación del DOM y el consumo de la API mediante `fetch` y `async/await`.
* **SuperHero API:** Fuente de datos externa que alimenta el multiverso.

## 📂 Estructura del Proyecto
El repositorio mantiene una organización modular y limpia:
```bash
├── assets/           # Imágenes, iconos y el Favicon del sitio
├── js/               # Lógica pura en JavaScript (Vanilla)
├── scss/             # Archivos fuente de estilos (SASS), incluye estilos compilados (Generados desde SCSS)
├── index.html        # Estructura principal de la aplicación
└── README.md         # Documentación técnica
```
## 🛠️ Instalación y Uso Local
1. **Clona** este repositorio o descarga los archivos.
2. Abre la carpeta del proyecto en **VS Code**.
3. Utiliza la extensión **Live Server** para ejecutar el archivo `index.html`.
   > **Importante:** El uso de un servidor local es indispensable para evitar bloqueos de seguridad del navegador (errores de CORS) al realizar peticiones externas a la API.

---

### 📝 Metodología de Trabajo (Git Flow)
Para este proyecto se aplicó un flujo de trabajo profesional basado en ramas:
* **main**: Rama de producción que contiene únicamente versiones finales y estables.
* **Ramas de Desarrollo**: Se trabajó de forma independiente en las ramas `html`, `scss`, `funcionalidad` y `recursos` antes de realizar el **Merge** (fusión) final hacia la rama principal.

---
**Desarrollado con ❤️ por Ale en 2026**
