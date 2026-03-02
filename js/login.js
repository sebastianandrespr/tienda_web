document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const messageEl = document.getElementById('login-message');
            messageEl.innerText = 'Verificando datos...';
            messageEl.className = 'text-center text-sm mt-2 text-slate-500 font-bold animate-pulse';

            const formData = new FormData(e.target);
            const email = formData.get('email');
            const phone = formData.get('password'); // Password field is phone for now

            try {
                const user = await api.loginCustomer(email, phone);
                showToast(`¡Bienvenido de nuevo, ${user.nombres}!`, 'success');

                // Save session
                localStorage.setItem('user', JSON.stringify(user));

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } catch (error) {
                showToast('Credenciales incorrectas', 'error');
                messageEl.innerText = 'Error: ' + error.message;
                messageEl.className = 'text-center text-sm mt-2 text-rose-500 font-bold';
            }
        });
    }
});
