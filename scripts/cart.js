// Fetch products from the products.json file
async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:3006/products');
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Error loading products:', error);
        return [];
    }
}

// Render cart items
async function renderCart() {
    const products = await fetchProducts();
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-container');
    const cartSummary = document.getElementById('cart-summary');

    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty. Add some products!</p>';
        cartSummary.innerHTML = '';
        return;
    }

    let total = 0;
    let tax = 0;

    const cartItems = {};

    // Consolidate items by ID to calculate quantities
    cart.forEach((productId) => {
        if (!cartItems[productId]) {
            cartItems[productId] = 1;
        } else {
            cartItems[productId]++;
        }
    });

    // Render each product
    Object.entries(cartItems).forEach(([productId, quantity]) => {
        const product = products.find((p) => p.Id === parseInt(productId, 10));
        if (!product) return;

        // Calculate total
        total += product.Price * quantity;

        // Render cart item
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${product.Image}" alt="${product['Product name']}">
            <div class="cart-item-details">
                <h3>${product['Product name']}</h3>
                <p>Price: $${product.Price.toFixed(2)}</p>
                <p>Size: ${product.Size}</p>
                <p>Quantity: 
                    <button class="decrease-quantity" data-id="${product.Id}">-</button>
                    <span>${quantity}</span>
                    <button class="increase-quantity" data-id="${product.Id}">+</button>
                </p>
                <p>Color: <span style="background-color: ${product.Color}; display: inline-block; width: 15px; height: 15px; border: 1px solid #36312C;"></span></p>
            </div>
            <div class="cart-item-actions">
                <button class="remove-button" data-id="${product.Id}">Remove</button>
            </div>
        `;
        cartContainer.appendChild(cartItem);
    });

    // Calculate tax 
    tax = total * 0.13;
    const grandTotal = total + tax;

    // Update cart summary
    cartSummary.innerHTML = `
        <h2>Cart Summary</h2>
        <p>Subtotal: $${total.toFixed(2)}</p>
        <p>Tax (13%): $${tax.toFixed(2)}</p>
        <h2>Total: $${grandTotal.toFixed(2)}</h2>
    `;

    // Add event listeners to increase/decrease/remove buttons
    document.querySelectorAll('.increase-quantity').forEach((button) => {
        button.addEventListener('click', (event) => {
            const productId = parseInt(event.target.getAttribute('data-id'), 10);
            updateCartQuantity(productId, 1);
        });
    });

    document.querySelectorAll('.decrease-quantity').forEach((button) => {
        button.addEventListener('click', (event) => {
            const productId = parseInt(event.target.getAttribute('data-id'), 10);
            updateCartQuantity(productId, -1);
        });
    });

    document.querySelectorAll('.remove-button').forEach((button) => {
        button.addEventListener('click', (event) => {
            const productId = parseInt(event.target.getAttribute('data-id'), 10);
            removeFromCart(productId);
        });
    });


}

// Update quantity in the cart
function updateCartQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.indexOf(productId);

    if (change === 1) {
        cart.push(productId); // Add one more of the product
    } else if (change === -1) {
        // Remove one instance of the product
        if (index !== -1) {
            cart.splice(index, 1);
        }
    }

    // Update localStorage and re-render cart
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// Remove item from cart completely
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter((id) => id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// Update cart count 
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.innerText = cart.length;
    }
}

// Only navigating to checkout page when items on cart
document.getElementById('checkout-btn').addEventListener('click', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length !== 0) {
        window.location.href = '/Checkout.html';
    } else {
        alert('Select items before checkout.');
    }
});

// On page load, render cart
window.onload = () => {
    renderCart();
    updateCartCount();
};

