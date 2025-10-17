document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const elnModal = document.getElementById('elnModal');
    const elnForm = document.getElementById('elnForm');
    const elnTableBody = document.getElementById('elnTableBody');
    let timerInterval;
    let timerSeconds = 0;

    let elnData = JSON.parse(localStorage.getItem('elnData')) || [
        {id: 1, title: 'Clonagem do Gene Y em pET-28a', author: 'Dr. Alan Turing', date: '2025-10-15', status: 'Revisado', content: 'Procedimento de clonagem utilizando digestão enzimática e ligação.'}
    ];

    document.getElementById('addElnEntryBtn').addEventListener('click', () => {
        elnForm.reset();
        document.getElementById('elnEditId')?.remove();
        elnModal.classList.remove('hidden');
    });

    document.querySelector('.eln-tool-btn[data-tool="timer"]').addEventListener('click', () => {
        const timerDisplay = document.getElementById('eln-timer-display');
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
            timerDisplay.classList.remove('text-green-500', 'font-bold');
        } else {
            timerDisplay.classList.add('text-green-500', 'font-bold');
            timerInterval = setInterval(() => {
                timerSeconds++;
                const h = Math.floor(timerSeconds/3600).toString().padStart(2,'0');
                const m = Math.floor((timerSeconds%3600)/60).toString().padStart(2,'0');
                const s = (timerSeconds%60).toString().padStart(2,'0');
                timerDisplay.textContent = `${h}:${m}:${s}`;
            }, 1000);
        }
    });

    elnForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const editIdInput = document.getElementById('elnEditId');
        if (editIdInput) {
            const id = parseInt(editIdInput.value);
            const entry = elnData.find(e => e.id === id);
            entry.title = document.getElementById('elnTitle').value;
            entry.content = document.getElementById('elnContent').value;
        } else {
            const newEntry = {
                id: elnData.length > 0 ? Math.max(...elnData.map(e => e.id)) + 1 : 1,
                title: document.getElementById('elnTitle').value,
                author: currentUser.fullName,
                date: new Date().toISOString().slice(0, 10),
                status: 'Em Progresso',
                content: document.getElementById('elnContent').value
            };
            elnData.unshift(newEntry);
        }
        localStorage.setItem('elnData', JSON.stringify(elnData));
        renderEln();
        closeModal(elnModal);
    });

    elnTableBody.addEventListener('click', e => {
        const target = e.target.closest('button');
        if (!target) return;
        const id = parseInt(target.dataset.id);
        if (target.classList.contains('delete-eln-btn')) {
            elnData = elnData.filter(e => e.id !== id);
            localStorage.setItem('elnData', JSON.stringify(elnData));
            renderEln();
        } else if (target.classList.contains('edit-eln-btn')) {
            const entry = elnData.find(e => e.id === id);
            if (entry) {
                let hiddenInput = document.getElementById('elnEditId');
                if (!hiddenInput) {
                    hiddenInput = document.createElement('input');
                    hiddenInput.type = 'hidden';
                    hiddenInput.id = 'elnEditId';
                    elnForm.appendChild(hiddenInput);
                }
                hiddenInput.value = entry.id;
                document.getElementById('elnTitle').value = entry.title;
                document.getElementById('elnContent').value = entry.content;
                elnModal.classList.remove('hidden');
            }
        }
    });
    
    function renderEln() {
        elnTableBody.innerHTML = '';
        elnData.forEach(entry => {
            const statusColor = entry.status === 'Revisado' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800';
            elnTableBody.innerHTML += `<tr class="hover:bg-gray-50 dark:hover:bg-gray-700/20 border-b border-custom"><td class="p-2 font-semibold">${entry.title}</td><td class="p-2">${entry.author}</td><td class="p-2">${entry.date}</td><td class="p-2"><span class="px-2 py-1 text-xs font-semibold rounded-full ${statusColor}">${entry.status}</span></td><td class="p-2 text-right space-x-2"><button class="edit-eln-btn text-blue-500 hover:text-blue-700" data-id="${entry.id}" title="Editar"><i class="fas fa-edit"></i></button><button class="delete-eln-btn text-red-500 hover:text-red-700" data-id="${entry.id}" title="Excluir"><i class="fas fa-trash"></i></button></td></tr>`;
        });
    }
    
    renderEln();
    setupModals();
});