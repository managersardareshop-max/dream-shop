/* =========================================================
   DREAM SHOP — PREMIUM MAIN JAVASCRIPT
   Smart Gadgets • Better Life
   ========================================================= */


/* =========================================================
   SUPABASE CONFIG
   ========================================================= */

const SUPABASE_URL =
    "https://lwnisnbsfqqmrifujnbw.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_G2Lrr0dofsmmEWqJACdXrw_GuRHwitt";

let supabaseClient = null;

if (
    typeof window !== "undefined" &&
    window.supabase
) {
    supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );
}


/* =========================================================
   PRODUCT DATABASE
   ========================================================= */

const products = [

    {
        id: "earbuds",
        name: "Wireless Earbuds",
        price: 1850,
        image: "images/earbuds.png",
        category: "audio",

        description:
            "Premium wireless earbuds designed for immersive sound, everyday comfort and a modern lifestyle.",

        features: [
            "Premium sound quality",
            "Wireless Bluetooth connectivity",
            "Comfortable ergonomic fit",
            "Portable charging case",
            "Perfect for music and calls",
            "Modern premium design"
        ]
    },


    {
        id: "smart-watch",
        name: "Smart Watch",
        price: 2450,
        image: "images/smart-watch.png",
        category: "wearable",

        description:
            "A stylish smart watch built for everyday convenience, fitness tracking and a modern digital lifestyle.",

        features: [
            "Premium modern design",
            "Bright digital display",
            "Fitness tracking",
            "Daily activity monitoring",
            "Comfortable adjustable strap",
            "Suitable for everyday use"
        ]
    },


    {
        id: "power-bank",
        name: "Power Bank 30000mAh",
        price: 1650,
        image: "images/power-bank.png",
        category: "power",

        description:
            "High-capacity portable power bank designed to keep your essential devices charged wherever you go.",

        features: [
            "30000mAh high capacity",
            "Portable premium design",
            "Multiple charging support",
            "LED battery indicator",
            "Ideal for travel",
            "Convenient everyday backup"
        ]
    },


    {
        id: "projector",
        name: "Mini Projector 4K",
        price: 4200,
        image: "images/projector.png",
        category: "electronics",

        description:
            "Compact mini projector for movies, entertainment, presentations and an impressive big-screen experience.",

        features: [
            "4K support",
            "Large-screen projection",
            "Compact premium design",
            "Perfect for home entertainment",
            "Easy to carry",
            "Ideal for movies and presentations"
        ]
    },


    {
        id: "selfie-stick",
        name: "Selfie Stick Tripod",
        price: 950,
        image: "images/selfie-stick.png",
        category: "mobile",

        description:
            "A versatile 2-in-1 selfie stick and tripod made for photography, videos, reels and content creation.",

        features: [
            "2-in-1 selfie stick and tripod",
            "Portable lightweight design",
            "Adjustable smartphone holder",
            "Easy to use",
            "Perfect for content creators",
            "Ideal for photos and videos"
        ]
    },


    {
        id: "neckband",
        name: "Bluetooth Neckband",
        price: 1250,
        image: "images/neckband.png",
        category: "audio",

        description:
            "Comfortable Bluetooth neckband delivering clear audio, reliable connectivity and a lightweight everyday experience.",

        features: [
            "Bluetooth connectivity",
            "Clear audio quality",
            "Comfortable neckband design",
            "Suitable for calls",
            "Lightweight construction",
            "Perfect for everyday listening"
        ]
    }

];


/* =========================================================
   HELPER FUNCTIONS
   ========================================================= */


/* Find product */

function getProductById(id) {

    if (!id) {
        return null;
    }

    const cleanId =
        String(id)
            .trim()
            .toLowerCase();

    return (
        products.find(
            product =>
                String(product.id)
                    .toLowerCase() === cleanId
        ) || null
    );
}


/* Product image */

