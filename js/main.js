document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Proteção de rota: se não houver usuário, volta para o login
    if (!currentUser && !window.location.pathname.endsWith('login.html')) {
        window.location.href = 'login.html';
        return;
    }
    
    // Se o usuário já está logado e tenta acessar a página de login, redireciona para o dashboard
    if (currentUser && window.location.pathname.endsWith('login.html')) {
        window.location.href = 'dashboard.html';
        return;
    }

    // Só executa o resto do script se não estiver na página de login
    if (!window.location.pathname.endsWith('login.html')) {
        loadHeader(currentUser);
        loadSidebar(currentUser);
        initializeGlobalEventListeners();
        highlightActiveLink();
    }
});

function loadHeader(user) {
    const headerContainer = document.getElementById('main-header');
    if (!headerContainer) return;
    
    headerContainer.innerHTML = `
        <div class="flex items-center">
            <svg class="logo-dna-leaf text-green-600" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M60,10 C40,30 40,70 60,90" stroke="currentColor" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M40,10 C60,30 60,70 40,90" stroke="currentColor" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M50,10 C55,30 45,30 50,50 C45,70 55,70 50,90" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="5,5"/><path d="M50,2 C70,20 85,40 50,50 C15,40 30,20 50,2" fill="currentColor" opacity="0.4"/></svg>
            <h1 class="text-2xl font-bold text-custom ml-2 hidden sm:block">BioTrack</h1>
        </div>
        <div class="relative w-1/3">
            <input type="text" id="globalSearchInput" placeholder="Filtrar projetos no dashboard..." class="w-full bg-custom border border-custom rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-custom">
            <i class="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
        <div class="flex items-center space-x-4">
            <div class="flex items-center">
                <i class="fas fa-sun text-yellow-500"></i>
                <div class="relative inline-block w-10 mx-2 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" name="toggle" id="dark-mode-toggle" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                    <label for="dark-mode-toggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                </div>
                <i class="fas fa-moon text-gray-400"></i>
            </div>
            <button id="logout-btn" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 text-sm">
                <i class="fas fa-sign-out-alt sm:mr-2"></i><span class="hidden sm:inline">Sair</span>
            </button>
        </div>
    `;
}

