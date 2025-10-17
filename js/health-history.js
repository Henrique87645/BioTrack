document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'Cliente') return;

    // Carrega os agendamentos do usuário
    const userAppointments = JSON.parse(localStorage.getItem(`appointments_${currentUser.username}`)) || [];

    // Elementos da página
    const bloodTypeDisplay = document.getElementById('bloodTypeDisplay');
    const lastImcDisplay = document.getElementById('lastImcDisplay');
    const chartCanvas = document.getElementById('healthChart');

    function calculateIMC(weight, height) {
        if (!weight || !height) return 0;
        return (weight / ((height / 100) ** 2)).toFixed(2);
    }

    function renderPageData() {
        if (userAppointments.length === 0) {
            lastImcDisplay.textContent = "N/D";
            // Lógica para quando não há dados, pode mostrar uma mensagem no lugar do gráfico
            return;
        }

        // Ordena os agendamentos por data para o gráfico fazer sentido
        userAppointments.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Pega o último registro para os cards
        const lastRecord = userAppointments[userAppointments.length - 1];
        bloodTypeDisplay.textContent = lastRecord.bloodType || "N/D";
        lastImcDisplay.textContent = calculateIMC(lastRecord.weight, lastRecord.height);

        // Prepara os dados para o Chart.js
        const labels = userAppointments.map(app => new Date(app.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'}));
        const weightData = userAppointments.map(app => app.weight);
        const imcData = userAppointments.map(app => calculateIMC(app.weight, app.height));

        // Renderiza o gráfico
        new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Peso (kg)',
                        data: weightData,
                        borderColor: '#3b82f6', // Azul
                        backgroundColor: '#3b82f6',
                        yAxisID: 'y'
                    },
                    {
                        label: 'IMC',
                        data: imcData,
                        borderColor: '#22c55e', // Verde
                        backgroundColor: '#22c55e',
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: { display: true, text: 'Peso (kg)' }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: { display: true, text: 'IMC' },
                        grid: { drawOnChartArea: false } // Para não misturar as grades
                    }
                }
            }
        });
    }

    renderPageData();
});