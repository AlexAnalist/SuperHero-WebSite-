/**
 * Lógica y motor aplicado para la web. 
 * Aquí se gestiona la búsqueda por nombre, el filtrado, la paginación y la visualización de cada detalle
 */

// --- 1. CONFIGURACIÓN Y VARIABLES ---
const API_TOKEN = "40e6fee2adb72187fe72fb59159e1420"; //token adquirido
const BASE_URL = `https://superheroapi.com/api.php/${API_TOKEN}`;

let currentPage = 1;  //Página actual en la que se encuentra el usuario
const heroesPerPage = 18; // Cantidad de cards que se muestran por página (se dejo 18 en vez de 20 para que se mantuviera la armónia tanto en desktop como movil y ello solo sucede con multiples de 3)
let allHeroes = [];  //Almacén temporal de los resultados

// --- 2. SELECTORES DE ELEMENTOS ---
// Se vinculan los elemento del HTMLA con variables de JS para manipularlos 
const searchForm = document.getElementById('search-form');  //Contenedor de busqieda
const searchInput = document.getElementById('search-input'); //Input de búsqueda, va dentro del contenedor de búsqueda
const mainView = document.getElementById('main-view'); //Contenedor de todos los resultados
const detailView = document.getElementById('detail-view'); //Contenedor de la card seleccionada 
const resultsGrid = document.getElementById('results-grid'); //Grilla de los resultados 
const totalCountSpan = document.getElementById('total-count'); //Conteo de los resultados 
const detailContent = document.getElementById('character-detail-content'); //El contenido dentro del contenedor de la card seleccionada
const btnBack = document.getElementById('back-to-results'); //Boton para volver a la grilla 

// SELECTORES DE PAGINACIÓN (Asegúrate que estos IDs coincidan con tu HTML)
const btnFirst = document.getElementById('btn-first'); // Botón <<
const btnPrev = document.getElementById('btn-prev');   // Botón <
const btnNext = document.getElementById('btn-next');   // Botón >
const btnLast = document.getElementById('btn-last');   // Botón >>
const pageCurrentText = document.getElementById('page-current');

// --- 3. LÓGICA DE BÚSQUEDA ---
// Escuchamos el evento 'submit' del formulario de búsqueda
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evento por defecto que evita que la página se recargue al buscar
    const query = searchInput.value;
    
    try {
        //Peticipon asíncrona de la API extena 
        const response = await fetch(`${BASE_URL}/search/${query}`);
        const data = await response.json(); //Se convierte la respuesta a un objeto JSON

        if (data.response === "success") {
            // Decidí que mi web se especializara en los herores DC, ya que son mis favoritos. Por lo que le añadí un filtro a la información proporcionada por la api
            //Esto lo hago tomando en cuanta el atributo publisher que tiene cada heroe y solo inclucho a la lista a aquellos que inclueyen ("DC")
            // Hice algunas pruebas y hay un problema con algunos supers pero creo que ya es cosa de la api, ya que sin ningun filtro estos siguen sin aparecer o algunos no tienen la información completa. 
            allHeroes = data.results.filter(hero => 
                hero.biography.publisher && hero.biography.publisher.toUpperCase().includes("DC")
            ); 
    
            currentPage = 1; 
            displayPage(currentPage); 

        } else {
            alert("No se encontraron resultados en el universo DC."); //aviso de que no se encontraron resultados
            resultsGrid.innerHTML = ""; //La grilla se muestra vacía 
            totalCountSpan.innerText = "0"; //El contador en cero
        }
    } catch (error) {
        console.error("Error al conectar con la api:", error); //arroja un error si fue de conexión
    }
});

// --- 4. FUNCIONES DE PAGINACIÓN ---
/**
 * Clacul a qué segmento de todos los resultados arrojados por la api se debe mostrar en la pagina
 * @param {number} page //pagina solicitada 
 */
function displayPage(page) {
    // Calculo para segmentar el array 
    const startIndex = (page - 1) * heroesPerPage; // page 1 - 1, da 0 * 18 = 0, por lo que se inicia en el 0
    const endIndex = startIndex + heroesPerPage; // 0 + 18, termina en el 18 
    const heroesToDisplay = allHeroes.slice(startIndex, endIndex); //El método .slice() permite cortar la información necesaria, sin alterar el array original 
    
    renderResults(heroesToDisplay);  //renderiza los resultados al HTML donde se crearan las cards. 
    updatePaginationControls(); //actualiza los controles de paginación indicandole al usuario donde se encuentra. 
}

