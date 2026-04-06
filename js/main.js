/**
 * Lógica y motor aplicado para la web (Versión API Akabab). 
 */

// --- 1. CONFIGURACIÓN Y VARIABLES ---
const BASE_URL = `https://akabab.github.io/superhero-api/api/all.json`;

let currentPage = 1; 
const heroesPerPage = 18; 
let allHeroes = [];      // Aquí guardaremos TODOS los héroes de DC
let filteredHeroes = []; // Aquí guardaremos los resultados de la búsqueda actual

// --- 2. SELECTORES DE ELEMENTOS ---
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const mainView = document.getElementById('main-view');
const detailView = document.getElementById('detail-view');
const resultsGrid = document.getElementById('results-grid');
const totalCountSpan = document.getElementById('total-count');
const detailContent = document.getElementById('character-detail-content');
const btnBack = document.getElementById('back-to-results');

const btnFirst = document.getElementById('btn-first');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const btnLast = document.getElementById('btn-last');
const pageCurrentText = document.getElementById('page-current');
const sortSelect = document.getElementById('sort-select');

// --- 3. CARGA INICIAL (FETCH) ---
// Esta API no tiene endpoint de búsqueda, así que bajamos todo al inicio
async function initApp() {
    try {
        const response = await fetch(BASE_URL);
        const data = await response.json();

        // Filtramos por DC Comics inmediatamente
        allHeroes = data.filter(hero => 
            hero.biography.publisher && hero.biography.publisher.includes("DC")
        );

        // Al inicio, los héroes filtrados son todos los de DC
        filteredHeroes = [...allHeroes];
        
        displayPage(1);
    } catch (error) {
        console.error("Error al cargar la API:", error);
        resultsGrid.innerHTML = "<p>Error al conectar con el servidor.</p>";
    }
}

// Llamamos a la función al cargar la página
initApp();

// --- 4. LÓGICA DE BÚSQUEDA LOCAL ---
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.toLowerCase().trim();
    
    // Filtramos sobre nuestra lista de DC ya descargada
    filteredHeroes = allHeroes.filter(hero => 
        hero.name.toLowerCase().includes(query)
    );

    if (filteredHeroes.length > 0) {
        currentPage = 1;
        displayPage(currentPage);
    } else {
        alert("No se encontraron resultados para '" + query + "' en el universo DC.");
        resultsGrid.innerHTML = "";
        totalCountSpan.innerText = "0";
    }
});

// --- 5. FUNCIONES DE PAGINACIÓN ---
function displayPage(page) {
    const startIndex = (page - 1) * heroesPerPage;
    const endIndex = startIndex + heroesPerPage;
    const heroesToDisplay = filteredHeroes.slice(startIndex, endIndex);
    
    renderResults(heroesToDisplay);
    updatePaginationControls();
}

const renderResults = (heroes) => {
    mainView.style.display = 'block';
    detailView.style.display = 'none';
    
    const paginationContainer = document.querySelector('.pagination-container');
    if (paginationContainer) paginationContainer.style.display = 'flex';

    totalCountSpan.innerText = filteredHeroes.length;
    resultsGrid.innerHTML = "";

    heroes.forEach(hero => {
        const card = document.createElement('div');
        card.classList.add('mini-card');
        
        // En esta API la ruta es images.md o images.sm
        const heroImg = hero.images.md || 'https://via.placeholder.com/150';

        card.innerHTML = `
            <img src="${heroImg}" alt="${hero.name}" loading="lazy">
            <h4>${hero.name}</h4>
        `;
        
        card.addEventListener('click', () => {
            if (paginationContainer) paginationContainer.style.display = 'none';
            showHeroDetail(hero);
        });

        resultsGrid.appendChild(card);
    });
};

function updatePaginationControls() {
    const maxPages = Math.ceil(filteredHeroes.length / heroesPerPage);
    if(pageCurrentText) pageCurrentText.innerText = `PÁGINA ${currentPage}`;
    
    if(btnFirst) btnFirst.disabled = (currentPage === 1);
    if(btnPrev) btnPrev.disabled = (currentPage === 1);
    if(btnNext) btnNext.disabled = (currentPage >= maxPages || maxPages === 0);
    if(btnLast) btnLast.disabled = (currentPage >= maxPages || maxPages === 0);
}

// --- 6. EVENTOS DE BOTONES ---
btnBack.addEventListener('click', () => {
    mainView.style.display = 'block';
    detailView.style.display = 'none';
    const paginationContainer = document.querySelector('.pagination-container');
    if (paginationContainer) paginationContainer.style.display = 'flex';
});

btnFirst?.addEventListener('click', () => { currentPage = 1; displayPage(currentPage); });
btnPrev?.addEventListener('click', () => { if (currentPage > 1) { currentPage--; displayPage(currentPage); } });
btnNext?.addEventListener('click', () => { 
    const maxPages = Math.ceil(filteredHeroes.length / heroesPerPage);
    if (currentPage < maxPages) { currentPage++; displayPage(currentPage); } 
});
btnLast?.addEventListener('click', () => { 
    const maxPages = Math.ceil(filteredHeroes.length / heroesPerPage);
    currentPage = maxPages; displayPage(currentPage); 
});

// --- 7. DETALLE DEL HÉROE ---
const showHeroDetail = (hero) => {
    mainView.style.display = 'none';
    detailView.style.display = 'block';

    detailContent.innerHTML = `
        <div class="full-card">
            <div class="hero-sidebar">
                <img src="${hero.images.lg}" class="detail-img" alt="${hero.name}">
                <div class="physical-info">
                    <h3>Datos Físicos</h3>
                    <p><strong>ALTURA:</strong> ${hero.appearance.height[1] || 'n/a'}</p>
                    <p><strong>PESO:</strong> ${hero.appearance.weight[1] || 'n/a'}</p>
                </div>
            </div>

            <div class="hero-main-info">
                <h2>${hero.name} <span>(${hero.biography.fullName || 'Identidad Desconocida'})</span></h2>
                <div class="editorial-tag">${hero.biography.publisher}</div>

                <div class="bio-info">
                    <h3>Biografía</h3>
                    <p><strong>ALIAS:</strong> ${hero.biography.aliases.join(', ') || 'Sin alias'}</p>
                    <p><strong>LUGAR DE NACIMIENTO:</strong> ${hero.biography.placeOfBirth}</p>
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
                    <p>${hero.connections.groupAffiliation}</p>
                </div>
            </div>
        </div>
    `;
};

// --- 8. FILTRO ALFABÉTICO ---
sortSelect?.addEventListener('change', () => {
    const order = sortSelect.value;
    if (order === 'az') {
        filteredHeroes.sort((a, b) => a.name.localeCompare(b.name));
    } else if (order === 'za') {
        filteredHeroes.sort((a, b) => b.name.localeCompare(a.name));
    }
    currentPage = 1;
    displayPage(currentPage);
});
