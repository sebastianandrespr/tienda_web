document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profile-form');
    const logoutBtn = document.getElementById('logout-btn');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Fill profile fields
    const fillFields = () => {
        if (document.getElementById('nombres')) document.getElementById('nombres').value = user.nombres || '';
        if (document.getElementById('apellidos')) document.getElementById('apellidos').value = user.apellidos || '';
        if (document.getElementById('email')) document.getElementById('email').value = user.email || '';
        if (document.getElementById('telefono')) document.getElementById('telefono').value = user.telefono || '';
        if (document.getElementById('documento')) document.getElementById('documento').value = user.documento || '';
        if (document.getElementById('direccion')) document.getElementById('direccion').value = user.direccion || '';
    };

    fillFields();

    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const msg = document.getElementById('profile-message');
            msg.innerText = 'Guardando...';

            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            try {
                const updatedUser = await api.updateCustomer(user.id_cliente, data);
                localStorage.setItem('user', JSON.stringify({ ...user, ...updatedUser }));
                showToast('Perfil actualizado correctamente', 'success');
                msg.innerText = '';
            } catch (error) {
                console.error('Update Error:', error);
                showToast('Error: ' + error.message, 'error');
                msg.innerText = '';
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('user');
            localStorage.removeItem('cart');
            window.location.href = 'index.html';
        });
    }
});

// Store wishlist locally to avoid re-fetching or passing objects in HTML
let currentWishlistData = [];

window.showSection = (section) => {
    const profileSec = document.getElementById('profile-section');
    const wishlistSec = document.getElementById('wishlist-section');
    const btnProfile = document.getElementById('btn-profile');
    const btnWishlist = document.getElementById('btn-wishlist');
    const pageTitle = document.querySelector('header h2');

    if (section === 'profile') {
        if (profileSec) profileSec.classList.remove('hidden');
        if (wishlistSec) wishlistSec.classList.add('hidden');

        btnProfile.className = "w-full flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-xl transition-colors font-semibold";
        btnWishlist.className = "w-full flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors mt-1";

        if (pageTitle) pageTitle.innerText = "Configuración de Perfil";
    } else if (section === 'wishlist') {
        if (wishlistSec) wishlistSec.classList.remove('hidden');
        if (profileSec) profileSec.classList.add('hidden');

        btnWishlist.className = "w-full flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-xl transition-colors font-semibold";
        btnProfile.className = "w-full flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors mt-1";

        if (pageTitle) pageTitle.innerText = "Mi Lista de Deseos";
        renderWishlist();
    }
};

async function renderWishlist() {
    const container = document.getElementById('wishlist-section');
    if (!container) return;

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id_cliente) return;

    container.innerHTML = `<div class="py-20 text-center"><span class="animate-spin material-symbols-outlined text-4xl text-primary">sync</span><p class="mt-4 text-slate-500 font-medium">Buscando tus favoritos...</p></div>`;

    try {
        const wishlist = await api.getWishlist(user.id_cliente);
        currentWishlistData = wishlist; // Save for later use in buttons

        if (!wishlist || wishlist.length === 0) {
            container.innerHTML = `
                <div class="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div class="size-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300">
                        <span class="material-symbols-outlined text-4xl">heart_broken</span>
                    </div>
                    <h3 class="text-xl font-bold">Tu Wishlist está vacía</h3>
                    <p class="text-slate-500 max-w-xs transition-all">Guarda los productos que más te gustan para verlos después.</p>
                    <button onclick="location.href='index.html'" class="bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">Explorar Tienda</button>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h3 class="text-2xl font-black">Mis Favoritos (${wishlist.length})</h3>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${wishlist.map((item) => {
            const p = item.producto;
            if (!p) return ''; // Skip if product data is missing
            return `
                        <div class="bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden flex shadow-sm group hover:shadow-xl hover:border-primary/30 transition-all duration-300">
                            <div class="w-1/3 aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                                <img src="${p.imagen_url || 'https://via.placeholder.com/400'}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onerror="this.src='https://via.placeholder.com/400?text=S/I'">
                            </div>
                            <div class="w-2/3 p-5 flex flex-col justify-between">
                                <div class="space-y-1">
                                    <h4 class="font-black text-sm line-clamp-1 group-hover:text-primary transition-colors">${p.nombre}</h4>
                                    <p class="text-xs text-slate-400 line-clamp-1">${p.descripcion || 'Sin descripción'}</p>
                                    <p class="text-lg font-black mt-2 text-primary">$${parseFloat(p.precio || 0).toLocaleString()}</p>
                                </div>
                                <div class="flex items-center gap-2 mt-4">
                                    <button onclick="addToCartAndRemoveFromId('${item.id_wishlist}')" class="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2.5 rounded-xl text-[10px] font-black hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all flex items-center justify-center gap-1 shadow-lg shadow-slate-200 dark:shadow-none">
                                        <span class="material-symbols-outlined text-sm">shopping_cart</span> COMPRAR
                                    </button>
                                    <button onclick="removeFromWishlist('${item.id_wishlist}')" class="size-10 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all">
                                        <span class="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
        }).join('')}
                </div>
            </div>
        `;
    } catch (err) {
        console.error('Wishlist Render Error:', err);
        container.innerHTML = `<div class="py-20 text-center"><p class="text-rose-500 font-bold">Error al cargar la lista. Por favor intenta de nuevo.</p></div>`;
    }
}

window.removeFromWishlist = async (wishlistId) => {
    try {
        await api.removeFromWishlist(wishlistId);
        showToast('Eliminado de Wishlist', 'info');
        renderWishlist();
    } catch (error) {
        showToast(error.message, 'error');
    }
};

window.addToCartAndRemoveFromId = async (wishlistId) => {
    const item = currentWishlistData.find(i => i.id_wishlist == wishlistId);
    if (!item || !item.producto) {
        showToast('Error al procesar el producto', 'error');
        return;
    }

    const product = item.producto;

    // Add to cart (localStorage)
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartIndex = cart.findIndex(c => c.id_producto === product.id_producto);
    if (cartIndex > -1) {
        cart[cartIndex].quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));

    // Remove from Wishlist API
    try {
        await api.removeFromWishlist(wishlistId);
        showToast(`${product.nombre} movido al carrito`, 'success');
        renderWishlist();
    } catch (error) {
        showToast('Añadido al carrito, pero hubo un error al quitar de favoritos', 'info');
        renderWishlist();
    }
};
