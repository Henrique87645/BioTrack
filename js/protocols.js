document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const protocolModal = document.getElementById('protocolModal');
    const protocolForm = document.getElementById('protocolForm');
    const protocolTableBody = document.getElementById('protocolTableBody');

    let protocolsData = JSON.parse(localStorage.getItem('protocolsData')) || [
        {id: 1, name: 'Extração de Plasmídeo (Miniprep)', category: 'Biologia Molecular', version: '1.2', author: 'Dr. Alan Turing', content: 'Passo 1: Centrifugar 1.5ml de cultura bacteriana...'}
    ];

    document.getElementById('addProtocolBtn').addEventListener('click', () => {
        protocolForm.reset();
        document.getElementById('protocolEditId')?.remove();
        protocolModal.classList.remove('hidden');
    });

    protocolForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const editIdInput = document.getElementById('protocolEditId');
        if(editIdInput) {
            const id = parseInt(editIdInput.value);
            const protocol = protocolsData.find(p => p.id === id);
            protocol.name = document.getElementById('protocolName').value;
            protocol.category = document.getElementById('protocolCategory').value;
            protocol.content = document.getElementById('protocolContent').value;
            protocol.version = (parseFloat(protocol.version) + 0.1).toFixed(1);
        } else {
            const newProtocol = {
                id: protocolsData.length > 0 ? Math.max(...protocolsData.map(p => p.id)) + 1 : 1,
                name: document.getElementById('protocolName').value,
                category: document.getElementById('protocolCategory').value,
                version: '1.0',
                author: currentUser.fullName,
                content: document.getElementById('protocolContent').value
            };
            protocolsData.unshift(newProtocol);
        }
        localStorage.setItem('protocolsData', JSON.stringify(protocolsData));
        renderProtocols();
        closeModal(protocolModal);
        this.reset();
    });

    protocolTableBody.addEventListener('click', e => {
        const target = e.target.closest('button');
        if(!target) return;
        const id = parseInt(target.dataset.id);
        if(target.classList.contains('delete-protocol-btn')) {
            protocolsData = protocolsData.filter(p => p.id !== id);
            localStorage.setItem('protocolsData', JSON.stringify(protocolsData));
            renderProtocols();
        } else if (target.classList.contains('edit-protocol-btn')) {
            const protocol = protocolsData.find(p => p.id === id);
            if(protocol) {
                let hiddenInput = document.getElementById('protocolEditId');
                if (!hiddenInput) {
                    hiddenInput = document.createElement('input');
                    hiddenInput.type = 'hidden';
                    hiddenInput.id = 'protocolEditId';
                    protocolForm.appendChild(hiddenInput);
                }
                hiddenInput.value = protocol.id;
                document.getElementById('protocolName').value = protocol.name;
                document.getElementById('protocolCategory').value = protocol.category;
                document.getElementById('protocolContent').value = protocol.content;
                protocolModal.classList.remove('hidden');
            }
        }
    });
    
    function renderProtocols() {
        protocolTableBody.innerHTML = '';
        protocolsData.forEach(p => {
             protocolTableBody.innerHTML += `<tr class="hover:bg-gray-50 dark:hover:bg-gray-700/20 border-b border-custom"><td class="p-2 font-semibold">${p.name}</td><td class="p-2">${p.category}</td><td class="p-2">${p.version}</td><td class="p-2">${p.author}</td><td class="p-2 text-right space-x-2"><button class="edit-protocol-btn text-blue-500 hover:text-blue-700" data-id="${p.id}" title="Editar/Ver"><i class="fas fa-edit"></i></button><button class="delete-protocol-btn text-red-500 hover:text-red-700" data-id="${p.id}" title="Excluir"><i class="fas fa-trash"></i></button></td></tr>`;
        });
    }

    renderProtocols();
    setupModals();
});