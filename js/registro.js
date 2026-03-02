document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const messageEl = document.getElementById('register-message');
            messageEl.innerText = 'Creando cuenta...';
            messageEl.className = 'text-center text-sm font-bold mt-2 text-slate-500 animate-pulse';

            const formData = new FormData(e.target);
            const data = {
                nombres: formData.get('nombres'),
                apellidos: formData.get('apellidos'),
                email: formData.get('email'),
                telefono: formData.get('telefono'),
                estado: true
            };

            try {
                const user = await api.registerCustomer(data);
                showToast('¡Cuenta creada con éxito!', 'success');

                // Set flag to show profile prompt after login
                localStorage.setItem('user', JSON.stringify(Array.isArray(user) ? user[0] : user));

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } catch (error) {
                showToast('Error al registrar cuenta', 'error');
                messageEl.innerText = 'Error: ' + error.message;
                messageEl.className = 'text-center text-sm mt-2 text-rose-500 font-bold';
            }
        });
    }
});
