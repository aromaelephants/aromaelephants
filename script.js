// Example: Cart functionality (to be expanded)
let cart = JSON.parse(localStorage.getItem('cart')) || [];
/*
function addToCart(product, selectedFragrance) {
    product.selectedFragrance = selectedFragrance;
    product.sku = product.fragranceSkus[selectedFragrance];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
}
/*
function addToCart(product, selectedFragrance) {

    // Add the selected fragrance to the product object before adding to cart 
    product.selectedFragrance = selectedFragrance;  
    cart.push(product); 
    localStorage.setItem('cart', JSON.stringify(cart)); 
    updateCartIcon();
    }
*/

document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');

    hamburgerMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
});

function addToCart(product, selectedFragrance) {
    const cartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        sku: product.fragranceSkus[selectedFragrance],
        selectedFragrance: selectedFragrance,
        quantity: 1,
        uniqueId: `${product.id}-${selectedFragrance}` // Unique identifier
    };

    // Check if the item is already in the cart
    const existingItem = cart.find(item => item.uniqueId === cartItem.uniqueId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
}


function updateCartIcon() {
    const cartItemCount = document.getElementById('cart-item-count');
    if (cartItemCount) {
        let totalItems = 0;
        cart.forEach(item => {
            totalItems += item.quantity || 1;
        });
        cartItemCount.textContent = totalItems;
    }
}
/*
function generateWhatsAppLink(cartItems) {
    let message = "Order Details:\n";
    let totalAmount = 0;

    cartItems.forEach(item => {
        const itemPrice = parseFloat(item.price.replace('Rs. ', '').replace(',', ''));
        const itemQuantity = item.quantity || 1;
        const itemTotal = itemPrice * itemQuantity;

        message += `- ${item.name} (SKU: ${item.sku}) (Qty: ${itemQuantity})`;
        if (item.selectedFragrance) {
            message += ` - Fragrance: ${item.selectedFragrance}\n`;
        }
        //message += ` - Total: Rs. ${itemTotal.toFixed(2)}\n`;

        totalAmount += itemTotal;
    });

    message += `\nTotal Amount: Rs. ${totalAmount.toFixed(2)}`;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/8296319813?text=${encodedMessage}`;
}*/