function getProductImage(
    productId,
    productName = ""
) {

    const product =
        getProductById(productId);

    if (product) {
        return product.image;
    }

    const name =
        String(productName)
            .toLowerCase();

    if (name.includes("earbud")) {
        return "images/earbuds.png";
    }

    if (
        name.includes("smart watch") ||
        name.includes("smartwatch")
    ) {
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


/* Price formatter */

function formatPrice(price) {

    return (
        "৳" +
        Number(price || 0)
            .toLocaleString("en-US")
    );
}


/* Secure HTML text */

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   CART SYSTEM
   ========================================================= */


/* Get cart */

function getCart() {

    try {

        const savedCart =
            localStorage.getItem(
                "dreamShopCart"
            );

        if (!savedCart) {
            return [];
        }

        const cart =
            JSON.parse(savedCart);

        return Array.isArray(cart)
            ? cart
            : [];

    } catch (error) {

        console.error(
            "Cart loading error:",
            error
        );

        return [];
    }
}


/* Save cart */

function saveCart(cart) {

    localStorage.setItem(
        "dreamShopCart",
        JSON.stringify(cart)
    );

    updateCartCount();
}


/* Add product */

function addToCart(
    productId,
    quantity = 1
) {

    const product =
        getProductById(productId);

    if (!product) {

        console.error(
            "Product not found:",
            productId
        );

        alert(
            "Product not found."
        );

        return false;
    }


    quantity =
        Math.max(
            1,
            Number(quantity) || 1
        );


    const cart =
        getCart();


    const existingProduct =
        cart.find(
            item =>
                String(item.id)
                    .toLowerCase() ===
                String(product.id)
                    .toLowerCase()
        );


    if (existingProduct) {

        existingProduct.quantity =
            Number(
                existingProduct.quantity || 0
            ) + quantity;

        existingProduct.name =
            product.name;

        existingProduct.price =
            product.price;

        existingProduct.image =
            product.image;

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


/* Remove product */

function removeFromCart(productId) {

    let cart =
        getCart();

    cart =
        cart.filter(
            item =>
                String(item.id)
                    .toLowerCase() !==
                String(productId)
                    .toLowerCase()
        );

    saveCart(cart);

    renderCart();

    renderCheckout();

    return cart;
}


/* Update cart quantity */

function updateCartQuantity(
    productId,
    quantity
) {

    const cart =
        getCart();

    const item =
        cart.find(
            product =>
                String(product.id)
                    .toLowerCase() ===
                String(productId)
                    .toLowerCase()
        );


    if (!item) {
        return;
    }


    quantity =
        Number(quantity);


    if (quantity <= 0) {

        removeFromCart(
            productId
        );

        return;
    }


    item.quantity =
        Math.min(
            20,
            Math.max(
                1,
                quantity
            )
        );


    saveCart(cart);

    renderCart();

    renderCheckout();
}


/* Total items */

function getCartTotalItems() {

    return getCart().reduce(
        (total, item) =>
            total +
            Number(
                item.quantity || 0
            ),
        0
    );
}


/* Total price */

function getCartTotalPrice() {

    return getCart().reduce(
        (total, item) => {

            const product =
                getProductById(item.id);

            const price =
                product?.price ??
                Number(
                    item.price || 0
                );

            const quantity =
                Number(
                    item.quantity || 0
                );

            return (
                total +
                price * quantity
            );
        },
        0
    );
}


/* Update cart counter */

function updateCartCount() {

    const count =
        getCartTotalItems();


    const counters =
        document.querySelectorAll(
            "#cartCount, .cart-count, [data-cart-count]"
        );


    counters.forEach(counter => {

        counter.textContent =
            count;
    });
}


/* =========================================================
   PRODUCT DETAILS
   ========================================================= */


/* Get product ID from URL */

function getProductIdFromUrl() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return (
        params.get("id") ||
        params.get("product") ||
        params.get("productId")
    );
}


/* Load product details */

function loadProductDetails() {

    const productImage =
        document.getElementById(
            "productImage"
        );

    const productName =
        document.getElementById(
            "productName"
        );

    const productPrice =
        document.getElementById(
            "productPrice"
        );

    const productDescription =
        document.getElementById(
            "productDescription"
        );

    const productFeatures =
        document.getElementById(
            "productFeatures"
        );


    if (
        !productImage &&
        !productName &&
        !productPrice
    ) {
        return;
    }


    const productId =
        getProductIdFromUrl();


    const product =
        getProductById(
            productId
        );


    if (!product) {

        if (productName) {

            productName.textContent =
                "Product Not Found";
        }


        if (productPrice) {

            productPrice.textContent =
                "৳0";
        }


        if (productDescription) {

            productDescription.textContent =
                "Sorry, this product could not be found.";
        }


        if (productImage) {

            productImage.src =
                "images/earbuds.png";

            productImage.alt =
                "Product Not Found";
        }


        if (productFeatures) {

            productFeatures.innerHTML =
                "";
        }

        return;
    }


    /* Product image */

    if (productImage) {

        productImage.src =
            product.image;

        productImage.alt =
            product.name;


        productImage.onerror =
            function () {

                this.onerror = null;

                this.src =
                    "images/earbuds.png";
            };
    }


    /* Product name */

    if (productName) {

        productName.textContent =
            product.name;
    }


    /* Product price */

    if (productPrice) {

        productPrice.textContent =
            formatPrice(
                product.price
            );
    }


    /* Description */

    if (productDescription) {

        productDescription.textContent =
            product.description;
    }


    /* Features */

    if (productFeatures) {

        productFeatures.innerHTML =
            product.features
                .map(
                    feature =>
                        `<li>${escapeHtml(feature)}</li>`
                )
                .join("");
    }


    setupProductQuantity(
        product
    );

    setupProductButtons(
        product
    );
}


/* =========================================================
   PRODUCT QUANTITY
   ========================================================= */

function setupProductQuantity(
    product
) {

    const decreaseButton =
        document.getElementById(
            "decreaseQuantity"
        );

    const increaseButton =
        document.getElementById(
            "increaseQuantity"
        );

    const quantityInput =
        document.getElementById(
            "quantity"
        );


    if (!quantityInput) {
        return;
    }


    function getValidQuantity() {

        let value =
            Number(
                quantityInput.value
            );


        if (!Number.isFinite(value)) {
            value = 1;
        }


        value =
            Math.floor(value);


        return Math.max(
            1,
            Math.min(
                20,
                value
            )
        );
    }


    quantityInput.value =
        getValidQuantity();


    /* Decrease */

    if (decreaseButton) {

        decreaseButton.onclick =
            function () {

                const current =
                    getValidQuantity();

                quantityInput.value =
                    Math.max(
                        1,
                        current - 1
                    );
            };
    }


    /* Increase */

    if (increaseButton) {

        increaseButton.onclick =
            function () {

                const current =
                    getValidQuantity();

                quantityInput.value =
                    Math.min(
                        20,
                        current + 1
                    );
            };
    }


    /* Manual input */

    quantityInput.addEventListener(
        "input",
        function () {

            let value =
                Number(
                    this.value
                );


            if (!Number.isFinite(value)) {
                value = 1;
            }


            value =
                Math.floor(value);


            this.value =
                Math.max(
                    1,
                    Math.min(
                        20,
                        value
                    )
                );
        }
    );
}


/* =========================================================
   PRODUCT BUTTONS
   ========================================================= */

function setupProductButtons(
    product
) {

    const buyNowButton =
        document.getElementById(
            "buyNowButton"
        );

    const addCartButton =
        document.getElementById(
            "detailsAddCart"
        );

    const quantityInput =
        document.getElementById(
            "quantity"
        );


    function getQuantity() {

        let quantity =
            Number(
                quantityInput?.value
            );


        if (!Number.isFinite(quantity)) {
            quantity = 1;
        }


        quantity =
            Math.floor(quantity);


        return Math.max(
            1,
            Math.min(
                20,
                quantity
            )
        );
    }


    /* =====================================================
       ADD TO CART
       ===================================================== */

    if (addCartButton) {

        addCartButton.onclick =
            function () {

                const quantity =
                    getQuantity();


                const success =
                    addToCart(
                        product.id,
                        quantity
                    );


                if (success) {

                    alert(
                        "✓ " +
                        product.name +
                        " added to your cart."
                    );

                    updateCartCount();
                }
            };
    }


    /* =====================================================
       BUY NOW
       ===================================================== */

    if (buyNowButton) {

        buyNowButton.onclick =
            function (event) {

                event.preventDefault();


                const quantity =
                    getQuantity();


                const buyNowCart = [

                    {
                        id:
                            product.id,

                        name:
                            product.name,

                        price:
                            Number(
                                product.price
                            ),

                        image:
                            product.image,

                        quantity:
                            quantity
                    }

                ];


                localStorage.setItem(
                    "dreamShopCart",
                    JSON.stringify(
                        buyNowCart
                    )
                );


                localStorage.setItem(
                    "dreamShopBuyNow",
                    "true"
                );


                updateCartCount();


                window.location.href =
                    "checkout.html?buyNow=" +
                    encodeURIComponent(
                        product.id
                    );
            };
    }
}


/* =========================================================
   PRODUCT LINKS
   ========================================================= */

function setupProductLinks() {

    document.querySelectorAll(
        "[data-product-id]"
    ).forEach(element => {

        const productId =
            element.getAttribute(
                "data-product-id"
            );


        const product =
            getProductById(
                productId
            );


        if (!product) {
            return;
        }


        element.addEventListener(
            "click",
            function (event) {

                const target =
                    event.target;


                /*
                 * Do not redirect when
                 * user clicks buttons,
                 * inputs or interactive controls.
                 */

                if (
                    target.closest(
                        "a, button, input, select, textarea, [data-add-to-cart], [data-buy-now]"
                    )
                ) {
                    return;
                }


                event.preventDefault();


                window.location.href =
                    "product.html?id=" +
                    encodeURIComponent(
                        product.id
                    );
            }
        );
    });
}


/* =========================================================
   VIEW PRODUCT
   ========================================================= */

function viewProduct(
    productId
) {

    const product =
        getProductById(
            productId
        );


    if (!product) {

        alert(
            "Product not found."
        );

        return;
    }


    window.location.href =
        "product.html?id=" +
        encodeURIComponent(
            product.id
        );
}


/* =========================================================
   QUICK ADD TO CART
   ========================================================= */

function handleAddToCart(
    productId,
    quantity = 1
) {

    const product =
        getProductById(
            productId
        );


    if (!product) {

        alert(
            "Product not found."
        );

        return;
    }


    const success =
        addToCart(
            product.id,
            quantity
        );


    if (success) {

        alert(
            "✓ " +
            product.name +
            " added to cart."
        );

        updateCartCount();
    }
}


/* =========================================================
   SEARCH SYSTEM
   ========================================================= */

function setupSearch() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    const searchButton =
        document.getElementById(
            "searchButton"
        );


    if (!searchInput) {
        return;
    }


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

            productCards.forEach(
                card => {

                    card.style.display =
                        "";
                }
            );

            return;
        }


        productCards.forEach(
            card => {

                const productId =
                    card.getAttribute(
                        "data-product-id"
                    );


                const product =
                    getProductById(
                        productId
                    );


                if (!product) {

                    card.style.display =
                        "none";

                    return;
                }


                const searchableText =
                    (
                        product.name +
                        " " +
                        product.description +
                        " " +
                        product.category
                    )
                        .toLowerCase();


                card.style.display =
                    searchableText.includes(
                        searchText
                    )
                        ? ""
                        : "none";
            }
        );
    }


    /* Search button */

    if (searchButton) {

        searchButton.addEventListener(
            "click",
            performSearch
        );
    }


    /* Enter key */

    searchInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Enter"
            ) {

                performSearch();
            }
        }
    );
}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function setupMobileMenu() {

    /*
     * Dream Shop-এর নতুন এবং
     * পুরোনো দুই ধরনের menu ID support করবে।
     */

    const menuButton =
        document.getElementById(
            "mobileMenuButton"
        ) ||
        document.getElementById(
            "menuButton"
        );


    const navMenu =
        document.getElementById(
            "navMenu"
        ) ||
        document.querySelector(
            ".nav-menu"
        );


    if (
        !menuButton ||
        !navMenu
    ) {
        return;
    }


    menuButton.addEventListener(
        "click",
        function () {

            navMenu.classList.toggle(
                "active"
            );


            const isOpen =
                navMenu.classList.contains(
                    "active"
                );


            menuButton.setAttribute(
                "aria-expanded",
                isOpen
                    ? "true"
                    : "false"
            );
        }
    );


    /* Close menu after clicking nav link */

    navMenu
        .querySelectorAll(
            "a"
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                function () {

                    navMenu.classList.remove(
                        "active"
                    );

                    menuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }
            );
        });
}


