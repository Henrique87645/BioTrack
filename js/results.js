document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // Se não for cliente, ou não estiver logado, não faz nada.
    if (!currentUser || currentUser.role !== 'Cliente') {
        const resultsTableBody = document.getElementById('resultsTableBody');
        if (resultsTableBody) {
            resultsTableBody.innerHTML = `<tr><td colspan="4" class="text-center p-4 text-gray-500">Esta página é exclusiva para clientes.</td></tr>`;
        }
        return;
    }

    // --- Simulação de um Banco de Dados de Resultados ---
    const allResults = {
        'csilva': [
            {
                id: 'res-001',
                collectionDate: '2025-10-15',
                examName: 'Hemograma Completo',
                status: 'Disponível',
                fileUrl: '#' // Em um sistema real, seria o link para o PDF
            },
            {
                id: 'res-002',
                collectionDate: '2025-10-15',
                examName: 'Colesterol Total e Frações',
                status: 'Disponível',
                fileUrl: '#'
            },
            {
                id: 'res-003',
                collectionDate: '2025-10-28',
                examName: 'Glicemia de Jejum',
                status: 'Em processamento',
                fileUrl: null
            }
        ]
        // Resultados para outros usuários poderiam ser adicionados aqui.
    };
    // --- Fim da Simulação ---

    const userResults = allResults[currentUser.username] || [];
    const resultsTableBody = document.getElementById('resultsTableBody');

    function renderResults() {
        resultsTableBody.innerHTML = '';
        if (userResults.length === 0) {
            resultsTableBody.innerHTML = `<tr><td colspan="4" class="text-center p-4 text-gray-500">Nenhum resultado encontrado.</td></tr>`;
            return;
        }

        // Ordena os resultados pela data mais recente primeiro
        userResults.sort((a, b) => new Date(b.collectionDate) - new Date(a.collectionDate));

        userResults.forEach(result => {
            let statusBadge = '';
            let actionButton = '';

            switch(result.status) {
                case 'Disponível':
                    statusBadge = `<span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-200 text-green-800">Disponível</span>`;
                    actionButton = `<a href="${result.fileUrl}" download="Resultado_${result.examName.replace(/ /g, '_')}.pdf" class="bg-blue-500 text-white px-3 py-1 text-xs rounded hover:bg-blue-600 inline-flex items-center"><i class="fas fa-download mr-2"></i>Baixar</a>`;
                    break;
                case 'Em processamento':
                    statusBadge = `<span class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-200 text-yellow-800">Em processamento</span>`;
                    actionButton = `<button class="bg-gray-400 text-white px-3 py-1 text-xs rounded cursor-not-allowed" disabled>Aguardando</button>`;
                    break;
                default:
                    statusBadge = `<span class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-800">Pendente</span>`;
                    actionButton = `<button class="bg-gray-400 text-white px-3 py-1 text-xs rounded cursor-not-allowed" disabled>Indisponível</button>`;
                    break;
            }

            const row = `
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/20 border-b border-custom">
                    <td class="p-3 font-semibold">${new Date(result.collectionDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                    <td class="p-3">${result.examName}</td>
                    <td class="p-3">${statusBadge}</td>
                    <td class="p-3 text-right">${actionButton}</td>
                </tr>
            `;
            resultsTableBody.innerHTML += row;
        });
    }

    renderResults();
});