// 1. CONFIGURACIÓN Y VARIABLES
const API_TOKEN = "40e6fee2adb72187fe72fb59159e1420"; 
const BASE_URL = `https://superheroapi.com/api.php/${API_TOKEN}`;

let currentPage = 1;
const heroesPerPage = 12; 
let allHeroes = []; 

// 2. SELECTORES DE ELEMENTOS
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const mainView = document.getElementById('main-view');
const detailView = document.getElementById('detail-view');
const resultsGrid = document.getElementById('results-grid');
const totalCountSpan = document.getElementById('total-count');
const detailContent = document.getElementById('character-detail-content');
const btnBack = document.getElementById('back-to-results');

// SELECTORES DE PAGINACIÓN (Asegúrate que estos IDs coincidan con tu HTML)
const btnFirst = document.getElementById('btn-first'); // Botón <<
const btnPrev = document.getElementById('btn-prev');   // Botón <
const btnNext = document.getElementById('btn-next');   // Botón >
const btnLast = document.getElementById('btn-last');   // Botón >>
const pageCurrentText = document.getElementById('page-current');

// 3. LÓGICA DE BÚSQUEDA
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value;
    
    try {
        const response = await fetch(`${BASE_URL}/search/${query}`);
        const data = await response.json();

        if (data.response === "success") {
            // Filtrar solo por DC Comics
            allHeroes = data.results.filter(hero => 
                hero.biography.publisher && hero.biography.publisher.toUpperCase().includes("DC")
            ); 
    
            currentPage = 1; 
            displayPage(currentPage); 

        } else {
            alert("No se encontraron resultados.");
            resultsGrid.innerHTML = "";
            totalCountSpan.innerText = "0";
        }
    } catch (error) {
        console.error("Error:", error);
    }
});

// 4. FUNCIONES DE PAGINACIÓN
function displayPage(page) {
    const startIndex = (page - 1) * heroesPerPage;
    const endIndex = startIndex + heroesPerPage;
    const heroesToDisplay = allHeroes.slice(startIndex, endIndex);
    
    renderResults(heroesToDisplay); 
    updatePaginationControls();
}

const renderResults = (heroes) => {
    // 1. CONTROL DE VISTAS: Mostramos lista, ocultamos detalle
    mainView.style.display = 'block';
    detailView.style.display = 'none';
    
    // IMPORTANTE: Mostrar la paginación solo en la lista
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
        window.scrollTo(0, 0);
    });
}

if(btnPrev) {
    btnPrev.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayPage(currentPage);
            window.scrollTo(0, 0);
        }
    });
}

if(btnNext) {
    btnNext.addEventListener('click', () => {
        const maxPages = Math.ceil(allHeroes.length / heroesPerPage);
        if (currentPage < maxPages) {
            currentPage++;
            displayPage(currentPage);
            window.scrollTo(0, 0);
        }
    });
}

if(btnLast) {
    btnLast.addEventListener('click', () => {
        const maxPages = Math.ceil(allHeroes.length / heroesPerPage);
        currentPage = maxPages;
        displayPage(currentPage);
        window.scrollTo(0, 0);
    });
}

// 6. VOLVER Y DETALLES
btnBack.addEventListener('click', () => {
    mainView.style.display = 'block';
    detailView.style.display = 'none';
});

//Filtro 

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

// Selector del elemento de orden (asegúrate de que el ID coincida con tu HTML)
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