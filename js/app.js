document.addEventListener('DOMContentLoaded', async () => {
    const productGrid = document.getElementById('product-grid');
    const searchInput = document.getElementById('search-input');
    const categoriesContainer = document.getElementById('categories-container');
    const cartDot = document.getElementById('cart-dot');
    const accountLink = document.getElementById('account-link');
    const accountText = document.getElementById('account-text');

    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && accountLink && accountText) {
        accountLink.href = 'perfil.html';
        accountText.innerText = 'Mi Perfil';

        // Recommendation to complete profile if fields are empty
        const isProfileIncomplete = !user.documento || !user.direccion;
        const hasSeenNotice = sessionStorage.getItem('profile-notice-seen');

        if (isProfileIncomplete && !hasSeenNotice) {
            setTimeout(() => {
                showToast('¡Hola! Completa tu información de envío para una mejor experiencia.', 'info', {
                    label: 'Ir a Perfil',
                    onClick: "window.location.href='perfil.html'"
                });
                sessionStorage.setItem('profile-notice-seen', 'true');
            }, 2000);
        }
    }

    let allProducts = [];
    let allCategories = [];

    // Check cart status
    function updateCartUI() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cartDot) {
            cartDot.style.display = cart.length > 0 ? 'block' : 'none';
        }
    }

    async function loadData() {
        try {
            const [products, categories] = await Promise.all([
                api.getProducts(),
                api.getProductTypes()
            ]);

            allProducts = products;
            allCategories = categories;

            renderCategories(allCategories);
            renderProducts(allProducts);
        } catch (error) {
            console.error('Error loading data:', error);
            if (productGrid) {
                productGrid.innerHTML = '<p class="text-rose-500 p-4 font-bold text-center">Error al conectar con la base de datos.</p>';
            }
        }
    }

    function renderCategories(categories) {
        if (!categoriesContainer) return;
        categoriesContainer.innerHTML = categories.map(cat => `
            <a href="#" onclick="filterByCategory(${cat.id_tipo_producto}, '${cat.nombre}')" class="flex items-center justify-between px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors group">
                <span class="text-sm font-medium group-hover:text-primary transition-colors">${cat.nombre}</span>
                <span class="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
            </a>
        `).join('');
    }

    window.filterByCategory = (typeId, typeName) => {
        const filtered = allProducts.filter(p => p.id_tipo_producto === typeId);
        const titleEl = document.getElementById('page-title');
        if (titleEl) titleEl.innerText = typeName;
        renderProducts(filtered);
    };

    function renderProducts(products) {
        if (!productGrid) return;

        if (!products || products.length === 0) {
            productGrid.innerHTML = `
                <div class="col-span-full py-20 text-center flex flex-col items-center">
                    <span class="material-symbols-outlined text-6xl text-slate-200">inventory_2</span>
                    <p class="text-slate-500 mt-4 font-bold">No se encontraron productos.</p>
                </div>
            `;
            return;
        }

        productGrid.innerHTML = products.map(product => `
            <div class="bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group relative">
                <!-- Wishlist Button -->
                <button onclick="addToWishlist(${JSON.stringify(product).replace(/"/g, '&quot;')})" class="absolute top-4 right-4 z-10 size-10 flex items-center justify-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all hover:bg-rose-50 hover:text-rose-500">
                    <span class="material-symbols-outlined text-xl">favorite</span>
                </button>

                <div class="aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                    <img src="${product.imagen_url || 'https://via.placeholder.com/400?text=ShopModern'}" alt="${product.nombre}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onerror="this.src='https://via.placeholder.com/400?text=Sin+Imagen'">
                </div>
                
                <div class="p-6 space-y-3">
                    <div class="flex flex-col gap-1">
                        <h3 class="font-black text-base line-clamp-1 group-hover:text-primary transition-colors">${product.nombre}</h3>
                        <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed min-h-[32px]">${product.descripcion || 'Sin descripción disponible.'}</p>
                    </div>
                    
                    <div class="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800/50">
                        <div class="flex flex-col">
                            <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Precio</span>
                            <span class="font-black text-xl text-primary">$${parseFloat(product.precio).toLocaleString()}</span>
                        </div>
                        <button onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})" class="size-12 flex items-center justify-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all shadow-lg active:scale-90">
                            <span class="material-symbols-outlined">add_shopping_cart</span>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    window.addToCart = (product) => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (!currentUser) {
            showToast('Inicia sesión para empezar a comprar', 'info', {
                label: 'Ingresar',
                onClick: "window.location.href='login.html'"
            });
            return;
        }

        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const index = cart.findIndex(item => item.id_producto === product.id_producto);

        if (index > -1) {
            cart[index].quantity = (cart[index].quantity || 1) + 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
        showToast(`${product.nombre} añadido al carrito`, 'success');
    };

    window.addToWishlist = async (product) => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (!currentUser) {
            showToast('Inicia sesión para usar tu Wishlist', 'info', {
                label: 'Ingresar',
                onClick: "window.location.href='login.html'"
            });
            return;
        }

        try {
            await api.addToWishlist(currentUser.id_cliente, product.id_producto);
            showToast(`${product.nombre} guardado en Wishlist`, 'success');
        } catch (error) {
            showToast(error.message, 'info');
        }
    };

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = allProducts.filter(p =>
                p.nombre.toLowerCase().includes(query) ||
                (p.descripcion && p.descripcion.toLowerCase().includes(query))
            );
            renderProducts(filtered);
        });
    }

    updateCartUI();
    loadData();
});
