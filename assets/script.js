document.addEventListener('DOMContentLoaded', () => {
    const cart = [];
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout');

    function updateCartDisplay() {
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `${item.name} - Quantity: ${item.quantity} <button class="decrease-quantity" data-index="${index}">-</button> <button class="increase-quantity" data-index="${index}">+</button> <button class="remove-item" data-index="${index}">Remove</button> - Price: $${(item.price * item.quantity).toFixed(2)}`;
            cartItems.appendChild(li);
            total += item.price * item.quantity;
        });

        cartTotal.textContent = `Total: $${total.toFixed(2)}`;

        // Add event listeners to the remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.dataset.index);
                cart.splice(index, 1);
                updateCartDisplay();
            });
        });

        // Add event listeners to the decrease buttons
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.dataset.index);
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                    updateCartDisplay();
                }
            });
        });

        // Add event listeners to the increase buttons
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.dataset.index);
                cart[index].quantity += 1;
                updateCartDisplay();
            });
        });
    }

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);

            const existingItem = cart.find(item => item.name === name);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name, price, quantity: 1 });
            }

            updateCartDisplay();
        });
    });

    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        let message = "Order Details:\n";
        cart.forEach(item => {
            message += `${item.name} - Quantity: ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
        });

        message += `Total: $${cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappLink = `https://wa.me/8618994967?text=${encodedMessage}`; // Replace YOUR_PHONE_NUMBER
        window.open(whatsappLink, '_blank');
    });

    // Banner Slider
    const slides = document.querySelectorAll('.banner-slide');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.style.display = 'none');
        slides[index].style.display = 'block';
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    showSlide(currentSlide); // Show the first slide initially
    setInterval(nextSlide, 5000); // Change slide every 5 seconds

    // Navigation Buttons
    document.getElementById('prev-slide').addEventListener('click', prevSlide);
    document.getElementById('next-slide').addEventListener('click', nextSlide);
});