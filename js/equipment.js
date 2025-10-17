document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const equipmentModal = document.getElementById('equipmentModal');
    const equipmentForm = document.getElementById('equipmentForm');
    const equipmentTableBody = document.getElementById('equipmentTableBody');
    const reportProblemModal = document.getElementById('reportProblemModal');
    let equipmentToReport = null;

    let equipmentData = JSON.parse(localStorage.getItem('equipmentData')) || [
        { id: 1, name: 'Microscópio Confocal Leica', location: 'Sala 201', status: 'Disponível', nextMaintenance: '2026-01-10', reservedBy: null },
        { id: 2, name: 'Termociclador Bio-Rad', location: 'Bancada 3', status: 'Em uso', nextMaintenance: '2025-12-15', reservedBy: 'Ada Lovelace' },
        { id: 3, name: 'Centrífuga Eppendorf', location: 'Bancada 1', status: 'Manutenção', nextMaintenance: '2026-03-20', reservedBy: null, problem: 'Não está refrigerando.' },
    ];
    let usageLog = JSON.parse(localStorage.getItem('usageLog')) || [];
    
    document.getElementById('addEquipmentBtn').addEventListener('click', () => {
        equipmentForm.reset();
        document.getElementById('equipmentEditId')?.remove();
        equipmentModal.classList.remove('hidden');
    });

    equipmentTableBody.addEventListener('click', e => {
        const target = e.target.closest('button');
        if (!target) return;
        const id = parseInt(target.dataset.id);
        const equip = equipmentData.find(eq => eq.id === id);
        if (!equip) return;

        if (target.classList.contains('report-equip-btn')) {
            equipmentToReport = equip;
            document.getElementById('report-equipment-name').textContent = equipmentToReport.name;
            reportProblemModal.classList.remove('hidden');
        } else if (target.classList.contains('release-equip-btn')) {
            const startTime = equip.reservationTime || Date.now() - 3600000;
            const duration = Math.round((Date.now() - startTime) / 60000);
            usageLog.unshift({ user: currentUser.fullName, equipment: equip.name, duration, date: new Date() });
            equip.status = 'Disponível';
            equip.reservedBy = null;
            localStorage.setItem('usageLog', JSON.stringify(usageLog));
            localStorage.setItem('equipmentData', JSON.stringify(equipmentData));
            renderEquipment();
            renderUsageLog();
        } else if (target.classList.contains('reserve-equip-btn')) {
            equip.status = 'Em uso';
            equip.reservedBy = currentUser.fullName;
            equip.reservationTime = Date.now();
            localStorage.setItem('equipmentData', JSON.stringify(equipmentData));
            renderEquipment();
        }
    });
    
    document.getElementById('reportProblemForm').addEventListener('submit', e => {
        e.preventDefault();
        equipmentToReport.status = 'Manutenção';
        equipmentToReport.problem = document.getElementById('problem-description').value;
        localStorage.setItem('equipmentData', JSON.stringify(equipmentData));
        renderEquipment();
        closeModal(reportProblemModal);
        e.target.reset();
    });

    equipmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const editIdInput = document.getElementById('equipmentEditId'); // Simplificado para não precisar de CRUD completo
        const newEquipment = {
            id: equipmentData.length > 0 ? Math.max(...equipmentData.map(e => e.id)) + 1 : 1,
            name: document.getElementById('equipmentName').value,
            location: document.getElementById('equipmentLocation').value,
            status: 'Disponível',
            nextMaintenance: document.getElementById('equipmentMaintenance').value,
            reservedBy: null
        };
        equipmentData.unshift(newEquipment);
        localStorage.setItem('equipmentData', JSON.stringify(equipmentData));
        renderEquipment();
        closeModal(equipmentModal);
        this.reset();
    });
    
    function renderEquipment() {
        equipmentTableBody.innerHTML = '';
        equipmentData.forEach(eq => {
            let statusBadge = '';
            let actionButtons = '';
            switch(eq.status) {
                case 'Disponível':
                    statusBadge = '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-200 text-green-800">Disponível</span>';
                    actionButtons = `<button class="reserve-equip-btn bg-blue-500 text-white px-3 py-1 text-xs rounded hover:bg-blue-600" data-id="${eq.id}">Reservar</button>`;
                    break;
                case 'Em uso':
                     statusBadge = `<span class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-200 text-yellow-800">Em uso (${eq.reservedBy.split(' ')[0]})</span>`;
                    if (eq.reservedBy === currentUser.fullName) {
                         actionButtons = `<button class="release-equip-btn bg-yellow-500 text-white px-3 py-1 text-xs rounded hover:bg-yellow-600" data-id="${eq.id}">Liberar</button>`;
                    } else {
                         actionButtons = `<button class="bg-gray-400 text-white px-3 py-1 text-xs rounded cursor-not-allowed" disabled>Ocupado</button>`;
                    }
                    break;
                case 'Manutenção':
                    statusBadge = `<span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-200 text-red-800">Manutenção</span>`;
                    actionButtons = `<button class="bg-gray-400 text-white px-3 py-1 text-xs rounded cursor-not-allowed" disabled>Indisponível</button>`;
                    break;
            }
            equipmentTableBody.innerHTML += `<tr class="hover:bg-gray-50 dark:hover:bg-gray-700/20 border-b border-custom"><td class="p-2 font-semibold">${eq.name}</td><td class="p-2">${statusBadge}</td><td class="p-2">${eq.nextMaintenance}</td><td class="p-2 text-right space-x-2">${actionButtons}<button class="report-equip-btn text-orange-500 hover:text-orange-700" data-id="${eq.id}" title="Reportar Problema"><i class="fas fa-triangle-exclamation"></i></button></td></tr>`;
        });
    }

    function renderUsageLog() {
        const list = document.getElementById('usageLogList');
        list.innerHTML = usageLog.map(log => `<li><span class="font-semibold">${log.user}</span> usou <span class="font-semibold">${log.equipment}</span> por ${log.duration} min.</li>`).join('') || '<p class="text-gray-400">Nenhum registro de uso.</p>';
    }

    renderEquipment();
    renderUsageLog();
    setupModals();
});