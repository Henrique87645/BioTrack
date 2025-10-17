document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'Cliente') return;

    // --- Elementos da Página ---
    const welcomeMessageEl = document.getElementById('welcomeMessage');
    const healthNewsContainer = document.getElementById('health-news-container');
    const nextAppointmentEl = document.getElementById('nextAppointment');
    const lastResultEl = document.getElementById('lastResult');

    // --- Dados Visuais (Notícias) ---
    const healthNewsData = [
        { 
            title: 'A Importância da Hidratação Diária para a Saúde', 
            source: 'Organização Mundial da Saúde', 
            description: 'Beber água regularmente é crucial para a função renal, regulação da temperatura corporal e saúde da pele. Descubra a quantidade ideal para você.', 
            image: 'https://placehold.co/600x400/3b82f6/ffffff?text=Hidratação'
        },
        { 
            title: '5 Benefícios da Caminhada Regular para o Coração', 
            source: 'Fundação Britânica do Coração', 
            description: 'A atividade física moderada, como a caminhada, pode reduzir significativamente o risco de doenças cardiovasculares, controlar a pressão arterial e melhorar o humor.',
            image: 'https://placehold.co/600x400/22c55e/ffffff?text=Caminhada'
        }
    ];

    // --- Lógica para Popular a Página ---

    // 1. Mensagem de Boas-Vindas
    const userFirstName = currentUser.fullName.split(' ')[0];
    welcomeMessageEl.textContent = `Bem-vindo(a) de volta, ${userFirstName}!`;

    // 2. Renderizar Notícias
    function renderHealthNews() {
        healthNewsContainer.innerHTML = healthNewsData.map(news => `
            <div class="card-custom rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
                <img src="${news.image}" class="w-full md:w-48 h-32 md:h-auto object-cover">
                <div class="p-4 flex flex-col justify-between">
                    <div>
                        <p class="text-sm text-green-500 font-semibold">${news.source}</p>
                        <h4 class="text-lg font-bold text-custom mt-1">${news.title}</h4>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">${news.description}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 3. Popular Cards de Resumo Rápido (de forma visual)
    function renderSummary() {
        const userAppointments = JSON.parse(localStorage.getItem(`appointments_${currentUser.username}`)) || [];
        const allResults = JSON.parse(localStorage.getItem('allResults')) || {}; // Supondo que você crie isso no futuro
        const userResults = allResults[currentUser.username] || [];

        // Próxima consulta
        const futureAppointments = userAppointments
            .filter(app => new Date(app.date) >= new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date));
            
        if (futureAppointments.length > 0) {
            nextAppointmentEl.textContent = `Agendada para ${new Date(futureAppointments[0].date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}.`;
        }

        // Último resultado (apenas visual)
        if (userResults.length > 0) {
            lastResultEl.textContent = `Disponível para consulta na página "Meus Resultados".`;
        }
    }

    // --- Execução ---
    renderHealthNews();
    renderSummary();
});