/* =========================================================
   CART PAGE
   ========================================================= */

function renderCart() {

    const cartItemsContainer =
        document.getElementById(
            "cartItems"
        );

    const cartTotalItems =
        document.getElementById(
            "cartTotalItems"
        );

    const cartTotalPrice =
        document.getElementById(
            "cartTotalPrice"
        );


    if (!cartItemsContainer) {
        return;
    }


    const cart =
        getCart();


    /* Empty cart */

    if (cart.length === 0) {

        cartItemsContainer.innerHTML = `

            <div class="empty-cart">

                <h3>
                    Your Cart Is Empty
                </h3>

                <p>
                    Discover our premium gadgets
                    and add something you love.
                </p>

                <a href="index.html">
                    Continue Shopping
                </a>

            </div>

        `;


        if (cartTotalItems) {

            cartTotalItems.textContent =
                "0";
        }


        if (cartTotalPrice) {

            cartTotalPrice.textContent =
                "৳0";
        }


        return;
    }


    /* Cart products */

    cartItemsContainer.innerHTML =
        cart
            .map(item => {

                const product =
                    getProductById(
                        item.id
                    );


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
                    Number(
                        item.price || 0
                    );


                const quantity =
                    Math.max(
                        1,
                        Number(
                            item.quantity ||
                            1
                        )
                    );


                return `

                    <div
                        class="cart-item"
                        data-product-id="${escapeHtml(item.id)}"
                    >

                        <div class="cart-item-image">

                            <img
                                src="${escapeHtml(image)}"
                                alt="${escapeHtml(name)}"
                                onerror="this.onerror=null;this.src='images/earbuds.png'"
                            >

                        </div>


                        <div class="cart-item-info">

                            <h3>
                                ${escapeHtml(name)}
                            </h3>


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


                                <span>
                                    ${quantity}
                                </span>


                                <button
                                    type="button"
                                    onclick="updateCartQuantity('${escapeHtml(item.id)}', ${quantity + 1})"
                                >
                                    +
                                </button>

                            </div>


                            <strong>
                                ${formatPrice(
                                    price *
                                    quantity
                                )}
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

            })
            .join("");


    /* Totals */

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


/* =========================================================
   CHECKOUT PAGE
   ========================================================= */

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


    if (!checkoutItems) {
        return;
    }


    let cart =
        getCart();


    const params =
        new URLSearchParams(
            window.location.search
        );


    const buyNowProductId =
        params.get(
            "buyNow"
        );


    /*
     * Restore Buy Now product
     */

    if (
        cart.length === 0 &&
        buyNowProductId
    ) {

        const product =
            getProductById(
                buyNowProductId
            );


        if (product) {

            cart = [

                {
                    id:
                        product.id,

                    name:
                        product.name,

                    price:
                        product.price,

                    image:
                        product.image,

                    quantity:
                        1
                }

            ];


            saveCart(
                cart
            );
        }
    }


    /* Empty checkout */

    if (cart.length === 0) {

        checkoutItems.innerHTML = `

            <div class="empty-cart">

                <h3>
                    Your Cart Is Empty
                </h3>

                <p>
                    Please add a product
                    before placing an order.
                </p>

                <a href="index.html">
                    Continue Shopping
                </a>

            </div>

        `;


        if (checkoutTotalItems) {

            checkoutTotalItems.textContent =
                "0";
        }


        if (checkoutTotalPrice) {

            checkoutTotalPrice.textContent =
                "৳0";
        }


        return;
    }


    /* Checkout products */

    checkoutItems.innerHTML =
        cart
            .map(item => {

                const product =
                    getProductById(
                        item.id
                    );


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
                    Number(
                        item.price || 0
                    );


                const quantity =
                    Math.max(
                        1,
                        Number(
                            item.quantity ||
                            1
                        )
                    );


                return `

                    <div class="checkout-item">

                        <img
                            src="${escapeHtml(image)}"
                            alt="${escapeHtml(name)}"
                            onerror="this.onerror=null;this.src='images/earbuds.png'"
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
                                ${formatPrice(
                                    price *
                                    quantity
                                )}
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

            })
            .join("");


    /* Totals */

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


/* =========================================================
   CHECKOUT QUANTITY
   ========================================================= */

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


/* Remove checkout item */

function removeCheckoutItem(
    productId
) {

    removeFromCart(
        productId
    );


    renderCheckout();
}


/* =========================================================
   PLACE ORDER
   ========================================================= */

function setupCheckout() {

    const checkoutForm =
        document.getElementById(
            "checkoutForm"
        );


    const placeOrderButton =
        document.getElementById(
            "placeOrderButton"
        );


    if (!checkoutForm) {
        return;
    }


    checkoutForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const cart =
                getCart();


            /* Empty cart */

            if (cart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                return;
            }


            /* Customer information */

            const customerName =
                document
                    .getElementById(
                        "customerName"
                    )
                    ?.value
                    .trim();


            const customerPhone =
                document
                    .getElementById(
                        "customerPhone"
                    )
                    ?.value
                    .trim();


            const customerDistrict =
                document
                    .getElementById(
                        "customerDistrict"
                    )
                    ?.value
                    .trim();


            const customerAddress =
                document
                    .getElementById(
                        "customerAddress"
                    )
                    ?.value
                    .trim();


            const customerNote =
                document
                    .getElementById(
                        "customerNote"
                    )
                    ?.value
                    .trim();


            /* Required fields */

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


            /* Supabase check */

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


            /* Validate order */

            if (
                totalItems <= 0 ||
                totalPrice <= 0
            ) {

                alert(
                    "Order amount is invalid. Please select a product again."
                );

                return;
            }


            /* Prepare order items */

            const orderItems =
                cart.map(item => {

                    const product =
                        getProductById(
                            item.id
                        );


                    const quantity =
                        Math.max(
                            1,
                            Number(
                                item.quantity ||
                                1
                            )
                        );


                    const price =
                        product?.price ??
                        Number(
                            item.price ||
                            0
                        );


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
                            item.name ||
                            "Product",

                        image:
                            image,

                        quantity:
                            quantity,

                        price:
                            price,

                        subtotal:
                            quantity *
                            price
                    };

                });


            /* Loading state */

            if (placeOrderButton) {

                placeOrderButton.disabled =
                    true;

                placeOrderButton.textContent =
                    "Processing Order...";
            }


            try {

                /* Send order to Supabase */

                const {
                    data,
                    error
                } =
                    await supabaseClient
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
                                    customerNote ||
                                    null,

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


                /* Error */

                if (error) {

                    console.error(
                        "Supabase Order Error:",
                        error
                    );


                    alert(
                        "Order could not be placed.\n\n" +
                        error.message
                    );

                    return;
                }


                /* Save last order */

                localStorage.setItem(

                    "dreamShopLastOrder",

                    JSON.stringify({

                        id:
                            data?.id ||
                            null,

                        customer_name:
                            customerName,

                        customer_phone:
                            customerPhone,

                        customer_district:
                            customerDistrict,

                        customer_address:
                            customerAddress,

                        customer_note:
                            customerNote ||
                            "",

                        items:
                            orderItems,

                        total_items:
                            totalItems,

                        total_amount:
                            totalPrice,

                        status:
                            "pending",

                        created_at:
                            data?.created_at ||
                            new Date()
                                .toISOString()

                    })
                );


                /* Clear cart */

                localStorage.removeItem(
                    "dreamShopCart"
                );


                localStorage.removeItem(
                    "dreamShopBuyNow"
                );


                updateCartCount();


                /* Success */

                alert(
                    "✓ Order Confirmed!\n\n" +
                    "Your Order ID: #" +
                    (
                        data?.id ||
                        ""
                    )
                );


                /* Confirmation page */

                window.location.href =
                    "order-confirmation.html";


            } catch (error) {

                console.error(
                    "Order submission error:",
                    error
                );


                alert(
                    "Something went wrong while placing your order."
                );


            } finally {

                if (placeOrderButton) {

                    placeOrderButton.disabled =
                        false;

                    placeOrderButton.textContent =
                        "✓ Confirm Order";
                }
            }

        }
    );
}