function loadSidebar(user) {
    const sidebarContainer = document.getElementById('main-sidebar');
    if (!sidebarContainer) return;

    // --- HTML para cada seção da Sidebar ---
    const adminSection = `
        <div class="px-4 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase">Admin & Pesquisa</div>
        <a href="dashboard.html" class="sidebar-link flex items-center px-4 py-2 text-custom rounded-lg hover:bg-green-50 dark:hover:bg-green-800/20" data-page="dashboard"><i class="fas fa-tachometer-alt w-6 h-6 sidebar-icon text-green-500"></i><span class="ml-3 hidden lg:inline">Dashboard</span></a>
        <a href="eln.html" class="sidebar-link flex items-center px-4 py-2 text-custom rounded-lg hover:bg-green-50 dark:hover:bg-green-800/20" data-page="eln"><i class="fas fa-book w-6 h-6 sidebar-icon text-green-500"></i><span class="ml-3 hidden lg:inline">Caderno (ELN)</span></a>
        <a href="inventory.html" class="sidebar-link flex items-center px-4 py-2 text-custom rounded-lg hover:bg-green-50 dark:hover:bg-green-800/20" data-page="inventory"><i class="fas fa-boxes-stacked w-6 h-6 sidebar-icon text-green-500"></i><span class="ml-3 hidden lg:inline">Inventário</span></a>
        <a href="protocols.html" class="sidebar-link flex items-center px-4 py-2 text-custom rounded-lg hover:bg-green-50 dark:hover:bg-green-800/20" data-page="protocols"><i class="fas fa-clipboard-list w-6 h-6 sidebar-icon text-green-500"></i><span class="ml-3 hidden lg:inline">Protocolos</span></a>
    `;

 const clientSection = `
        <div class="px-4 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase">Portal do Cliente</div>
        <a href="client-dashboard.html" class="sidebar-link flex items-center px-4 py-2 text-custom rounded-lg hover:bg-green-50 dark:hover:bg-green-800/20" data-page="client-dashboard">
            <i class="fas fa-home w-6 h-6 sidebar-icon text-green-500"></i><span class="ml-3 hidden lg:inline">Início</span>
        </a>
        <a href="results.html" class="sidebar-link flex items-center px-4 py-2 text-custom rounded-lg hover:bg-green-50 dark:hover:bg-green-800/20" data-page="results">
            <i class="fas fa-vial w-6 h-6 sidebar-icon text-green-500"></i><span class="ml-3 hidden lg:inline">Meus Resultados</span>
        </a>
        <a href="health-history.html" class="sidebar-link flex items-center px-4 py-2 text-custom rounded-lg hover:bg-green-50 dark:hover:bg-green-800/20" data-page="health-history">
            <i class="fas fa-chart-line w-6 h-6 sidebar-icon text-green-500"></i><span class="ml-3 hidden lg:inline">Meu Histórico</span>
        </a>
         <a href="guidelines.html" class="sidebar-link flex items-center px-4 py-2 text-custom rounded-lg hover:bg-green-50 dark:hover:bg-green-800/20" data-page="guidelines">
            <i class="fas fa-info-circle w-6 h-6 sidebar-icon text-green-500"></i><span class="ml-3 hidden lg:inline">Orientações</span>
        </a>
    `;

    const schedulingSection = `<div class="px-4 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase">Agendamentos</div>`;

    const clientAppointmentsLink = `<a href="appointments.html" class="sidebar-link flex items-center px-4 py-2 text-custom rounded-lg hover:bg-green-50 dark:hover:bg-green-800/20" data-page="appointments"><i class="fas fa-calendar-alt w-6 h-6 sidebar-icon text-green-500"></i><span class="ml-3 hidden lg:inline">Minhas Consultas</span></a>`;
    const adminAppointmentsLink = `<a href="equipment.html" class="sidebar-link flex items-center px-4 py-2 text-custom rounded-lg hover:bg-green-50 dark:hover:bg-green-800/20" data-page="equipment"><i class="fas fa-microscope w-6 h-6 sidebar-icon text-green-500"></i><span class="ml-3 hidden lg:inline">Equipamentos</span></a>`;

    // Lógica para construir a Sidebar
    let navContent = '';
    if (user.role === 'Pesquisador') {
        navContent += adminSection;
        navContent += schedulingSection;
        navContent += adminAppointmentsLink;
    } else if (user.role === 'Cliente') {
        navContent += clientSection;
        navContent += schedulingSection;
        navContent += clientAppointmentsLink;
    }

    // Seção do Perfil
    let avatarSrc = user.avatar || `https://placehold.co/100x100/A0A0A0/FFFFFF?text=${user.fullName.split(' ').map(n=>n[0]).join('')}`;
    const profileSection = `
        <div class="p-4 border-t border-custom">
            <a href="profile.html" class="sidebar-link flex items-center rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-700/50" data-page="profile">
                <img class="h-10 w-10 rounded-full object-cover" src="${avatarSrc}" alt="Avatar">
                <div class="ml-3 hidden lg:inline">
                    <p class="text-sm font-semibold text-custom">${user.fullName}</p>
                    <p class="text-xs text-gray-400">${user.role}</p>
                </div>
            </a>
        </div>
    `;

    // Montagem Final
    sidebarContainer.innerHTML = `
        <nav class="flex-1 px-2 py-2 space-y-1">${navContent}</nav>
        ${profileSection}
    `;
}

function initializeGlobalEventListeners() {
    // Lógica de Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    }

    // Lógica de Dark Mode
    const htmlEl = document.documentElement;
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    if (localStorage.getItem('theme') === 'dark') {
        htmlEl.classList.add('dark');
        if (darkModeToggle) darkModeToggle.checked = true;
    } else {
        htmlEl.classList.remove('dark');
        if (darkModeToggle) darkModeToggle.checked = false;
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', () => {
            htmlEl.classList.toggle('dark');
            localStorage.setItem('theme', htmlEl.classList.contains('dark') ? 'dark' : 'light');
        });
    }
}

function highlightActiveLink() {
    const currentPage = window.location.pathname.split("/").pop().replace('.html', '');
    const activeLink = document.querySelector(`.sidebar-link[data-page="${currentPage}"]`);
    if (activeLink) {
        activeLink.classList.add('bg-green-100', 'dark:bg-green-800/30');
    }
}

// Funções utilitárias para Modals (devem ser chamadas dentro dos scripts de cada página)
function setupModals() {
    document.querySelectorAll('.close-modal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            closeModal(e.target.closest('.modal-backdrop'));
        });
    });

    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                closeModal(backdrop);
            }
        });
    });
}

function closeModal(modal) {
    if (modal) {
        modal.classList.add('hidden');
        const form = modal.querySelector('form');
        if (form) form.reset();
    }
}