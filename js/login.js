document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const messageEl = document.getElementById('login-message');
            messageEl.innerText = 'Iniciando sesión...';
            messageEl.className = 'text-center text-sm mt-2 text-slate-500';

            const formData = new FormData(e.target);
            const email = formData.get('email');
            const phone = formData.get('password'); // Usando el campo password para el teléfono como solicitaste

            try {
                const user = await api.loginCustomer(email, phone);
                messageEl.innerText = `¡Bienvenido, ${user.nombres}!`;
                messageEl.className = 'text-center text-sm mt-2 text-emerald-500 font-bold';

                // Guardar sesión simple
                localStorage.setItem('user', JSON.stringify(user));

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } catch (error) {
                messageEl.innerText = 'Error: ' + error.message;
                messageEl.className = 'text-center text-sm mt-2 text-rose-500 font-bold';
            }
        });
    }
});
