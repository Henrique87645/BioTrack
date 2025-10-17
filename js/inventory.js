document.addEventListener('DOMContentLoaded', function() {
    const inventoryModal = document.getElementById('inventoryModal');
    const qrCodeModal = document.getElementById('qrCodeModal');
    const qrcodeContainer = document.getElementById('qrcode-container');
    let qrCodeInstance = new QRCode(qrcodeContainer, { width: 128, height: 128 });
    
    // Simulação de banco de dados
    let inventoryData = JSON.parse(localStorage.getItem('inventoryData')) || [
        { id: 'RE-015', name: 'Etanol Absoluto P.A.', type: 'Reagente', lot: '2025A', expiry: '2026-12-31', location: 'Armário 1', quantity: '2L' },
        { id: 'PL-001', name: 'pET-28a(+) com Gene X', type: 'Amostra', lot: 'N/A', expiry: '2025-10-20', location: 'F-80.P1.C5.A1', quantity: '10ul' },
    ];

    document.getElementById('addInventoryItemBtn').addEventListener('click', () => {
        inventoryModal.classList.remove('hidden');
    });
    
    document.getElementById('inventoryForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const newItem = {
            id: `ITM-${Math.floor(Math.random()*9000)+1000}`,
            name: document.getElementById('itemName').value,
            type: document.getElementById('itemType').value,
            lot: document.getElementById('itemLot').value,
            expiry: document.getElementById('itemExpiry').value,
            location: document.getElementById('itemLocation').value,
            quantity: document.getElementById('itemQuantity').value,
        };
        inventoryData.unshift(newItem);
        localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
        renderInventory();
        closeModal(inventoryModal);
        
        const qrText = `ID: ${newItem.id}\nNome: ${newItem.name}\nLocal: ${newItem.location}`;
        qrCodeInstance.makeCode(qrText);
        document.getElementById('qrcode-item-name').textContent = newItem.name;
        qrCodeModal.classList.remove('hidden');
        this.reset();
    });

    function renderInventory() {
        const body = document.getElementById('inventoryTableBody');
        body.innerHTML = '';
        inventoryData.forEach(item => {
            const isExpired = item.expiry && new Date(item.expiry) < new Date();
            const expiryClass = isExpired ? 'text-red-500 font-bold' : '';
            body.innerHTML += `<tr class="hover:bg-gray-50 dark:hover:bg-gray-700/20 border-b border-custom"><td class="p-2 font-mono">${item.id}</td><td class="p-2">${item.name}</td><td class="p-2">${item.lot}</td><td class="p-2 ${expiryClass}">${item.expiry || 'N/A'}</td><td class="p-2">${item.location}</td><td class="p-2">${item.quantity}</td></tr>`;
        });
    }

    renderInventory();
    setupModals(); // Configura os botões de fechar dos modais
});