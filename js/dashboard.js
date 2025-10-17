document.addEventListener('DOMContentLoaded', function() {
    // Carrega dados de outros "módulos" do localStorage
    const inventoryData = JSON.parse(localStorage.getItem('inventoryData')) || [];
    const equipmentData = JSON.parse(localStorage.getItem('equipmentData')) || [];
    
    // Elementos da página
    const searchInput = document.getElementById('globalSearchInput');
    const projectsContainer = document.getElementById('recent-projects-container');

    const recentProjectsData = [
        { 
            title: 'Edição Genômica com CRISPR-Cas9', 
            university: 'Universidade de Harvard', 
            description: 'Estudo pioneiro utilizando CRISPR para corrigir mutações genéticas.', 
            image: 'https://placehold.co/600x400/22c55e/ffffff?text=CRISPR',
            url: 'https://www.harvard.edu/'
        },
        { 
            title: 'Impacto das Mudanças Climáticas em Corais', 
            university: 'Instituto Oceanográfico de Woods Hole', 
            description: 'Análise do branqueamento de corais e o efeito da acidificação dos oceanos.', 
            image: 'https://placehold.co/600x400/3b82f6/ffffff?text=Coral',
            url: 'https://www.whoi.edu/'
        },
        { 
            title: 'Desenvolvimento de Vacinas de mRNA', 
            university: 'BioNTech/Pfizer', 
            description: 'Pesquisa sobre a plataforma de RNA mensageiro para imunização rápida.', 
            image: 'https://placehold.co/600x400/8b5cf6/ffffff?text=mRNA',
            url: 'https://www.biontech.com/'
        },
        { 
            title: 'Sequenciamento do Genoma Neandertal', 
            university: 'Instituto Max Planck', 
            description: 'Mapeamento genético de hominídeos antigos para entender a evolução humana.', 
            image: 'https://placehold.co/600x400/f97316/ffffff?text=Genoma',
            url: 'https://www.mpg.de/en'
        }
    ];

    // Função que renderiza os projetos na tela
    function renderRecentProjects(projectsToRender) {
        if (!projectsContainer) return;
        
        // Se não houver projetos para renderizar, mostra uma mensagem
        if (projectsToRender.length === 0) {
            projectsContainer.innerHTML = `<div class="card-custom p-6 rounded-lg shadow-md text-center text-gray-500">Nenhum projeto encontrado.</div>`;
            return;
        }

        projectsContainer.innerHTML = projectsToRender.map(p => `
            <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="block transform hover:-translate-y-1 transition-transform duration-300">
                <div class="card-custom rounded-lg shadow-md overflow-hidden h-full">
                    <img src="${p.image}" class="w-full h-40 object-cover">
                    <div class="p-4 flex flex-col">
                        <h4 class="text-lg font-bold text-custom">${p.title}</h4>
                        <p class="text-sm text-green-500 font-semibold mt-1">${p.university}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2 flex-grow">${p.description}</p>
                    </div>
                </div>
            </a>`).join('');
    }

    // Lógica do filtro de busca
    if (searchInput) {
        searchInput.addEventListener('keyup', () => {
            const searchTerm = searchInput.value.toLowerCase();

            const filteredProjects = recentProjectsData.filter(project => {
                const titleMatch = project.title.toLowerCase().includes(searchTerm);
                const universityMatch = project.university.toLowerCase().includes(searchTerm);
                const descriptionMatch = project.description.toLowerCase().includes(searchTerm);
                return titleMatch || universityMatch || descriptionMatch;
            });

            renderRecentProjects(filteredProjects);
        });
    }

    // Função para renderizar os alertas do dashboard
    function renderDashboardAlerts() {
        const lowStockItem = inventoryData.find(item => item.name.includes('Etanol'));
        const lowStockEl = document.getElementById('low-stock-alerts');
        if (lowStockEl && lowStockItem) {
            lowStockEl.textContent = `${lowStockItem.name} (${lowStockItem.quantity} restantes)`;
        }

        const scheduledItem = equipmentData.find(item => item.status === 'Em uso');
        const scheduleEl = document.getElementById('equipment-schedule');
        if (scheduleEl && scheduledItem) {
            scheduleEl.innerHTML = `<span class="font-semibold text-blue-500">${scheduledItem.name}:</span> Em uso por ${scheduledItem.reservedBy}`;
        }
    }

    // Renderização inicial
    renderRecentProjects(recentProjectsData);
    renderDashboardAlerts();
});