document.addEventListener('DOMContentLoaded', function () {
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
    
    // Get form fields
    const firstNameField = document.getElementById('first-name');
    const lastNameField = document.getElementById('last-name');
    const address1Field = document.getElementById('address1');
    const address2Field = document.getElementById('address2');
    const postalCodeField = document.getElementById('postal-code');
    const cityField = document.getElementById('city');
    const provinceField = document.getElementById('province');
    const phoneField = document.getElementById('phone-number');
    const standardShipping = document.getElementById('standard-shipping');
    const expressShipping = document.getElementById('express-shipping');

    // Function to calculate the subtotal from cart data
    async function calculateSubtotal() {
        const products = await fetchProducts();
        const cartData = JSON.parse(localStorage.getItem('cart')) || [];
        
        let subtotal = 0;
    
        for (let i = 0; i < cartData.length; i++) {
            const productId = cartData[i];
            const product = products.find((p) => p.Id === parseInt(productId));
    
            if (product) {
                const productPrice = product.Price;
                subtotal += productPrice;
            }
        }
    
        console.log(`Subtotal: ${subtotal}`);
        return subtotal;
    }

    // Function to update order summary
    async function updateOrderSummary() {
        const subtotal = await calculateSubtotal();
        let shippingFee = 0;
        let taxFee = 0;
        let totalAmount = 0;

        // Determine shipping fee based on selection
        if (standardShipping.checked) {
            shippingFee = 10.99;
        } else if (expressShipping.checked) {
            shippingFee = 20.99;
        }

        // Calculate tax (13% of subtotal)
        taxFee = subtotal * 0.13;

        // Calculate total amount
        totalAmount = subtotal + shippingFee + taxFee;

        // Update the display in the order summary box
        document.querySelector(".order-summary-details").innerHTML = `
            <p>Merchandise Subtotal: $${subtotal.toFixed(2)}</p>
            <p>Tax (13%): $${taxFee.toFixed(2)}</p>
            <p>Shipping Fee: $${shippingFee.toFixed(2)}</p>
            <p id="total-price">Total: $${totalAmount.toFixed(2)}</p>
        `;
    }

    // Function to validate form
    function validateFormFields(event){

        const firstnameError = document.querySelector('#firstName-error');
        const lastnameError = document.querySelector('#lastName-error');
        const address1Error = document.querySelector('#address1-error');
        const postalError = document.querySelector('#postalCode-error');
        const cityError = document.querySelector('#city-error');
        const provinceError = document.querySelector('#province-error');
        const phonenumberError = document.querySelector('#phoneNumber-error');
        const shippingError = document.querySelector('#shipping-method-error');

        firstnameError.textContent = "";
        lastnameError.textContent = "";
        address1Error.textContent = "";
        postalError.textContent = "";
        cityError.textContent = "";
        provinceError.textContent = "";
        phonenumberError.textContent = "";
        shippingError.textContent = "";

        let isValid = true;

        if (firstNameField.value === "" || /^[0-9]+$/.test(firstNameField.value)) {
            firstnameError.textContent = "Please enter your first name properly."
            isValid = false;
        }

        if (lastNameField.value === "" || /^[0-9]+$/.test(lastNameField.value)) {
            lastnameError.textContent = "Please enter your last name properly."
            isValid = false;
        }

        if (address1Field.value === "") {
            address1Error.textContent = "Please enter your address properly."
            isValid = false;
        }

        if (postalCodeField.value === "") {
            postalError.textContent = "Please enter your postal code properly."
            isValid = false;
        }

        if (cityField.value === "" || /^[0-9]+$/.test(cityField.value)) {
            cityError.textContent = "Please enter your city properly."
            isValid = false;
        }

        if (provinceField.value === "" || /^[0-9]+$/.test(provinceField.value)) {
            provinceError.textContent = "Please enter your province properly."
            isValid = false;
        }

        if (phoneField.value === "" || !/^\d{10}$/.test(phoneField.value)) {
            phonenumberError.textContent = "Please enter your phone number properly."
            isValid = false;
        }

        if (!expressShipping.checked && !standardShipping.checked){
            shippingError.textContent = "Please select shipping method properly."
            isValid = false;
        }
        return isValid;

    }
    
    // Update cart count
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        document.getElementById('cart-count').innerText = cart.length;
        console.log(cart);
    }

    // Reset form after checkout
    function resetForm(){
        firstNameField.value = "";
        lastNameField.value = "";
        address1Field.value = "";
        address2Field.value = "";
        postalCodeField.value = "";
        cityField.value = "";
        provinceField.value = "";
        phoneField.value = "";
        standardShipping.checked = false;
        expressShipping.checked = false;
        updateCartCount();
    }

    // Add event listeners for shipping option changes
    standardShipping.addEventListener('change', function () {
        updateOrderSummary();
    });

    expressShipping.addEventListener('change', function () {
        updateOrderSummary();
    });

    // Add event listener for the checkout button
    const checkoutButton = document.querySelector('.checkout input[type="submit"]');
    checkoutButton.addEventListener('click', function (event) {
        if (validateFormFields(event)) {
            event.preventDefault();
            alert('Checkout successfully!');
            localStorage.removeItem('cart');
            resetForm()
            updateOrderSummary();
        }

    });

    // Initial setup
    updateOrderSummary();
    updateCartCount();
});