document.addEventListener('DOMContentLoaded', () => {
    const itemsList = document.getElementById('cart-items-list');
    const subtotalEl = document.getElementById('summary-subtotal');
    const totalEl = document.getElementById('summary-total');
    const cartContent = document.getElementById('cart-content');
    const emptyMessage = document.getElementById('empty-cart-message');

    function renderCart() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');

        if (cart.length === 0) {
            cartContent.style.display = 'none';
            emptyMessage.style.display = 'block';
            return;
        }

        cartContent.style.display = 'grid';
        emptyMessage.style.display = 'none';

        itemsList.innerHTML = cart.map((item, index) => `
            <li class="flex py-6">
                <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                    <img class="h-full w-full object-cover object-center" src="${item.imagen_url || 'https://via.placeholder.com/400'}" alt="${item.nombre}">
                </div>
                <div class="ml-4 flex flex-1 flex-col">
                    <div>
                        <div class="flex justify-between text-base font-semibold text-slate-900 dark:text-white">
                            <h3>${item.nombre}</h3>
                            <p class="ml-4">$${(item.precio * item.quantity).toFixed(2)}</p>
                        </div>
                    </div>
                    <div class="flex flex-1 items-end justify-between text-sm">
                        <div class="flex items-center gap-2">
                            <div class="flex items-center rounded-lg border border-slate-200 dark:border-slate-700">
                                <button onclick="updateQuantity(${index}, -1)" class="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-l-lg">-</button>
                                <span class="w-10 text-center text-sm">${item.quantity}</span>
                                <button onclick="updateQuantity(${index}, 1)" class="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-r-lg">+</button>
                            </div>
                        </div>
                        <div class="flex">
                            <button onclick="removeItem(${index})" class="flex items-center gap-1 font-medium text-primary hover:text-primary/80 transition-colors" type="button">
                                <span class="material-symbols-outlined text-lg">delete</span>
                                Quitar
                            </button>
                        </div>
                    </div>
                </div>
            </li>
        `).join('');

        const subtotal = cart.reduce((acc, item) => acc + (item.precio * item.quantity), 0);
        subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
        totalEl.innerText = `$${(subtotal + 5).toFixed(2)}`; // $5 shipping
    }

    window.updateQuantity = (index, delta) => {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart[index].quantity += delta;
        if (cart[index].quantity < 1) cart[index].quantity = 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    };

    window.removeItem = (index) => {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    };

    renderCart();
});
