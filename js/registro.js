document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const messageEl = document.getElementById('register-message');
            messageEl.innerText = 'Registrando...';
            messageEl.className = 'text-center text-sm mt-2 text-slate-500';

            const formData = new FormData(e.target);
            const data = {
                nombres: formData.get('nombres'),
                apellidos: formData.get('apellidos'),
                email: formData.get('email'),
                telefono: formData.get('telefono')
            };

            try {
                await api.registerCustomer(data);
                messageEl.innerText = '¡Registro exitoso!';
                messageEl.className = 'text-center text-sm mt-2 text-emerald-500 font-bold';
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } catch (error) {
                messageEl.innerText = 'Error: ' + error.message;
                messageEl.className = 'text-center text-sm mt-2 text-rose-500 font-bold';
            }
        });
    }
});
