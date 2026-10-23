/* =========================================================
   DREAM SHOP - MAIN JAVASCRIPT
   ========================================================= */

/* =========================
   SUPABASE CONFIG
   ========================= */

const SUPABASE_URL = "https://lwnisnbsfqqmrifujnbw.supabase.co";
const SUPABASE_KEY = "sb_publishable_G2Lrr0dofsmmEWqJACdXrw_GuRHwitt";

let supabaseClient = null;

if (typeof window !== "undefined" && window.supabase) {
    supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );
}


/* =========================
   PRODUCT DATABASE
   ========================= */

const products = [
    {
        id: "earbuds",
        name: "Wireless Earbuds",
        price: 1850,
        image: "images/earbuds.png",
        category: "audio",
        description:
            "Premium wireless earbuds with clear sound, comfortable fit and modern design.",
        features: [
            "High-quality sound",
            "Wireless Bluetooth connection",
            "Comfortable design",
            "Portable charging case",
            "Suitable for daily use"
        ]
    },

    {
        id: "smart-watch",
        name: "Smart Watch",
        price: 2450,
        image: "images/smart-watch.png",
        category: "wearable",
        description:
            "Modern smart watch with a stylish display and useful everyday features.",
        features: [
            "Stylish modern design",
            "Digital display",
            "Fitness tracking",
            "Daily activity monitoring",
            "Comfortable strap"
        ]
    },

    {
        id: "power-bank",
        name: "Power Bank 30000mAh",
        price: 1650,
        image: "images/power-bank.png",
        category: "power",
        description:
            "High-capacity power bank for charging your smartphone and other devices.",
        features: [
            "30000mAh capacity",
            "Portable design",
            "Multiple charging support",
            "LED battery indicator",
            "Ideal for travel"
        ]
    },

    {
        id: "projector",
        name: "Mini Projector 4K",
        price: 4200,
        image: "images/projector.png",
        category: "electronics",
        description:
            "Compact mini projector designed for movies, entertainment and presentations.",
        features: [
            "Compact size",
            "Large-screen projection",
            "Modern design",
            "Suitable for home entertainment",
            "Easy to carry"
        ]
    },

    {
        id: "selfie-stick",
        name: "Selfie Stick Tripod",
        price: 950,
        image: "images/selfie-stick.png",
        category: "mobile",
        description:
            "2-in-1 selfie stick and tripod for photos, videos and content creation.",
        features: [
            "Selfie stick + tripod",
            "Portable design",
            "Adjustable holder",
            "Suitable for smartphones",
            "Perfect for content creators"
        ]
    },

    {
        id: "neckband",
        name: "Bluetooth Neckband",
        price: 1250,
        image: "images/neckband.png",
        category: "audio",
        description:
            "Comfortable Bluetooth neckband with clear audio for music and calls.",
        features: [
            "Bluetooth connectivity",
            "Clear audio",
            "Comfortable neckband design",
            "Suitable for calls",
            "Lightweight"
        ]
    }
];


/* =========================
   HELPER FUNCTIONS
   ========================= */

function getProductById(id) {
    if (!id) return null;

    const cleanId = String(id)
        .trim()
        .toLowerCase();

    return products.find(product =>
        String(product.id).toLowerCase() === cleanId
    ) || null;
}


function getProductImage(productId, productName = "") {
    const product = getProductById(productId);

    if (product) {
        return product.image;
    }

    const name = String(productName).toLowerCase();

    if (name.includes("earbud")) {
        return "images/earbuds.png";
    }

    if (name.includes("smart watch") || name.includes("smartwatch")) {
        return "images/smart-watch.png";
    }

    if (name.includes("power bank")) {
        return "images/power-bank.png";
    }

    if (name.includes("projector")) {
        return "images/projector.png";
    }

    if (name.includes("selfie")) {
        return "images/selfie-stick.png";
    }

    if (name.includes("neckband")) {
        return "images/neckband.png";
    }

    return "images/earbuds.png";
}


