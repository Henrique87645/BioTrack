document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    // Elementos do formulário e tabela
    const appointmentForm = document.getElementById('appointmentForm');
    const appointmentsTableBody = document.getElementById('appointmentsTableBody');
    
    // Elementos do Modal de Confirmação
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const confirmButton = document.getElementById('confirmButton');
    const cancelButton = document.getElementById('cancelButton');
    let appointmentIdToDelete = null;

    // Carrega os agendamentos existentes do localStorage
    let userAppointments = JSON.parse(localStorage.getItem(`appointments_${currentUser.username}`)) || [];

    // Função para calcular o IMC
    function calculateIMC(weight, height) {
        if (height === 0) return 0;
        const heightInMeters = height / 100;
        return (weight / (heightInMeters * heightInMeters)).toFixed(2);
    }

    // Função para renderizar a tabela
    function renderAppointments() {
        appointmentsTableBody.innerHTML = '';
        if (userAppointments.length === 0) {
            appointmentsTableBody.innerHTML = `<tr><td colspan="6" class="text-center p-4 text-gray-500">Nenhum agendamento encontrado.</td></tr>`;
            return;
        }
        userAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));

        userAppointments.forEach(app => {
            const imc = calculateIMC(app.weight, app.height);
            const row = `
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/20 border-b border-custom">
                    <td class="p-2 font-semibold">${new Date(app.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                    <td class="p-2">${imc}</td><td class="p-2">${app.weight} kg</td><td class="p-2">${app.height} cm</td>
                    <td class="p-2">${app.bloodType}</td>
                    <td class="p-2 text-right">
                        <button class="delete-appointment-btn text-red-500 hover:text-red-700" data-id="${app.id}" title="Cancelar Agendamento">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>`;
            appointmentsTableBody.innerHTML += row;
        });
    }

    // Evento de envio do formulário
    appointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newAppointment = {
            id: Date.now(),
            date: document.getElementById('appointmentDate').value,
            weight: parseFloat(document.getElementById('weight').value),
            height: parseInt(document.getElementById('height').value),
            bloodType: document.getElementById('bloodType').value,
        };

        userAppointments.push(newAppointment);
        localStorage.setItem(`appointments_${currentUser.username}`, JSON.stringify(userAppointments));
        
        renderAppointments();
        appointmentForm.reset();

        // Mostra notificação de sucesso
        Toastify({
            text: "Agendamento realizado com sucesso!",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        }).showToast();
    });
    
    // Evento para abrir o modal de confirmação ao deletar
    appointmentsTableBody.addEventListener('click', function(e) {
        const deleteButton = e.target.closest('.delete-appointment-btn');
        if (deleteButton) {
            appointmentIdToDelete = parseInt(deleteButton.dataset.id);
            const appointment = userAppointments.find(app => app.id === appointmentIdToDelete);
            const date = new Date(appointment.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
            confirmationMessage.textContent = `Você tem certeza que deseja cancelar o agendamento do dia ${date}? Esta ação não pode ser desfeita.`;
            confirmationModal.classList.remove('hidden');
        }
    });

    // Ação do botão de confirmar no modal
    confirmButton.addEventListener('click', function() {
        if (appointmentIdToDelete) {
            userAppointments = userAppointments.filter(app => app.id !== appointmentIdToDelete);
            localStorage.setItem(`appointments_${currentUser.username}`, JSON.stringify(userAppointments));
            renderAppointments();
            confirmationModal.classList.add('hidden');
            appointmentIdToDelete = null;

            Toastify({
                text: "Agendamento cancelado.",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
            }).showToast();
        }
    });

    // Ação do botão de cancelar no modal
    cancelButton.addEventListener('click', function() {
        confirmationModal.classList.add('hidden');
        appointmentIdToDelete = null;
    });

    // Renderização inicial
    renderAppointments();
});