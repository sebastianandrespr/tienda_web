document.addEventListener('DOMContentLoaded', () => {
    const itemsList = document.getElementById('cart-items-list');
    const subtotalEl = document.getElementById('summary-subtotal');
    const taxEl = document.getElementById('summary-tax');
    const totalEl = document.getElementById('summary-total');
    const cartContainer = document.getElementById('cart-container');
    const emptyMessage = document.getElementById('empty-cart-message');
    const userHeader = document.getElementById('user-header');

    // Display user in header if logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && userHeader) {
        userHeader.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="text-right">
                    <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Hola,</p>
                    <p class="text-sm font-black">${user.nombres}</p>
                </div>
                <div class="size-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 cursor-pointer hover:border-primary transition-all" onclick="location.href='perfil.html'">
                    <span class="material-symbols-outlined">person</span>
                </div>
            </div>
        `;
    }

    function renderCart() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');

        if (cart.length === 0) {
            cartContainer.style.display = 'none';
            emptyMessage.classList.remove('hidden');
            emptyMessage.style.display = 'flex';
            return;
        }

        cartContainer.style.display = 'grid';
        emptyMessage.style.display = 'none';

        itemsList.innerHTML = cart.map((item, index) => `
            <li class="flex items-center gap-6 p-6 md:p-8 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                <div class="h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 shadow-sm">
                    <img class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" src="${item.imagen_url || 'https://via.placeholder.com/400'}" alt="${item.nombre}" onerror="this.src='https://via.placeholder.com/400?text=S/I'">
                </div>
                
                <div class="flex flex-1 flex-col">
                    <div class="flex justify-between items-start">
                        <div class="space-y-1">
                            <h3 class="text-lg font-bold group-hover:text-primary transition-colors">${item.nombre}</h3>
                            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">${item.codigo || 'REF-DEFAULT'}</p>
                        </div>
                        <p class="text-xl font-black text-slate-900 dark:text-white">$${(item.precio * item.quantity).toLocaleString()}</p>
                    </div>

                    <div class="flex flex-1 items-end justify-between mt-4">
                        <div class="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 w-fit">
                            <button onclick="updateQuantity(${index}, -1)" class="size-8 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-all font-black text-lg">-</button>
                            <span class="w-8 text-center text-sm font-black">${item.quantity}</span>
                            <button onclick="updateQuantity(${index}, 1)" class="size-8 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-all font-black text-lg">+</button>
                        </div>

                        <button onclick="removeItem(${index})" class="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1.5 p-2 transition-all hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-xl" type="button">
                            <span class="material-symbols-outlined text-sm">delete_sweep</span>
                            ELIMINAR
                        </button>
                    </div>
                </div>
            </li>
        `).join('');

        const subtotal = cart.reduce((acc, item) => acc + (item.precio * item.quantity), 0);

        subtotalEl.innerText = `$${subtotal.toLocaleString()}`;
        totalEl.innerText = `$${subtotal.toLocaleString()}`;
    }

    window.updateQuantity = (index, delta) => {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart[index].quantity += delta;
        if (cart[index].quantity < 1) cart[index].quantity = 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        showToast('Cantidad actualizada', 'info');
    };

    window.removeItem = (index) => {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const name = cart[index].nombre;
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        showToast(`${name} eliminado del carrito`, 'error');
    };

    window.checkout = () => {
        if (!user) {
            showToast('Inicia sesión para finalizar tu compra', 'info');
            setTimeout(() => { window.location.href = 'login.html'; }, 2000);
            return;
        }

        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cart.length === 0) {
            showToast('Tu carrito está vacío', 'error');
            return;
        }

        window.location.href = 'checkout.html';
    };

    renderCart();
});
