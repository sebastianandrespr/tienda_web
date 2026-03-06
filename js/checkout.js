document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.getElementById('checkout-items');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const totalEl = document.getElementById('checkout-total');
    const confirmBtn = document.getElementById('confirm-purchase-btn');
    const btnText = document.getElementById('btn-text');
    const btnIcon = document.getElementById('btn-icon');
    const btnLoader = document.getElementById('btn-loader');
    const successModal = document.getElementById('success-modal');
    const userHeader = document.getElementById('user-header');

    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Display user in header
    if (userHeader) {
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

    // Load cart
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
        window.location.href = 'carrito.html';
        return;
    }

    // Render items summary
    itemsContainer.innerHTML = cart.map(item => `
        <div class="flex items-center gap-4 group">
            <div class="size-14 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                <img src="${item.imagen_url || 'https://via.placeholder.com/100'}" class="size-full object-cover group-hover:scale-110 transition-transform" onerror="this.src='https://via.placeholder.com/100?text=S/I'">
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-bold truncate">${item.nombre}</p>
                <p class="text-xs text-slate-500 font-medium">Cant: ${item.quantity} x $${item.precio.toLocaleString()}</p>
            </div>
            <p class="text-sm font-black">$${(item.precio * item.quantity).toLocaleString()}</p>
        </div>
    `).join('');

    const total = cart.reduce((acc, item) => acc + (item.precio * item.quantity), 0);
    subtotalEl.innerText = `$${total.toLocaleString()}`;
    totalEl.innerText = `$${total.toLocaleString()}`;

    // Handle purchase confirmation
    confirmBtn.addEventListener('click', async () => {
        try {
            // Get selected payment method
            const metodoPago = document.querySelector('input[name="metodo_pago"]:checked').value.toUpperCase();
            // Default status for new sales
            const estado = 'PENDIENTE';

            // Start loading UI
            confirmBtn.disabled = true;
            btnText.innerText = 'Procesando...';
            btnIcon.classList.add('hidden');
            btnLoader.classList.remove('hidden');

            // 1. Create Sale (Venta)
            const saleData = {
                id_cliente: user.id_cliente,
                fecha: new Date().toISOString(),
                total: total,
                estado: estado,
                metodo_pago: metodoPago
            };

            const saleResponse = await api.createSale(saleData);
            const saleId = saleResponse.id_venta;

            // 2. Create Details (Detalle Venta)
            // We'll use Promise.all to handle multiple requests if needed, 
            // but for safety in class projects, simple loop or bulk insert if API supports it.
            // Supabase API supports bulk insert by passing an array.
            const detailsData = cart.map(item => ({
                id_venta: saleId,
                id_producto: item.id_producto,
                cantidad: item.quantity,
                precio_unitario: item.precio,
                subtotal: item.precio * item.quantity
            }));

            await api.createSaleDetail(detailsData);

            // 3. Success!
            localStorage.removeItem('cart');
            successModal.classList.remove('hidden');
            successModal.classList.add('flex');

            showToast('¡Compra finalizada con éxito!', 'success');

        } catch (error) {
            console.error('Checkout error:', error);
            showToast('Error al procesar la compra: ' + error.message, 'error');

            // Revert UI
            confirmBtn.disabled = false;
            btnText.innerText = 'Confirmar y Pagar';
            btnIcon.classList.remove('hidden');
            btnLoader.classList.add('hidden');
        }
    });
});
