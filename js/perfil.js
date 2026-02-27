document.addEventListener('DOMContentLoaded', async () => {
    const profileForm = document.getElementById('profile-form');
    const messageEl = document.getElementById('profile-message');
    const logoutBtn = document.getElementById('logout-btn');

    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Fill form with current data
    const fillForm = (userData) => {
        document.getElementById('nombres').value = userData.nombres || '';
        document.getElementById('apellidos').value = userData.apellidos || '';
        document.getElementById('email').value = userData.email || '';
        document.getElementById('telefono').value = userData.telefono || '';
        document.getElementById('documento').value = userData.documento || '';
        document.getElementById('direccion').value = userData.direccion || '';
    };

    fillForm(user);

    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        });
    }

    // Handle form submission
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            messageEl.innerText = 'Guardando cambios...';
            messageEl.className = 'text-center text-sm mt-4 text-slate-500';

            const formData = new FormData(e.target);
            const updatedData = {
                nombres: formData.get('nombres'),
                apellidos: formData.get('apellidos'),
                telefono: formData.get('telefono'),
                documento: formData.get('documento'),
                direccion: formData.get('direccion')
            };

            try {
                const updatedUser = await api.updateCustomer(user.id_cliente, updatedData);

                // Merge updated fields into current user object to keep other fields (like id, etc.)
                const newUser = { ...user, ...updatedUser };
                localStorage.setItem('user', JSON.stringify(newUser));

                messageEl.innerText = '¡Perfil actualizado con éxito!';
                messageEl.className = 'text-center text-sm mt-4 text-emerald-500 font-bold';

                // Optionally refresh placeholders
                fillForm(newUser);
            } catch (error) {
                messageEl.innerText = 'Error: ' + error.message;
                messageEl.className = 'text-center text-sm mt-4 text-rose-500 font-bold';
            }
        });
    }
});
