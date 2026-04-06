# 🦇 DC Universe DataBase | AleCodex

¡Bienvenido a la plataforma definitiva de consulta del **Universo DC**! Este proyecto es una aplicación web dinámica diseñada para exploradores y fans de los cómics, permitiendo consultar estadísticas, biografías y datos físicos de personajes icónicos en tiempo real.

## 🚀 Funcionalidades Principales
* **Filtro Editorial Exclusivo:** La aplicación procesa el conjunto de datos global para segmentar y mostrar únicamente personajes de **DC Comics** y **Detective Comics**.
* **Motor de Búsqueda Local:** Implementación de filtrado en memoria sobre el array de datos, lo que garantiza una localización instantánea de héroes y villanos sin latencia de red.
* **Paginación Inteligente:** Los resultados se dividen en bloques de 18 tarjetas para una navegación fluida y un diseño armonioso en dispositivos móviles y desktop.
* **Filtros de Orden:** Gestión de ordenamiento alfabético dinámico (A-Z y Z-A) aplicado al estado actual de la búsqueda.
* **Ficha Técnica Detallada:** Visualización avanzada de Powerstats (Inteligencia, Fuerza, Velocidad, etc.), identidades secretas y conexiones de equipo con imágenes en alta resolución.

## 🛠️ Stack Tecnológico (Arquitectura)

* **HTML5:** Estructura semántica del sitio.
* **SASS (SCSS):** Utilizado como preprocesador para una gestión avanzada de estilos mediante variables, anidamiento y mixins. 
    > **Nota técnica:** El código fuente en `.scss` se compila a **CSS nativo** para su correcta interpretación en el navegador.
* **Vanilla JavaScript:** Lógica pura para la manipulación del DOM y gestión de datos asíncronos mediante `fetch` y `async/await`.
* **Akabab SuperHero API:** Repositorio de datos en formato JSON que permite una carga inicial completa para un rendimiento de filtrado superior.

## 📂 Estructura del Proyecto
El repositorio mantiene una organización modular y limpia:
```bash
├── assets/           # Imágenes, iconos y el Favicon del sitio
├── js/               # Lógica pura en JavaScript (Vanilla)
├── scss/             # Archivos fuente de estilos (SASS) y CSS compilado
├── index.html        # Estructura principal de la aplicación
└── README.md         # Documentación técnica
```

## ⚙️ Funcionamiento Técnico
A diferencia de las arquitecturas tradicionales de consulta por endpoint, esta aplicación optimiza el rendimiento mediante:

1. **Carga Inicial Única:** Se realiza una petición al archivo `all.json` de la API al iniciar la aplicación.
2. **Filtrado en Memoria:** Los datos se filtran localmente para asegurar que solo el contenido de **DC** esté disponible, eliminando peticiones redundantes al servidor cada vez que el usuario realiza una búsqueda.
3. **Gestión de Estado:** La paginación y el ordenamiento se sincronizan con los resultados filtrados, manteniendo la consistencia en la interfaz de usuario (UI).

## 🛠️ Instalación y Uso Local
1. **Clona** este repositorio o descarga los archivos.
2. Abre la carpeta del proyecto en **VS Code**.
3. Utiliza la extensión **Live Server** para ejecutar el archivo `index.html`.

> [!IMPORTANT]
> El uso de un servidor local es indispensable para gestionar correctamente las peticiones asíncronas y evitar bloqueos de seguridad del navegador (errores de CORS).

## 📝 Metodología de Trabajo (Git Flow)
Para este proyecto se aplicó un flujo de trabajo profesional basado en ramas:

* **`main`**: Rama de producción que contiene la versión estable y desplegada en **Vercel**.
* **Ramas de Desarrollo**: El flujo se dividió en ramas temáticas (`html`, `scss`, `funcionalidad` y `recursos`) antes de realizar el **Merge** final hacia la rama principal.

---
**Desarrollado con ❤️ por Ale en 2026**
