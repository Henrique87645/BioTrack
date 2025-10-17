document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('login-password');

    // --- LÓGICA PARA MOSTRAR/OCULTAR SENHA (Mantida) ---
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    // --- CORREÇÃO DEFINITIVA DO LOGIN ---
    // Define a lista correta de usuários
    const users = [
        { 
            username: 'mcurie', 
            password: 'password123', 
            fullName: 'Dr. Marie Curie', 
            role: 'Pesquisador' 
        },
        { 
            username: 'csilva', 
            password: 'password123', 
            fullName: 'Carlos Silva', 
            role: 'Cliente' 
        }
    ];

    // Força a atualização da lista de usuários no localStorage.
    // Isso garante que a lista esteja sempre correta, ignorando dados antigos.
    localStorage.setItem('users', JSON.stringify(users));
    console.log("Usuários disponíveis para login:", users); // Ajuda a depurar
    
    // --- FIM DA CORREÇÃO ---

    // Alternar entre formulários de login e cadastro
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = passwordInput.value;
    const loginError = document.getElementById('login-error');

    const availableUsers = JSON.parse(localStorage.getItem('users'));
    const user = availableUsers.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // --- NOVO: Redirecionamento baseado no perfil ---
        if (user.role === 'Pesquisador') {
            window.location.href = 'dashboard.html';
        } else if (user.role === 'Cliente') {
            window.location.href = 'client-dashboard.html';
        } else {
            // Fallback para uma página genérica se houver outros perfis
            window.location.href = 'dashboard.html';
        }
        
    } else {
        loginError.classList.remove('hidden');
    }
});

    // Processar cadastro (simplificado)
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Funcionalidade de cadastro ainda não implementada.');
    });
});