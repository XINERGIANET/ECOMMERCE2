// Initial Data
const initialProducts = [
    { id: 1, name: "Sistema ERP Completo", category: "Software", price: 1500, stock: 10, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80" },
    { id: 2, name: "Punto de Venta Integrado", category: "Software", price: 800, stock: 15, image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=400&q=80" },
    { id: 3, name: "Lector Biométrico ZKTeco", category: "Hardware", price: 250, stock: 30, image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&w=400&q=80" },
    { id: 4, name: "Servidor Dell PowerEdge", category: "Hardware", price: 3500, stock: 5, image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80" },
    { id: 5, name: "Impresora Térmica Epson", category: "Hardware", price: 180, stock: 50, image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=400&q=80" },
    { id: 6, name: "Consultoría de Procesos", category: "Servicios", price: 500, stock: 100, image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=400&q=80" },
    { id: 7, name: "Lector de Códigos 2D", category: "Hardware", price: 120, stock: 40, image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=400&q=80" },
    { id: 8, name: "Software de Facturación", category: "Software", price: 300, stock: 100, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80" },
    { id: 9, name: "Laptop Lenovo ThinkPad", category: "Hardware", price: 1200, stock: 20, image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80" },
    { id: 10, name: "Monitor Dell 24 pulgadas", category: "Hardware", price: 200, stock: 25, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80" },
    { id: 11, name: "Soporte Técnico Anual", category: "Servicios", price: 1000, stock: 100, image: "https://images.unsplash.com/photo-1525130413817-d45c1d127c42?auto=format&fit=crop&w=400&q=80" },
    { id: 12, name: "Cámara de Seguridad IP", category: "Hardware", price: 80, stock: 60, image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80" }
];

// State
// Force loading the new images by overwriting localStorage products with initialProducts
localStorage.setItem('xinergia_products', JSON.stringify(initialProducts));
let products = initialProducts;
let cart = JSON.parse(localStorage.getItem('xinergia_cart')) || [];
let orders = JSON.parse(localStorage.getItem('xinergia_orders')) || [];

// Init
document.addEventListener('DOMContentLoaded', () => {
    renderCatalog(products);
    updateCartUI();
    updateAdminDashboard();
    
    // Event Listeners for Filters
    document.getElementById('search-input').addEventListener('input', filterProducts);
    document.getElementById('category-filter').addEventListener('change', filterProducts);
    document.getElementById('sort-filter').addEventListener('change', filterProducts);
});

// View Navigation
function showSection(sectionId) {
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    
    if(sectionId === 'admin') {
        updateAdminDashboard();
        renderAdminProducts();
        renderAdminOrders();
    }
}

function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

// Format Currency
const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

// Toast Notifications
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

/* ================= CATALOG LOGIC ================= */
function renderCatalog(items) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    
    if(items.length === 0) {
        grid.innerHTML = '<p class="text-center w-100">No se encontraron productos.</p>';
        return;
    }

    items.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img-wrapper">
                <img src="${product.image}" alt="${product.name}" class="product-img">
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${formatMoney(product.price)}</p>
                <p class="product-stock">Stock disponible: ${product.stock}</p>
            </div>
            <button class="btn-primary add-to-cart-btn" onclick="addToCart(${product.id})">
                <i class="fas fa-shopping-cart"></i> Agregar al carrito
            </button>
        `;
        grid.appendChild(card);
    });
}

function updatePriceLabel(val) {
    document.getElementById('price-val').innerText = Number(val).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

function filterProducts() {
    const search = document.getElementById('search-input').value.toLowerCase();
    const category = document.getElementById('category-filter').value;
    const sort = document.getElementById('sort-filter').value;
    const maxPrice = parseFloat(document.getElementById('price-range').value);

    let filtered = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search);
        const matchCategory = category === 'all' || p.category === category;
        const matchPrice = p.price <= maxPrice;
        return matchSearch && matchCategory && matchPrice;
    });

    if (sort === 'name-asc') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'name-desc') {
        filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
    }

    renderCatalog(filtered);
}

/* ================= CART LOGIC ================= */
function toggleCart(forceOpen = false) {
    const offcanvas = document.getElementById('cart-offcanvas');
    const overlay = document.getElementById('cart-overlay');
    
    if (forceOpen === true || !offcanvas.classList.contains('open')) {
        offcanvas.classList.add('open');
        overlay.classList.add('show');
    } else {
        offcanvas.classList.remove('open');
        overlay.classList.remove('show');
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (product.stock <= 0) {
        showToast(`No hay stock de ${product.name}.`);
        return;
    }

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        if (existing.quantity < product.stock) {
            existing.quantity++;
            showToast(`Cantidad de ${product.name} actualizada.`);
        } else {
            showToast(`No hay suficiente stock de ${product.name}.`);
            return;
        }
    } else {
        cart.push({ ...product, quantity: 1 });
        showToast(`${product.name} agregado al carrito.`);
    }

    saveCart();
    updateCartUI();
}

function changeQty(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    const product = products.find(p => p.id === productId);
    
    item.quantity += delta;
    
    if (item.quantity > product.stock) item.quantity = product.stock;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCart();
    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    showToast("Producto eliminado del carrito.");
}

function saveCart() {
    localStorage.setItem('xinergia_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').innerText = count;
    document.getElementById('mobile-cart-count').innerText = count;
    document.getElementById('floating-cart-count').innerText = count;

    const list = document.getElementById('cart-list');
    list.innerHTML = '';

    if (cart.length === 0) {
        list.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-cart fa-3x mb-2"></i><p>Tu carrito está vacío</p></div>';
        document.getElementById('cart-subtotal').innerText = '$0.00';
        document.getElementById('cart-igv').innerText = '$0.00';
        document.getElementById('cart-total').innerText = '$0.00';
        return;
    }

    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${formatMoney(item.price)}</div>
                <div class="cart-item-qty mt-2">
                    <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        list.appendChild(div);
    });

    const igv = subtotal * 0.18;
    const total = subtotal + igv;

    document.getElementById('cart-subtotal').innerText = formatMoney(subtotal);
    document.getElementById('cart-igv').innerText = formatMoney(igv);
    document.getElementById('cart-total').innerText = formatMoney(total);
}

/* ================= CHECKOUT LOGIC ================= */
function openCheckoutModal() {
    if (cart.length === 0) {
        showToast("Agrega productos al carrito primero.");
        return;
    }
    toggleCart(false); // Cierra el offcanvas
    
    // Update Checkout Summary
    const list = document.getElementById('chk-summary-items');
    list.innerHTML = '';
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        list.innerHTML += `
            <div class="chk-item">
                <div>
                    <div class="chk-item-name">${item.name}</div>
                    <div class="chk-item-qty">Cant: ${item.quantity}</div>
                </div>
                <div>${formatMoney(item.price * item.quantity)}</div>
            </div>
        `;
    });
    
    const igv = subtotal * 0.18;
    const total = subtotal + igv;
    
    document.getElementById('chk-subtotal').innerText = formatMoney(subtotal);
    document.getElementById('chk-igv').innerText = formatMoney(igv);
    document.getElementById('chk-total').innerText = formatMoney(total);
    document.getElementById('chk-total-btn').innerText = formatMoney(total);
    
    renderPaymentDetails('Tarjeta');
    
    // Reset steps
    document.getElementById('checkout-step-1').style.display = 'block';
    document.getElementById('checkout-step-2').style.display = 'none';
    
    document.getElementById('checkout-modal').style.display = 'block';
}

function selectPayment(el, method) {
    document.querySelectorAll('.pay-method').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('chk-payment').value = method;
    renderPaymentDetails(method);
}

function renderPaymentDetails(method) {
    const container = document.getElementById('payment-details-container');
    container.innerHTML = ''; 
    
    if (method === 'Tarjeta') {
        container.innerHTML = `
            <div class="card-gateway" style="background: var(--light-gray); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
                <h4 style="margin-bottom: 1rem; color: var(--dark-blue);"><i class="far fa-credit-card"></i> Datos de Tarjeta</h4>
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label>Número de Tarjeta</label>
                    <div class="input-icon">
                        <i class="far fa-credit-card"></i>
                        <input type="text" placeholder="0000 0000 0000 0000" maxlength="19" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group flex-1">
                        <label>Vencimiento</label>
                        <input type="text" placeholder="MM/AA" maxlength="5" required>
                    </div>
                    <div class="form-group flex-1">
                        <label>CVC</label>
                        <div class="input-icon">
                            <i class="fas fa-lock"></i>
                            <input type="text" placeholder="123" maxlength="4" required>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (method === 'Yape' || method === 'Plin') {
        const color = method === 'Yape' ? '#740f4b' : '#00bfa5';
        container.innerHTML = `
            <div class="qr-gateway text-center" style="border: 2px dashed ${color}; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
                <h4 style="color: ${color}; margin-bottom: 1rem;">Escanea para pagar con ${method}</h4>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Pago+Xinergia+${method}" alt="QR ${method}" style="width: 120px; height: 120px; margin-bottom: 1rem; border-radius: 8px;">
                <p style="font-size: 0.9rem; color: var(--text-gray);">Número: <strong style="color:var(--dark-blue);">999 888 777</strong><br>A nombre de: Xinergia E.I.R.L.</p>
                <div class="form-group mt-2 text-left" style="margin-bottom:0;">
                    <label style="text-align: left;">Número de Operación</label>
                    <input type="text" placeholder="Ej. 12345678" required>
                </div>
            </div>
        `;
    } else if (method === 'Transferencia') {
        container.innerHTML = `
            <div class="bank-gateway" style="background: var(--light-gray); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
                <h4 style="margin-bottom: 1rem; color: var(--dark-blue);"><i class="fas fa-university"></i> Datos Bancarios</h4>
                <p style="font-size: 0.9rem; margin-bottom: 0.5rem;"><strong>Banco BCP:</strong> Cuenta Corriente Soles</p>
                <p style="font-size: 0.9rem; margin-bottom: 0.5rem; color: var(--text-gray);">N°: 193-1234567-0-00</p>
                <p style="font-size: 0.9rem; margin-bottom: 1rem; color: var(--text-gray);">CCI: 00219300123456700012</p>
                <div class="form-group" style="margin-bottom:0;">
                    <label>Número de Operación o Referencia</label>
                    <input type="text" placeholder="Ej. 98765432" required>
                </div>
            </div>
        `;
    }
}

function nextCheckoutStep() {
    const name = document.getElementById('chk-name').value;
    const email = document.getElementById('chk-email').value;
    const phone = document.getElementById('chk-phone').value;
    const address = document.getElementById('chk-address').value;
    
    if(!name || !email || !phone || !address) {
        showToast("Por favor, completa todos los datos de facturación.");
        return;
    }
    
    document.getElementById('checkout-step-1').style.display = 'none';
    document.getElementById('checkout-step-2').style.display = 'block';
}

function prevCheckoutStep() {
    document.getElementById('checkout-step-2').style.display = 'none';
    document.getElementById('checkout-step-1').style.display = 'block';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

function submitCheckout(e) {
    e.preventDefault();
    
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + (subtotal * 0.18);
    const orderId = 'ORD-' + Math.floor(Math.random() * 1000000);

    const newOrder = {
        id: orderId,
        customer: document.getElementById('chk-name').value,
        date: new Date().toLocaleDateString(),
        total: total,
        method: document.getElementById('chk-payment').value,
        status: 'Pendiente',
        items: [...cart]
    };

    // Update Stock
    cart.forEach(cartItem => {
        const prod = products.find(p => p.id === cartItem.id);
        if(prod) prod.stock -= cartItem.quantity;
    });
    localStorage.setItem('xinergia_products', JSON.stringify(products));

    orders.push(newOrder);
    localStorage.setItem('xinergia_orders', JSON.stringify(orders));

    cart = [];
    saveCart();
    updateCartUI();
    renderCatalog(products); // Reflect stock changes

    closeModal('checkout-modal');
    document.getElementById('success-order-id').innerText = orderId;
    document.getElementById('success-modal').style.display = 'block';
    document.getElementById('checkout-form').reset();
}

function closeSuccessModal() {
    closeModal('success-modal');
    showSection('home');
}

/* ================= ADMIN LOGIC ================= */
function switchAdminTab(tabId) {
    document.querySelectorAll('.admin-tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');
}

function updateAdminDashboard() {
    const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
    const totalCustomers = new Set(orders.map(o => o.customer)).size;

    document.getElementById('dash-sales').innerText = formatMoney(totalSales);
    document.getElementById('dash-orders').innerText = orders.length;
    document.getElementById('dash-products').innerText = products.length;
    document.getElementById('dash-customers').innerText = totalCustomers;
}

function renderAdminProducts() {
    const tbody = document.getElementById('admin-products-list');
    tbody.innerHTML = '';

    products.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.id}</td>
            <td><img src="${p.image}" alt="img"></td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>${formatMoney(p.price)}</td>
            <td>${p.stock}</td>
            <td>
                <button class="action-btn btn-edit" onclick="editProduct(${p.id})"><i class="fas fa-edit"></i></button>
                <button class="action-btn btn-delete" onclick="deleteProduct(${p.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderAdminOrders() {
    const tbody = document.getElementById('admin-orders-list');
    tbody.innerHTML = '';

    orders.forEach(o => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${o.id}</td>
            <td>${o.customer}</td>
            <td>${o.date}</td>
            <td>${formatMoney(o.total)}</td>
            <td>${o.method}</td>
            <td><span class="status-badge status-${o.status}">${o.status}</span></td>
            <td>
                <select onchange="updateOrderStatus('${o.id}', this.value)">
                    <option value="Pendiente" ${o.status==='Pendiente'?'selected':''}>Pendiente</option>
                    <option value="Pagado" ${o.status==='Pagado'?'selected':''}>Pagado</option>
                    <option value="Enviado" ${o.status==='Enviado'?'selected':''}>Enviado</option>
                    <option value="Entregado" ${o.status==='Entregado'?'selected':''}>Entregado</option>
                </select>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if(order) {
        order.status = newStatus;
        localStorage.setItem('xinergia_orders', JSON.stringify(orders));
        renderAdminOrders();
        showToast('Estado de pedido actualizado.');
    }
}

function openProductModal() {
    document.getElementById('product-form').reset();
    document.getElementById('prod-id').value = '';
    document.getElementById('product-modal-title').innerText = 'Agregar Producto';
    document.getElementById('product-modal').style.display = 'block';
}

function editProduct(id) {
    const p = products.find(prod => prod.id === id);
    if(p) {
        document.getElementById('prod-id').value = p.id;
        document.getElementById('prod-name').value = p.name;
        document.getElementById('prod-category').value = p.category;
        document.getElementById('prod-price').value = p.price;
        document.getElementById('prod-stock').value = p.stock;
        document.getElementById('prod-image').value = p.image;
        
        document.getElementById('product-modal-title').innerText = 'Editar Producto';
        document.getElementById('product-modal').style.display = 'block';
    }
}

function saveProduct(e) {
    e.preventDefault();
    const id = document.getElementById('prod-id').value;
    
    const productData = {
        name: document.getElementById('prod-name').value,
        category: document.getElementById('prod-category').value,
        price: parseFloat(document.getElementById('prod-price').value),
        stock: parseInt(document.getElementById('prod-stock').value),
        image: document.getElementById('prod-image').value || "https://placehold.co/400x300/173B9F/FFFFFF?text=Sin+Imagen"
    };

    if(id) {
        // Edit
        const index = products.findIndex(p => p.id == id);
        products[index] = { ...products[index], ...productData };
        showToast('Producto actualizado.');
    } else {
        // Add
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({ id: newId, ...productData });
        showToast('Producto agregado.');
    }

    localStorage.setItem('xinergia_products', JSON.stringify(products));
    renderAdminProducts();
    updateAdminDashboard();
    renderCatalog(products);
    closeModal('product-modal');
}

function deleteProduct(id) {
    if(confirm('¿Estás seguro de eliminar este producto?')) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('xinergia_products', JSON.stringify(products));
        renderAdminProducts();
        updateAdminDashboard();
        renderCatalog(products);
        showToast('Producto eliminado.');
    }
}
