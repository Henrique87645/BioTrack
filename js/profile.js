document.addEventListener('DOMContentLoaded', function() {
    // Carrega o usuário atual do localStorage
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    // Elementos da página
    const profileForm = document.getElementById('profileForm');
    const fullNameInput = document.getElementById('fullName');
    const dateOfBirthInput = document.getElementById('dateOfBirth');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const newPasswordInput = document.getElementById('newPassword');
    
    const avatarUploadInput = document.getElementById('avatarUpload');
    const profileAvatarImg = document.getElementById('profileAvatar');
    const profileFullNameDisplay = document.getElementById('profileFullNameDisplay');
    const profileRoleDisplay = document.getElementById('profileRoleDisplay');

    // Função para carregar os dados do usuário nos campos do formulário
    function loadUserData() {
        // Carrega as informações existentes ou deixa em branco
        fullNameInput.value = currentUser.fullName || '';
        dateOfBirthInput.value = currentUser.dateOfBirth || '';
        emailInput.value = currentUser.email || '';
        phoneInput.value = currentUser.phone || '';

        // Exibe o nome e o cargo no cabeçalho do perfil
        profileFullNameDisplay.textContent = currentUser.fullName;
        profileRoleDisplay.textContent = currentUser.role;
        
        // Carrega a foto do perfil, se existir
        profileAvatarImg.src = currentUser.avatar || `https://placehold.co/100x100/A0A0A0/FFFFFF?text=${currentUser.fullName.split(' ').map(n=>n[0]).join('')}`;
    }

    // Evento para o envio do formulário
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Atualiza os dados do objeto currentUser com os valores dos inputs
        currentUser.fullName = fullNameInput.value;
        currentUser.dateOfBirth = dateOfBirthInput.value;
        currentUser.email = emailInput.value;
        currentUser.phone = phoneInput.value;
        
        // Altera a senha apenas se um novo valor for inserido
        if (newPasswordInput.value) {
            currentUser.password = newPasswordInput.value;
            // Atualiza também a lista geral de usuários para consistência do login
            let allUsers = JSON.parse(localStorage.getItem('users'));
            let userIndex = allUsers.findIndex(u => u.username === currentUser.username);
            if (userIndex !== -1) {
                allUsers[userIndex].password = newPasswordInput.value;
                localStorage.setItem('users', JSON.stringify(allUsers));
            }
        }
        
        // Salva o objeto do usuário atualizado no localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Limpa o campo de senha por segurança
        newPasswordInput.value = '';

        // Atualiza a interface
        loadUserData();
        updateSidebarUser();

        // Exibe notificação de sucesso
        Toastify({
            text: "Perfil atualizado com sucesso!",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        }).showToast();
    });

    // Evento para a troca da foto de perfil (sem alterações)
    avatarUploadInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            const imageDataUrl = event.target.result;
            profileAvatarImg.src = imageDataUrl;
            currentUser.avatar = imageDataUrl;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateSidebarUser();
        };
        reader.readAsDataURL(file);
    });

    // Função para atualizar as informações na sidebar (sem alterações)
    function updateSidebarUser() {
        const sidebarAvatar = document.querySelector('#main-sidebar img');
        const sidebarUsername = document.querySelector('#main-sidebar .font-semibold');
        
        if (sidebarAvatar && currentUser.avatar) sidebarAvatar.src = currentUser.avatar;
        if (sidebarUsername) sidebarUsername.textContent = currentUser.fullName;
    }

    // Carrega os dados do usuário quando a página é aberta
    loadUserData();
});