function formatPrice(price) {
    return "৳" + Number(price || 0).toLocaleString("en-US");
}


function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================
   CART FUNCTIONS
   ========================= */

function getCart() {
    try {
        const savedCart = localStorage.getItem("dreamShopCart");

        if (!savedCart) {
            return [];
        }

        const cart = JSON.parse(savedCart);

        return Array.isArray(cart) ? cart : [];
    } catch (error) {
        console.error("Cart loading error:", error);
        return [];
    }
}


function saveCart(cart) {
    localStorage.setItem(
        "dreamShopCart",
        JSON.stringify(cart)
    );

    updateCartCount();
}


function addToCart(productId, quantity = 1) {
    const product = getProductById(productId);

    if (!product) {
        alert("Product not found.");
        return false;
    }

    quantity = Math.max(1, Number(quantity) || 1);

    const cart = getCart();

    const existingProduct = cart.find(
        item => String(item.id) === String(product.id)
    );

    if (existingProduct) {
        existingProduct.quantity =
            Number(existingProduct.quantity || 0) + quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    saveCart(cart);

    return true;
}


function removeFromCart(productId) {
    let cart = getCart();

    cart = cart.filter(
        item => String(item.id) !== String(productId)
    );

    saveCart(cart);

    renderCart();
    renderCheckout();

    return cart;
}


function updateCartQuantity(productId, quantity) {
    const cart = getCart();

    const item = cart.find(
        product => String(product.id) === String(productId)
    );

    if (!item) return;

    quantity = Number(quantity);

    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    item.quantity = quantity;

    saveCart(cart);

    renderCart();
    renderCheckout();
}


function getCartTotalItems() {
    return getCart().reduce(
        (total, item) =>
            total + Number(item.quantity || 0),
        0
    );
}


function getCartTotalPrice() {
    return getCart().reduce(
        (total, item) =>
            total +
            Number(item.price || 0) *
            Number(item.quantity || 0),
        0
    );
}


function updateCartCount() {
    const count = getCartTotalItems();

    const cartCounters = document.querySelectorAll(
        "#cartCount, .cart-count, [data-cart-count]"
    );

    cartCounters.forEach(counter => {
        counter.textContent = count;
    });
}


/* =========================
   PRODUCT DETAILS PAGE
   ========================= */

function getProductIdFromUrl() {
    const params = new URLSearchParams(
        window.location.search
    );

    return (
        params.get("id") ||
        params.get("product") ||
        params.get("productId")
    );
}


function loadProductDetails() {
    const productImage =
        document.getElementById("productImage");

    const productName =
        document.getElementById("productName");

    const productPrice =
        document.getElementById("productPrice");

    const productDescription =
        document.getElementById("productDescription");

    const productFeatures =
        document.getElementById("productFeatures");

    if (
        !productImage &&
        !productName &&
        !productPrice
    ) {
        return;
    }

    const productId = getProductIdFromUrl();

    const product = getProductById(productId);

    if (!product) {
        if (productName) {
            productName.textContent = "Product not found";
        }

        if (productPrice) {
            productPrice.textContent = "";
        }

        if (productDescription) {
            productDescription.textContent =
                "Sorry, this product could not be found.";
        }

        if (productImage) {
            productImage.src = "images/earbuds.png";
            productImage.alt = "Product not found";
        }

        if (productFeatures) {
            productFeatures.innerHTML = "";
        }

        return;
    }

    if (productImage) {
        productImage.src = product.image;
        productImage.alt = product.name;

        productImage.onerror = function () {
            this.src = "images/earbuds.png";
        };
    }

    if (productName) {
        productName.textContent = product.name;
    }

    if (productPrice) {
        productPrice.textContent =
            formatPrice(product.price);
    }

    if (productDescription) {
        productDescription.textContent =
            product.description;
    }

    if (productFeatures) {
        productFeatures.innerHTML =
            product.features
                .map(feature =>
                    `<li>${escapeHtml(feature)}</li>`
                )
                .join("");
    }

    setupProductQuantity(product);
    setupProductButtons(product);
}


function setupProductQuantity(product) {
    const decreaseButton =
        document.getElementById("decreaseQuantity");

    const increaseButton =
        document.getElementById("increaseQuantity");

    const quantityInput =
        document.getElementById("quantity");

    if (!quantityInput) return;

    let quantity =
        Math.max(
            1,
            Number(quantityInput.value) || 1
        );

    quantityInput.value = quantity;

    if (decreaseButton) {
        decreaseButton.onclick = function () {
            quantity = Math.max(1, quantity - 1);
            quantityInput.value = quantity;
        };
    }

    if (increaseButton) {
        increaseButton.onclick = function () {
            quantity++;
            quantityInput.value = quantity;
        };
    }

    quantityInput.addEventListener(
        "input",
        function () {
            let value = Number(this.value);

            if (!value || value < 1) {
                value = 1;
            }

            this.value = value;
        }
    );
}


function setupProductButtons(product) {
    const buyNowButton =
        document.getElementById("buyNowButton");

    const addCartButton =
        document.getElementById("detailsAddCart");

    const quantityInput =
        document.getElementById("quantity");

    function getQuantity() {
        return Math.max(
            1,
            Number(quantityInput?.value) || 1
        );
    }

    if (addCartButton) {
        addCartButton.onclick = function () {
            const quantity = getQuantity();

            const success =
                addToCart(product.id, quantity);

            if (success) {
                alert(
                    product.name +
                    " added to cart."
                );

                updateCartCount();
            }
        };
    }

    if (buyNowButton) {
        buyNowButton.onclick = function () {
            const quantity = getQuantity();

            const success =
                addToCart(product.id, quantity);

            if (success) {
                window.location.href =
                    "checkout.html";
            }
        };
    }
}


/* =========================
   PRODUCT LINKS
   ========================= */

function setupProductLinks() {
    document.querySelectorAll(
        "[data-product-id]"
    ).forEach(element => {
        const productId =
            element.getAttribute(
                "data-product-id"
            );

        const product =
            getProductById(productId);

        if (!product) return;

        element.addEventListener(
            "click",
            function (event) {
                event.preventDefault();

                window.location.href =
                    "product.html?id=" +
                    encodeURIComponent(product.id);
            }
        );
    });
}


/* =========================
   VIEW DETAILS / ADD CART
   ========================= */

function viewProduct(productId) {
    const product =
        getProductById(productId);

    if (!product) {
        alert("Product not found.");
        return;
    }

    window.location.href =
        "product.html?id=" +
        encodeURIComponent(product.id);
}


function handleAddToCart(productId, quantity = 1) {
    const product =
        getProductById(productId);

    if (!product) {
        alert("Product not found.");
        return;
    }

    const success =
        addToCart(product.id, quantity);

    if (success) {
        alert(
            product.name +
            " added to cart."
        );
    }
}


/* =========================
   HOMEPAGE SEARCH
   ========================= */

function setupSearch() {
    const searchInput =
        document.getElementById("searchInput");

    const searchButton =
        document.getElementById("searchButton");

    if (!searchInput) return;

    function performSearch() {
        const searchText =
            searchInput.value
                .trim()
                .toLowerCase();

        const productCards =
            document.querySelectorAll(
                "[data-product-id]"
            );

        if (!searchText) {
            productCards.forEach(card => {
                card.style.display = "";
            });

            return;
        }

        productCards.forEach(card => {
            const productId =
                card.getAttribute(
                    "data-product-id"
                );

            const product =
                getProductById(productId);

            if (!product) {
                card.style.display = "none";
                return;
            }

            const searchableText =
                (
                    product.name +
                    " " +
                    product.description +
                    " " +
                    product.category
                ).toLowerCase();

            card.style.display =
                searchableText.includes(searchText)
                    ? ""
                    : "none";
        });
    }

    if (searchButton) {
        searchButton.addEventListener(
            "click",
            performSearch
        );
    }

    searchInput.addEventListener(
        "keydown",
        function (event) {
            if (event.key === "Enter") {
                performSearch();
            }
        }
    );
}


/* =========================
   MOBILE MENU
   ========================= */

function setupMobileMenu() {
    const menuButton =
        document.getElementById("menuButton");

    const navMenu =
        document.getElementById("navMenu");

    if (!menuButton || !navMenu) return;

    menuButton.addEventListener(
        "click",
        function () {
            navMenu.classList.toggle("active");
        }
    );
}


/* =========================
   CART PAGE
   ========================= */

function renderCart() {
    const cartItemsContainer =
        document.getElementById("cartItems");

    const cartTotalItems =
        document.getElementById(
            "cartTotalItems"
        );

    const cartTotalPrice =
        document.getElementById(
            "cartTotalPrice"
        );

    if (!cartItemsContainer) return;

    const cart = getCart();

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Add some products to your cart.</p>
                <a href="index.html">Continue Shopping</a>
            </div>
        `;

        if (cartTotalItems) {
            cartTotalItems.textContent = "0";
        }

        if (cartTotalPrice) {
            cartTotalPrice.textContent = "৳0";
        }

        return;
    }

    cartItemsContainer.innerHTML =
        cart.map(item => {
            const product =
                getProductById(item.id);

            const image =
                product?.image ||
                item.image ||
                getProductImage(
                    item.id,
                    item.name
                );

            const name =
                product?.name ||
                item.name ||
                "Product";

            const price =
                product?.price ??
                Number(item.price || 0);

            const quantity =
                Number(item.quantity || 1);

            return `
                <div class="cart-item"
                     data-product-id="${escapeHtml(item.id)}">

                    <div class="cart-item-image">
                        <img
                            src="${escapeHtml(image)}"
                            alt="${escapeHtml(name)}"
                            onerror="this.src='images/earbuds.png'"
                        >
                    </div>

                    <div class="cart-item-info">
                        <h3>${escapeHtml(name)}</h3>

                        <p class="cart-item-price">
                            ${formatPrice(price)}
                        </p>

                        <div class="quantity-control">

                            <button
                                type="button"
                                onclick="updateCartQuantity('${escapeHtml(item.id)}', ${quantity - 1})"
                            >
                                −
                            </button>

                            <span>${quantity}</span>

                            <button
                                type="button"
                                onclick="updateCartQuantity('${escapeHtml(item.id)}', ${quantity + 1})"
                            >
                                +
                            </button>

                        </div>

                        <strong>
                            ${formatPrice(price * quantity)}
                        </strong>

                        <button
                            type="button"
                            class="remove-cart-item"
                            onclick="removeFromCart('${escapeHtml(item.id)}')"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            `;
        }).join("");

    if (cartTotalItems) {
        cartTotalItems.textContent =
            getCartTotalItems();
    }

    if (cartTotalPrice) {
        cartTotalPrice.textContent =
            formatPrice(
                getCartTotalPrice()
            );
    }
}


/* =========================
   CHECKOUT PAGE
   ========================= */

function renderCheckout() {
    const checkoutItems =
        document.getElementById(
            "checkoutItems"
        );

    const checkoutTotalItems =
        document.getElementById(
            "checkoutTotalItems"
        );

    const checkoutTotalPrice =
        document.getElementById(
            "checkoutTotalPrice"
        );

    if (!checkoutItems) return;

    const cart = getCart();

    if (cart.length === 0) {
        checkoutItems.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Please add a product before placing an order.</p>
                <a href="index.html">Continue Shopping</a>
            </div>
        `;

        if (checkoutTotalItems) {
            checkoutTotalItems.textContent = "0";
        }

        if (checkoutTotalPrice) {
            checkoutTotalPrice.textContent = "৳0";
        }

        return;
    }

    checkoutItems.innerHTML =
        cart.map(item => {
            const product =
                getProductById(item.id);

            const image =
                product?.image ||
                item.image ||
                getProductImage(
                    item.id,
                    item.name
                );

            const name =
                product?.name ||
                item.name ||
                "Product";

            const price =
                product?.price ??
                Number(item.price || 0);

            const quantity =
                Number(item.quantity || 1);

            return `
                <div class="checkout-item">

                    <img
                        src="${escapeHtml(image)}"
                        alt="${escapeHtml(name)}"
                        onerror="this.src='images/earbuds.png'"
                    >

                    <div class="checkout-item-info">

                        <h4>
                            ${escapeHtml(name)}
                        </h4>

                        <p>
                            ${formatPrice(price)}
                        </p>

                        <div class="quantity-control">

                            <button
                                type="button"
                                onclick="updateCheckoutQuantity('${escapeHtml(item.id)}', ${quantity - 1})"
                            >
                                −
                            </button>

                            <span>
                                ${quantity}
                            </span>

                            <button
                                type="button"
                                onclick="updateCheckoutQuantity('${escapeHtml(item.id)}', ${quantity + 1})"
                            >
                                +
                            </button>

                        </div>

                        <strong>
                            ${formatPrice(price * quantity)}
                        </strong>

                        <button
                            type="button"
                            onclick="removeCheckoutItem('${escapeHtml(item.id)}')"
                        >
                            Remove
                        </button>

                    </div>

                </div>
            `;
        }).join("");

    if (checkoutTotalItems) {
        checkoutTotalItems.textContent =
            getCartTotalItems();
    }

    if (checkoutTotalPrice) {
        checkoutTotalPrice.textContent =
            formatPrice(
                getCartTotalPrice()
            );
    }
}