/* =========================================================
   ADMIN ORDER HELPERS
   ========================================================= */


/* Normalize order items */

function normalizeOrderItems(
    items
) {

    if (!items) {
        return [];
    }


    if (Array.isArray(items)) {
        return items;
    }


    if (
        typeof items ===
        "string"
    ) {

        try {

            const parsed =
                JSON.parse(
                    items
                );


            return Array.isArray(
                parsed
            )
                ? parsed
                : [];

        } catch (error) {

            return [];
        }
    }


    return [];
}


/* Enrich order items */

function enrichOrderItems(
    items
) {

    return normalizeOrderItems(
        items
    ).map(item => {

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
                Number(
                    item.price ||
                    0
                ),

            quantity:
                Math.max(
                    1,
                    Number(
                        item.quantity ||
                        1
                    )
                )
        };

    });
}


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* Cart */

        updateCartCount();


        /* Product details */

        loadProductDetails();


        /* Cart page */

        renderCart();


        /* Checkout */

        renderCheckout();


        /* Checkout form */

        setupCheckout();


        /* Product links */

        setupProductLinks();


        /* Search */

        setupSearch();


        /* Mobile navigation */

        setupMobileMenu();

    }
);


/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.products =
    products;


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


/* =========================================================
   DREAM SHOP — END
   ========================================================= */