function generateWhatsAppLink(cartItems) {
    let message = "Order Details:\n\n";
    let totalAmount = 0;

    // Get shipping information (OUTSIDE the loop)
    const name = document.getElementById('shipping-name').value;
    const address = document.getElementById('shipping-address').value;
    const landmark = document.getElementById('shipping-landmark').value;
    const pincode = document.getElementById('shipping-pincode').value;
    const contact = document.getElementById('shipping-contact').value;
    const email = document.getElementById('shipping-email').value;

    cartItems.forEach((item, index) => {
        const priceString = item.price.replace(/[^\d.]/g, '');
        const itemPrice = parseFloat(priceString);

        if (isNaN(itemPrice)) {
            console.error(`Invalid price for ${item.name}: ${item.price}`);
            return;
        }

        const itemQuantity = item.quantity || 1;
        const subTotal = itemPrice * itemQuantity;
        const itemTotal = itemPrice * itemQuantity;

        message += `${index + 1}. ${item.name} (*SKU:* ${item.sku}) (${item.price}) (*Qty:* ${itemQuantity})`;

        if (item.selectedFragrance) {
            message += ` - *Fragrance:* ${item.selectedFragrance}\n`;
        } else {
            message += `\n`;
        }

        totalAmount += itemTotal;
    });

    message += `\n*Total Amount:* ₹${totalAmount.toFixed(2)}`;

    // Append shipping information (AFTER the loop)
    message += `\n\n*Shipping Information:*\n*Name:* ${name}\n*Address:* ${address}\n*Landmark:* ${landmark}\n*Pincode:* ${pincode}\n*Contact:* ${contact}\n*Email:* ${email}`;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/8296319813?text=${encodedMessage}`;
}

// Example: Product Data (load from products.json)
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error loading products:", error);
        return;
    }
}

// Example: Display products on shop.html
async function displayProducts(category) {
    console.log("displayProducts called with category:", category);
    const products = await loadProducts();
    console.log("Loaded products:", products);
    const productGrid = document.querySelector('.product-grid');
    if (productGrid) {
        console.log("productGrid found");
        productGrid.innerHTML = '';
        products.filter(product => product.category === category).forEach(product => {
            console.log("Processing product:", product);
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');
            productItem.innerHTML = `
             <a href="product.html?id=${product.id}">
                 <img src="${product.image}" alt="${product.name}">
                 <h3>${product.name}</h3>
                 <p class="price">${product.price}</p>  
             </a>   
         `;
            console.log("Product item HTML:", productItem.innerHTML);
            productGrid.appendChild(productItem);
        });
    } else {
        console.log("productGrid not found");
    }
}

// Example: Display all products on shop.html
async function displayAllProducts() {
    console.log("displayAllProducts called");
    const products = await loadProducts();
    console.log("Loaded products:", products);
    const productGrid = document.querySelector('.product-grid');
    console.log("productGrid:", productGrid);
    if (productGrid) {
        console.log("productGrid found");
        productGrid.innerHTML = '';
        products.forEach(product => {
            console.log("Processing product:", product);
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');
            productItem.innerHTML = `
        <a href="product.html?id=${product.id}">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">${product.price}</p>
            <p class="description">${product.description}</p>
            <p>SKU: ${product.sku}</p>
        </a>
        <button class="add-to-cart-btn" onclick="addToCart(${JSON.stringify(product)})">Add to Cart</button>
    `;
            console.log("Product item HTML:", productItem.innerHTML);
            productGrid.appendChild(productItem);
        });
    } else {
        console.log("productGrid not found");
    }
}

// Call display products function in shop.html based on the GET parameter.
window.onload = function() {
    console.log("window.onload called");
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    console.log("Category parameter:", category);

    if (category) {
        console.log("Category found, displaying products");
        displayProducts(category);
    } else {
        console.log("No category parameter, displaying all products");
        displayAllProducts();
    }
};

// Example: Product Details Page Logic
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

async function fetchProduct(productId) {
    const products = await loadProducts();
    const product = products.find(p => p.id === parseInt(productId));
    return product;
}

/*async function populateProductDetails() {
    if (document.querySelector(".product-details")) {
        const product = await fetchProduct(productId);
        if (product) {
            document.querySelector('.product-info h1').textContent = product.name;
            document.querySelector('.product-info .price').textContent = product.price;
            document.querySelector('.product-info .description').textContent = product.description;

            const productInfoList = document.getElementById("product-info-list");
            productInfoList.innerHTML = "";

            if (product.productInformation) {
                for (const key in product.productInformation) {
                    if (product.productInformation.hasOwnProperty(key)) {
                        const listItem = document.createElement("li");
                        listItem.textContent = `${key}: ${product.productInformation[key]}`;
                        productInfoList.appendChild(listItem);
                    }
                }
            }

            const imageContainer = document.querySelector('.product-images');
            imageContainer.innerHTML = "";
            product.images.forEach(image => {
                const img = document.createElement('img');
                img.src = image;
                img.alt = product.name;
                imageContainer.appendChild(img);
            });

            const fragranceSelect = document.getElementById("fragrance-select");
            fragranceSelect.innerHTML = "";
            product.fragrances.forEach(fragrance => {
                const option = document.createElement("option");
                option.value = fragrance;
                option.text = fragrance;
                fragranceSelect.appendChild(option);
            });

            document.querySelector(".add-to-cart-btn").addEventListener("click", function() {
                const selectedFragrance = document.getElementById("fragrance-select").value;
                addToCart(product, selectedFragrance);
            });
        } else {
            document.querySelector('.product-details').innerHTML = '<p>Product not found.</p>';
        }
    }
}*/

async function populateProductDetails() {
    if (document.querySelector(".product-details")) {
        const product = await fetchProduct(productId);
        if (product) {
            document.querySelector('.product-info h1').textContent = product.name;
            document.querySelector('.product-info .price').textContent = product.price;
            document.querySelector('.product-info .description').textContent = product.description;

            const productInfoList = document.getElementById("product-info-list");
            productInfoList.innerHTML = "";

            if (product.productInformation) {
                for (const key in product.productInformation) {
                    if (product.productInformation.hasOwnProperty(key)) {
                        const listItem = document.createElement("li");
                        listItem.textContent = `${key}: ${product.productInformation[key]}`;
                        productInfoList.appendChild(listItem);
                    }
                }
            }

            const mainImage = document.getElementById('main-product-image');
            const thumbnailContainer = document.querySelector('.thumbnail-images');
            thumbnailContainer.innerHTML = ''; // Clear existing thumbnails

            if (product.images && product.images.length > 0) {
                mainImage.src = product.images[0]; // Set the first image as the main image

                product.images.forEach(image => {
                    const thumbnail = document.createElement('img');
                    thumbnail.src = image;
                    thumbnail.alt = product.name; // Add alt text
                    thumbnail.addEventListener('click', () => {
                        mainImage.src = image; // Change main image on thumbnail click
                    });
                    thumbnailContainer.appendChild(thumbnail);
                });
            }

            const fragranceSelect = document.getElementById("fragrance-select");
            fragranceSelect.innerHTML = "";
            product.fragrances.forEach(fragrance => {
                const option = document.createElement("option");
                option.value = fragrance;
                option.text = fragrance;
                fragranceSelect.appendChild(option);
            });

            document.querySelector(".add-to-cart-btn").addEventListener("click", function() {
                const selectedFragrance = document.getElementById("fragrance-select").value;
                addToCart(product, selectedFragrance);
            });
        } else {
            document.querySelector('.product-details').innerHTML = '<p>Product not found.</p>';
        }
    }
}

populateProductDetails();

// Cart Page Logic
function displayCart() {
    if (document.querySelector(".cart")) {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartTotalElement = document.getElementById('cart-total');
        cartItemsContainer.innerHTML = '';

        let cartTotal = 0;

        /*cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h3>${item.name}</h3>
                    <p>${item.price}</p>
                    <p>SKU: ${item.sku}</p>
                    ${item.selectedFragrance ? `<p>Fragrance: ${item.selectedFragrance}</p>` : ''}
                    <div class="quantity">
                        <button onclick="changeQuantity(${index}, -1)">-</button>
                        <span>${item.quantity || 1}</span>
                        <button onclick="changeQuantity(${index}, 1)">+</button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
            cartTotal += parseFloat(item.price.replace('₹', '')) * (item.quantity || 1);*/
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div>
                        <h3>${item.name}</h3>
                        <p>${item.price}</p>
                        <p>SKU: ${item.sku}</p>
                        <p>Fragrance: ${item.selectedFragrance}</p>
                        <div class="quantity">
                            <button onclick="changeQuantity('${item.uniqueId}', -1)">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="changeQuantity('${item.uniqueId}', 1)">+</button>
                        </div>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
                cartTotal += parseFloat(item.price.replace('₹', '')) * item.quantity;
        });

        cartTotalElement.textContent = `₹${cartTotal.toFixed(2)}`;

            document.getElementById('order-button').addEventListener('click', () => {
    //if (confirm("Are you sure you want to place the order and clear the cart?")) {
            const whatsappLink = generateWhatsAppLink(cart);
            window.open(whatsappLink, '_blank'); // Open in a new tab/window

            
            // Clear shipping details
            document.getElementById('shipping-name').value = '';
            document.getElementById('shipping-address').value = '';
            document.getElementById('shipping-landmark').value = '';
            document.getElementById('shipping-pincode').value = '';
            document.getElementById('shipping-contact').value = '';
            document.getElementById('shipping-email').value = '';

            cart = [];
            localStorage.removeItem('cart'); // Remove cart from local storage
            displayCart(); // Re-render the empty cart
            updateCartIcon(); // Update the cart icon
    //}

            
        });
    }
}
/*
function changeQuantity(index, change) {
    cart[index].quantity = (cart[index].quantity || 1) + change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartIcon();
}*/

function changeQuantity(uniqueId, change) {
    const item = cart.find(cartItem => cartItem.uniqueId === uniqueId);

    if (item) {
        item.quantity += change;

        if (item.quantity <= 0) {
            cart = cart.filter(cartItem => cartItem.uniqueId !== uniqueId);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartIcon();
    }
}

// Call displayCart on page load
displayCart();

// Banner Slider Logic
document.addEventListener('DOMContentLoaded', function() {
    const bannerSlider = document.querySelector('.banner-slider');
    const bannerSlides = document.querySelectorAll('.banner-slide');
    const bannerPrev = document.querySelector('.banner-prev');
    const bannerNext = document.querySelector('.banner-next');

    if (bannerSlides.length > 0) {
        let counter = 0;
        const slideWidth = bannerSlides[0].clientWidth;

        bannerNext.addEventListener('click', () => {
            counter++;
            slide();
        });

        bannerPrev.addEventListener('click', () => {
            counter--;
            slide();
        });

        function slide() {
            if (counter < 0) {
                counter = bannerSlides.length - 1;
            } else if (counter >= bannerSlides.length) {
                counter = 0;
            }

            bannerSlider.style.transform = `translateX(${-slideWidth * counter}px)`;
        }

        // Automatic Slider (optional)
        let autoSlideInterval = setInterval(() => {
            counter++;
            slide();
        }, 5000); // Change slide every 5 seconds

        // Pause auto slide on hover (optional)
        const bannerContainer = document.querySelector('.banner-container');
        bannerContainer.addEventListener('mouseover', () => {
            clearInterval(autoSlideInterval);
        });

        bannerContainer.addEventListener('mouseout', () => {
            autoSlideInterval = setInterval(() => {
                counter++;
                slide();
            }, 5000);
        });
    } else {
        console.error("bannerSlides not found");
    }
});




/*------------------------------------------------------------------------------------ customization */
document.getElementById('whatsapp-contact').addEventListener('click', function() {
    const name = document.getElementById('name').value;
    const contact = document.getElementById('contact').value;
    const email = document.getElementById('email').value;
    const requirements = document.getElementById('requirements').value;

    // Telephone Number Validation
    const phoneRegex = /^[+]?[0-9\s-()]+$/;
    if (!phoneRegex.test(contact)) {
        alert("Please enter a valid contact number.");
        return;
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    const message = `
Customization Request:

Name/Company: ${name}
Contact Number: ${contact}
Email Address: ${email}

Requirements:
${requirements}
    `;

    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/8296319813?text=${encodedMessage}`; // Replace YOUR_WHATSAPP_NUMBER
    window.open(whatsappLink, '_blank');
});