function updateCheckoutQuantity(
    productId,
    quantity
) {
    updateCartQuantity(
        productId,
        quantity
    );

    renderCheckout();
}


function removeCheckoutItem(productId) {
    removeFromCart(productId);
    renderCheckout();
}


/* =========================
   PLACE ORDER
   ========================= */

function setupCheckout() {
    const checkoutForm =
        document.getElementById(
            "checkoutForm"
        );

    const placeOrderButton =
        document.getElementById(
            "placeOrderButton"
        );

    if (!checkoutForm) return;

    checkoutForm.addEventListener(
        "submit",
        async function (event) {
            event.preventDefault();

            const cart = getCart();

            if (cart.length === 0) {
                alert(
                    "Your cart is empty."
                );
                return;
            }

            const customerName =
                document.getElementById(
                    "customerName"
                )?.value.trim();

            const customerPhone =
                document.getElementById(
                    "customerPhone"
                )?.value.trim();

            const customerDistrict =
                document.getElementById(
                    "customerDistrict"
                )?.value.trim();

            const customerAddress =
                document.getElementById(
                    "customerAddress"
                )?.value.trim();

            const customerNote =
                document.getElementById(
                    "customerNote"
                )?.value.trim();

            if (
                !customerName ||
                !customerPhone ||
                !customerDistrict ||
                !customerAddress
            ) {
                alert(
                    "Please fill in all required information."
                );
                return;
            }

            if (!supabaseClient) {
                alert(
                    "Order system is not connected."
                );
                return;
            }

            const totalItems =
                getCartTotalItems();

            const totalPrice =
                getCartTotalPrice();

            const orderItems =
                cart.map(item => {
                    const product =
                        getProductById(item.id);

                    const quantity =
                        Number(item.quantity || 1);

                    const price =
                        product?.price ??
                        Number(item.price || 0);

                    const image =
                        product?.image ||
                        item.image ||
                        getProductImage(
                            item.id,
                            item.name
                        );

                    return {
                        product_id:
                            product?.id ||
                            item.id,

                        name:
                            product?.name ||
                            item.name,

                        image: image,

                        quantity:
                            quantity,

                        price:
                            price,

                        subtotal:
                            quantity * price
                    };
                });

            if (placeOrderButton) {
                placeOrderButton.disabled = true;
                placeOrderButton.textContent =
                    "Processing...";
            }

            try {
                const {
                    data,
                    error
                } = await supabaseClient
                    .from("orders")
                    .insert([
                        {
                            customer_name:
                                customerName,

                            customer_phone:
                                customerPhone,

                            customer_district:
                                customerDistrict,

                            customer_address:
                                customerAddress,

                            customer_note:
                                customerNote || null,

                            items:
                                orderItems,

                            total_items:
                                totalItems,

                            total_amount:
                                totalPrice,

                            status:
                                "pending"
                        }
                    ])
                    .select()
                    .single();

                if (error) {
                    console.error(
                        "Order error:",
                        error
                    );

                    alert(
                        "Order could not be placed.\n\n" +
                        error.message
                    );

                    return;
                }

                localStorage.removeItem(
                    "dreamShopCart"
                );

                updateCartCount();

                alert(
                    "Order Confirmed!\n\n" +
                    "Your Order ID: #" +
                    data.id
                );

                window.location.href =
                    "index.html";

            } catch (error) {
                console.error(error);

                alert(
                    "Something went wrong while placing your order."
                );

            } finally {
                if (placeOrderButton) {
                    placeOrderButton.disabled =
                        false;

                    placeOrderButton.textContent =
                        "✅ Confirm Order";
                }
            }
        }
    );
}


