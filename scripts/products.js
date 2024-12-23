
// Global variable to store products
let productsCache = null;

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

// Function to display products
async function displayProducts(filteredProducts = null) {
    const products = filteredProducts || await fetchProducts();
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <div class="product-image-container">
                <img id="product-image" src="${product.Image}" alt="${product['Product name']}">
            </div>
            <h3>${product['Product name']}</h3>
            <p>Rating: <img id="rating-img" src="images/ratings/rating-${product.Rating}.png" alt="${product['Rating']}"></p>
            <p>Color: <span id="product-color" style="background-color: ${product.Color};"></span></p>
            <p>Size: <span id="product-size">${product.Size}</span></p>
            <p>Price: <span id="product-price">$${product.Price}</span></p>
            <div class="add-button-container">
                <button id='addToCartButton' onclick="addToCart(${product.Id})">Add to Cart</button>
            </div>
        `;
        productList.appendChild(productCard);
    });
}

// Add to Cart
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.getElementById('cart-count').innerText = cart.length;
    console.log(cart);
}

// Search products by name
async function searchProductsByName() {
    const products = await fetchProducts(); 
    const query = document.getElementById('search').value.toLowerCase();
    const filteredProducts = products.filter(product => product['Product name'].toLowerCase().includes(query));
    displayProducts(filteredProducts);
}

// Search products by import date
async function getNewArrivals(days) {
    const products = await fetchProducts();
    const today = new Date();
    const newProducts =  products.filter(product => {
        const importDate = new Date(product['Import Date']);
        const differenceInTime = today - importDate;
        const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);
        return differenceInDays <= days;
    });
    displayProducts(newProducts);
}

// Search products by sell count
async function getBestSellers(count) {
    const products = await fetchProducts();
    const bestSellerProducts =  products.filter(product => product['Count'] >= count);
    displayProducts(bestSellerProducts);
}

// Search products by rating
async function get5RatedItems() {
    const products = await fetchProducts();
    const fiveRatedProducts =  products.filter(product => product['Rating'] == 50);
    displayProducts(fiveRatedProducts);
}

async function clearFilter() {
    const products = await fetchProducts();
    displayProducts(products);
}

// On page load, fetch all products and update cart count
window.onload = () => {
    displayProducts();
    updateCartCount();
};

let home_button = document.querySelector('.app-logo img');
let search_input = document.querySelector('#search');
let new_items = document.querySelector('#new-arrivals');
let hot_items = document.querySelector('#best-sellers');
let best_items = document.querySelector('#five-star-rated');

search_input.addEventListener('keyup', searchProductsByName);
new_items.addEventListener('click', () => getNewArrivals(10));
hot_items.addEventListener('click', () => getBestSellers(100));
best_items.addEventListener('click', get5RatedItems);
home_button.addEventListener('click', clearFilter);