// --- 5. Gestión de visibilidad: Mostramos la lista y ocultamos la ficha de detalle ---
const renderResults = (heroes) => {
    // 1. 
    mainView.style.display = 'block'; //Vista general de las cards
    detailView.style.display = 'none'; //Oculto el detalle de cada card 
    
    //Mostamos los resultados segun la paginación 
    const paginationContainer = document.querySelector('.pagination-container');
    if (paginationContainer) paginationContainer.style.display = 'flex';

    // 2. ACTUALIZACIÓN DE DATOS
    totalCountSpan.innerText = allHeroes.length; 
    resultsGrid.innerHTML = ""; 

    // 3. GENERACIÓN DE CARDS
    heroes.forEach(hero => {
        const card = document.createElement('div');
        card.classList.add('mini-card');
        
        // Manejo de imagen por si falla (Requisito estético)
        const heroImg = hero.image.url ? hero.image.url : 'ruta/a/tu/placeholder.jpg';

        card.innerHTML = `
            <img src="${heroImg}" alt="${hero.name}" loading="lazy">
            <h4>${hero.name}</h4>
        `;
        
        // 4. VÍNCULO DE EVENTO (Asegúrate que showHeroDetail sea global)
        card.addEventListener('click', () => {
            // Antes de ir al detalle, ocultamos la paginación
            if (paginationContainer) paginationContainer.style.display = 'none';
            showHeroDetail(hero);
        });

        resultsGrid.appendChild(card);
    });
};

function updatePaginationControls() {
    const maxPages = Math.ceil(allHeroes.length / heroesPerPage);
    
    if(pageCurrentText) pageCurrentText.innerText = `PÁGINA ${currentPage}`;
    
    // Deshabilitar botones según la página actual
    if(btnFirst) btnFirst.disabled = (currentPage === 1);
    if(btnPrev) btnPrev.disabled = (currentPage === 1);
    if(btnNext) btnNext.disabled = (currentPage >= maxPages || maxPages === 0);
    if(btnLast) btnLast.disabled = (currentPage >= maxPages || maxPages === 0);
}

// 5. EVENTOS DE LOS BOTONES DE PAGINACIÓN
if(btnFirst) {
    btnFirst.addEventListener('click', () => {
        currentPage = 1;
        displayPage(currentPage);
    
    });
}

if(btnPrev) {
    btnPrev.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayPage(currentPage);
        
        }
    });
}

if(btnNext) {
    btnNext.addEventListener('click', () => {
        const maxPages = Math.ceil(allHeroes.length / heroesPerPage);
        if (currentPage < maxPages) {
            currentPage++;
            displayPage(currentPage);
       
        }
    });
}

if(btnLast) {
    btnLast.addEventListener('click', () => {
        const maxPages = Math.ceil(allHeroes.length / heroesPerPage);
        currentPage = maxPages;
        displayPage(currentPage);
       
    });
}

// 6. VOLVER Y DETALLES
btnBack.addEventListener('click', () => {
    mainView.style.display = 'block';
    detailView.style.display = 'none';
});

//7. mOSTRAR el detalle del heroe 

const showHeroDetail = (hero) => {
    // 1. Cambiamos las vistas
    mainView.style.display = 'none';
    detailView.style.display = 'block';

    // 2. Ocultamos la paginación para que no moleste en el detalle
    const paginationContainer = document.querySelector('.pagination-container');
    if (paginationContainer) paginationContainer.style.display = 'none';

    // 3. Inyectamos TODA la información en el contenedor de detalle
    // Usamos la estructura de columnas que pediste
    detailContent.innerHTML = `
        <div class="full-card">
            <div class="hero-sidebar">
                <img src="${hero.image.url}" class="detail-img" alt="${hero.name}">
                
                <div class="physical-info">
                    <h3>Datos Físicos</h3>
                    <p><strong>ALTURA:</strong> ${hero.appearance.height[1] || 'n/a'}</p>
                    <p><strong>PESO:</strong> ${hero.appearance.weight[1] || 'n/a'}</p>
                </div>
            </div>

            <div class="hero-main-info">
                <h2>${hero.name} <span>(${hero.biography['full-name'] || 'Identidad Desconocida'})</span></h2>
                
                <div class="editorial-tag">${hero.biography.publisher}</div>

                <div class="bio-info">
                    <h3>Biografía</h3>
                    <p><strong>ALIAS:</strong> ${hero.biography.aliases.join(', ')}</p>
                    <p><strong>LUGAR DE NACIMIENTO:</strong> ${hero.biography['place-of-birth']}</p>
                    <p><strong>OCUPACIÓN:</strong> ${hero.work.occupation}</p>
                </div>

                <div class="stats-container">
                    <h3>Estadísticas de Poder</h3>
                    <p>INTELIGENCIA: <span>${hero.powerstats.intelligence}</span></p>
                    <p>FUERZA: <span>${hero.powerstats.strength}</span></p>
                    <p>VELOCIDAD: <span>${hero.powerstats.speed}</span></p>
                    <p>COMBATE: <span>${hero.powerstats.combat}</span></p>
                </div>

                <div class="connections-info">
                    <h3>Conexiones</h3>
                    <p>${hero.connections['group-affiliation']}</p>
                </div>
            </div>
        </div>
    `;
};

// 8. Filtro alfabetico 
//  Selector del elemento de orden (asegúrate de que el ID coincida con tu HTML)
const sortSelect = document.getElementById('sort-select');

sortSelect.addEventListener('change', () => {
    const order = sortSelect.value;

    if (order === 'az') {
        allHeroes.sort((a, b) => a.name.localeCompare(b.name));
    } else if (order === 'za') {
        allHeroes.sort((a, b) => b.name.localeCompare(a.name));
    }

    currentPage = 1; // Siempre reiniciamos a la página 1 tras ordenar
    displayPage(currentPage);
});