/* =========================
   ADMIN - ORDER IMAGE DATA
   ========================= */

function normalizeOrderItems(items) {
    if (!items) return [];

    if (Array.isArray(items)) {
        return items;
    }

    if (typeof items === "string") {
        try {
            const parsed =
                JSON.parse(items);

            return Array.isArray(parsed)
                ? parsed
                : [];
        } catch (error) {
            return [];
        }
    }

    return [];
}


function enrichOrderItems(items) {
    return normalizeOrderItems(items)
        .map(item => {
            const product =
                getProductById(
                    item.product_id ||
                    item.id
                );

            return {
                ...item,

                product_id:
                    product?.id ||
                    item.product_id ||
                    item.id ||
                    "",

                name:
                    product?.name ||
                    item.name ||
                    "Product",

                image:
                    product?.image ||
                    item.image ||
                    getProductImage(
                        item.product_id ||
                        item.id,
                        item.name
                    ),

                price:
                    product?.price ??
                    Number(item.price || 0),

                quantity:
                    Number(
                        item.quantity || 1
                    )
            };
        });
}


/* =========================
   DOM READY
   ========================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

        loadProductDetails();

        renderCart();

        renderCheckout();

        setupCheckout();

        setupProductLinks();

        setupSearch();

        setupMobileMenu();

    }
);


/* =========================
   GLOBAL FUNCTIONS
   ========================= */

window.products = products;

window.getProductById =
    getProductById;

window.getProductImage =
    getProductImage;

window.formatPrice =
    formatPrice;

window.getCart =
    getCart;

window.addToCart =
    addToCart;

window.removeFromCart =
    removeFromCart;

window.updateCartQuantity =
    updateCartQuantity;

window.updateCartCount =
    updateCartCount;

window.viewProduct =
    viewProduct;

window.handleAddToCart =
    handleAddToCart;

window.renderCart =
    renderCart;

window.renderCheckout =
    renderCheckout;

window.updateCheckoutQuantity =
    updateCheckoutQuantity;

window.removeCheckoutItem =
    removeCheckoutItem;

window.enrichOrderItems =
    enrichOrderItems;