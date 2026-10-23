/* =========================================================
   DREAM SHOP
   Premium E-Commerce JavaScript
   ========================================================= */


/* =========================================================
   1. SUPABASE CONFIGURATION
   ========================================================= */

const SUPABASE_URL =
    "https://lwnisnbsfqqmrifujnbw.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_G2Lrr0dofsmmEWqJACdXrw_GuRHwitt";

let supabaseClient = null;

if (
    typeof window.supabase !== "undefined" &&
    SUPABASE_URL &&
    SUPABASE_PUBLISHABLE_KEY
) {
    supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        );
}


/* =========================================================
   2. PRODUCT DATABASE
   ========================================================= */

const products = [
    {
        id: "earbuds",
        name: "Wireless Earbuds",
        price: 1850,
        image: "images/earbuds.png",
        description:
            "Premium wireless earbuds with clear sound, comfortable fit and modern design.",
        features: [
            "High-quality sound",
            "Wireless connectivity",
            "Comfortable design",
            "Portable charging case"
        ]
    },

    {
        id: "smart-watch",
        name: "Smart Watch",
        price: 2450,
        image: "images/smart-watch.png",
        description:
            "Modern smart watch with a premium design and useful everyday features.",
        features: [
            "Premium display",
            "Modern design",
            "Fitness tracking",
            "Long battery life"
        ]
    },

    {
        id: "power-bank",
        name: "Power Bank 30000mAh",
        price: 1650,
        image: "images/power-bank.png",
        description:
            "High-capacity power bank designed to keep your devices charged throughout the day.",
        features: [
            "30000mAh capacity",
            "Fast charging",
            "Multiple charging ports",
            "Portable design"
        ]
    },

    {
        id: "projector",
        name: "Mini Projector 4K",
        price: 4200,
        image: "images/projector.png",
        description:
            "Compact mini projector for movies, presentations and entertainment.",
        features: [
            "4K support",
            "Compact body",
            "Large screen experience",
            "Easy to carry"
        ]
    },

    {
        id: "selfie-stick",
        name: "Selfie Stick Tripod",
        price: 950,
        image: "images/selfie-stick.png",
        description:
            "Flexible selfie stick and tripod designed for photos, videos and social media.",
        features: [
            "Selfie stick",
            "Tripod mode",
            "Adjustable design",
            "Lightweight"
        ]
    },

    {
        id: "neckband",
        name: "Bluetooth Neckband",
        price: 1250,
        image: "images/neckband.png",
        description:
            "Comfortable Bluetooth neckband with clear audio and convenient controls.",
        features: [
            "Bluetooth connectivity",
            "Clear audio",
            "Comfortable neck design",
            "Easy controls"
        ]
    }
];


/* =========================================================
   3. BASIC HELPERS
   ========================================================= */

function formatPrice(price) {
    return "৳" + Number(price || 0).toLocaleString("en-US");
}


function getProductById(id) {
    return products.find(
        product =>
            String(product.id) === String(id)
    );
}


function getProductImage(id, name = "") {
    const product =
        getProductById(id);

    if (product?.image) {
        return product.image;
    }

    const cleanName =
        String(name)
            .toLowerCase()
            .replace(/\s+/g, "-");

    const possibleProduct =
        products.find(product =>
            product.name
                .toLowerCase()
                .includes(
                    cleanName
                ) ||
            cleanName.includes(
                product.name
                    .toLowerCase()
            )
        );

    return (
        possibleProduct?.image ||
        "images/earbuds.png"
    );
}


/* =========================================================
   4. CART SYSTEM
   ========================================================= */

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


function saveCart(cart) {
    localStorage.setItem(
        "dreamShopCart",
        JSON.stringify(cart)
    );

    updateCartCount();
}


function getCartTotalItems() {
    return getCart().reduce(
        (total, item) =>
            total +
            Number(
                item.quantity || 1
            ),
        0
    );
}


function getCartTotalPrice() {
    return getCart().reduce(
        (total, item) => {
            const product =
                getProductById(item.id);

            const price =
                product?.price ??
                Number(item.price || 0);

            return (
                total +
                price *
                    Number(
                        item.quantity || 1
                    )
            );
        },
        0
    );
}


/* =========================================================
   5. CART COUNT
   ========================================================= */

function updateCartCount() {
    const count =
        getCartTotalItems();

    const cartCounters =
        document.querySelectorAll(
            "#cartCount, .cart-count, [data-cart-count]"
        );

    cartCounters.forEach(
        counter => {
            counter.textContent =
                count;
        }
    );
}


/* =========================================================
   6. ADD TO CART
   ========================================================= */

function addToCart(
    productId,
    quantity = 1
) {
    const product =
        getProductById(productId);

    if (!product) {
        alert(
            "Product not found."
        );

        return;
    }

    const cart = getCart();

    const existingItem =
        cart.find(
            item =>
                String(item.id) ===
                String(productId)
        );

    if (existingItem) {
        existingItem.quantity =
            Number(
                existingItem.quantity ||
                    1
            ) +
            Number(quantity || 1);

    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity:
                Number(quantity || 1)
        });
    }

    saveCart(cart);

    showToast(
        "Added to cart successfully."
    );
}


/* =========================================================
   7. REMOVE FROM CART
   ========================================================= */

function removeFromCart(productId) {
    const cart =
        getCart().filter(
            item =>
                String(item.id) !==
                String(productId)
        );

    saveCart(cart);

    renderCart();
}


/* =========================================================
   8. CHANGE CART QUANTITY
   ========================================================= */

function changeCartQuantity(
    productId,
    change
) {
    const cart = getCart();

    const item =
        cart.find(
            cartItem =>
                String(
                    cartItem.id
                ) ===
                String(productId)
        );

    if (!item) return;

    item.quantity =
        Number(item.quantity || 1) +
        Number(change);

    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCart(cart);

    renderCart();
}


/* =========================================================
   9. SET EXACT QUANTITY
   ========================================================= */

function setCartQuantity(
    productId,
    quantity
) {
    const cart = getCart();

    const item =
        cart.find(
            cartItem =>
                String(
                    cartItem.id
                ) ===
                String(productId)
        );

    if (!item) return;

    item.quantity =
        Math.max(
            1,
            Number(quantity || 1)
        );

    saveCart(cart);

    renderCart();
}


/* =========================================================
   10. TOAST MESSAGE
   ========================================================= */

function showToast(message) {
    let toast =
        document.getElementById(
            "dreamShopToast"
        );

    if (!toast) {
        toast =
            document.createElement(
                "div"
            );

        toast.id =
            "dreamShopToast";

        toast.style.position =
            "fixed";

        toast.style.bottom =
            "25px";

        toast.style.left =
            "50%";

        toast.style.transform =
            "translateX(-50%)";

        toast.style.zIndex =
            "99999";

        toast.style.padding =
            "13px 20px";

        toast.style.borderRadius =
            "14px";

        toast.style.background =
            "#0b1220";

        toast.style.color =
            "#ffffff";

        toast.style.border =
            "1px solid rgba(34,211,238,.35)";

        toast.style.boxShadow =
            "0 15px 40px rgba(0,0,0,.3)";

        toast.style.fontSize =
            "14px";

        toast.style.fontWeight =
            "600";

        toast.style.transition =
            "all .3s ease";

        document.body.appendChild(
            toast
        );
    }

    toast.textContent =
        message;

    toast.style.opacity =
        "1";

    toast.style.transform =
        "translateX(-50%) translateY(0)";

    clearTimeout(
        window.dreamShopToastTimer
    );

    window.dreamShopToastTimer =
        setTimeout(() => {
            toast.style.opacity =
                "0";

            toast.style.transform =
                "translateX(-50%) translateY(10px)";
        }, 2200);
}


/* =========================================================
   11. PRODUCT DETAILS
   ========================================================= */

function setupProductDetails() {
    const params =
        new URLSearchParams(
            window.location.search
        );

    const productId =
        params.get("id");

    if (!productId) return;

    const product =
        getProductById(productId);

    if (!product) return;

    const title =
        document.getElementById(
            "productTitle"
        );

    const price =
        document.getElementById(
            "productPrice"
        );

    const image =
        document.getElementById(
            "productImage"
        );

    const description =
        document.getElementById(
            "productDescription"
        );

    const features =
        document.getElementById(
            "productFeatures"
        );

    if (title) {
        title.textContent =
            product.name;
    }

    if (price) {
        price.textContent =
            formatPrice(
                product.price
            );
    }

    if (image) {
        image.src =
            product.image;

        image.alt =
            product.name;

        image.onerror =
            function () {
                this.src =
                    "images/earbuds.png";
            };
    }

    if (description) {
        description.textContent =
            product.description;
    }

    if (features) {
        features.innerHTML =
            product.features
                .map(
                    feature =>
                        `<li>✓ ${feature}</li>`
                )
                .join("");
    }

    const quantityInput =
        document.getElementById(
            "productQuantity"
        );

    const minusButton =
        document.getElementById(
            "decreaseQuantity"
        );

    const plusButton =
        document.getElementById(
            "increaseQuantity"
        );

    if (minusButton) {
        minusButton.onclick =
            function () {
                const current =
                    Number(
                        quantityInput?.value ||
                            1
                    );

                if (quantityInput) {
                    quantityInput.value =
                        Math.max(
                            1,
                            current - 1
                        );
                }
            };
    }

    if (plusButton) {
        plusButton.onclick =
            function () {
                const current =
                    Number(
                        quantityInput?.value ||
                            1
                    );

                if (quantityInput) {
                    quantityInput.value =
                        current + 1;
                }
            };
    }

    const addButton =
        document.getElementById(
            "addToCartButton"
        );

    const buyButton =
        document.getElementById(
            "buyNowButton"
        );

    if (addButton) {
        addButton.onclick =
            function () {
                const quantity =
                    Number(
                        quantityInput?.value ||
                            1
                    );

                addToCart(
                    product.id,
                    quantity
                );
            };
    }

    if (buyButton) {
        buyButton.onclick =
            function () {
                const quantity =
                    Number(
                        quantityInput?.value ||
                            1
                    );

                addToCart(
                    product.id,
                    quantity
                );

                window.location.href =
                    "checkout.html";
            };
    }
}


/* =========================================================
   12. PRODUCT CARDS
   ========================================================= */

function setupProductLinks() {
    const productLinks =
        document.querySelectorAll(
            "[data-product-id]"
        );

    productLinks.forEach(
        element => {
            const productId =
                element.dataset.productId;

            if (!getProductById(productId)) {
                return;
            }

            if (
                element.tagName ===
                "A"
            ) {
                element.href =
                    `product.html?id=${encodeURIComponent(
                        productId
                    )}`;
            }
        }
    );
}


/* =========================================================
   13. SEARCH
   ========================================================= */

function setupSearch() {
    const searchInput =
        document.getElementById(
            "searchInput"
        );

    if (!searchInput) return;

    searchInput.addEventListener(
        "input",
        function () {
            const keyword =
                this.value
                    .trim()
                    .toLowerCase();

            const cards =
                document.querySelectorAll(
                    "[data-product-card]"
                );

            cards.forEach(card => {
                const text =
                    card.textContent
                        .toLowerCase();

                card.style.display =
                    !keyword ||
                    text.includes(keyword)
                        ? ""
                        : "none";
            });
        }
    );
}


/* =========================================================
   14. CART PAGE
   ========================================================= */

function renderCart() {
    const cartContainer =
        document.getElementById(
            "cartItems"
        );

    const emptyCart =
        document.getElementById(
            "emptyCart"
        );

    const totalItemsElement =
        document.getElementById(
            "cartTotalItems"
        );

    const totalPriceElement =
        document.getElementById(
            "cartTotalPrice"
        );

    if (!cartContainer) {
        return;
    }

    const cart = getCart();

    if (cart.length === 0) {
        cartContainer.innerHTML =
            "";

        if (emptyCart) {
            emptyCart.style.display =
                "block";
        }

        if (totalItemsElement) {
            totalItemsElement.textContent =
                "0";
        }

        if (totalPriceElement) {
            totalPriceElement.textContent =
                "৳0";
        }

        return;
    }

    if (emptyCart) {
        emptyCart.style.display =
            "none";
    }

    cartContainer.innerHTML =
        cart
            .map(item => {
                const product =
                    getProductById(
                        item.id
                    );

                const name =
                    product?.name ||
                    item.name;

                const image =
                    product?.image ||
                    item.image ||
                    getProductImage(
                        item.id,
                        item.name
                    );

                const price =
                    product?.price ??
                    Number(
                        item.price || 0
                    );

                const quantity =
                    Number(
                        item.quantity || 1
                    );

                const subtotal =
                    price * quantity;

                return `
                    <div class="cart-item"
                         data-cart-item="${item.id}">

                        <img
                            src="${image}"
                            alt="${name}"
                            onerror="this.src='images/earbuds.png'"
                        >

                        <div class="cart-item-info">

                            <h3>${name}</h3>

                            <p>
                                ${formatPrice(price)}
                            </p>

                            <div class="cart-item-actions">

                                <button
                                    type="button"
                                    onclick="changeCartQuantity('${item.id}', -1)"
                                >
                                    −
                                </button>

                                <span>
                                    ${quantity}
                                </span>

                                <button
                                    type="button"
                                    onclick="changeCartQuantity('${item.id}', 1)"
                                >
                                    +
                                </button>

                                <button
                                    type="button"
                                    onclick="removeFromCart('${item.id}')"
                                >
                                    Remove
                                </button>

                            </div>

                        </div>

                        <strong>
                            ${formatPrice(subtotal)}
                        </strong>

                    </div>
                `;
            })
            .join("");

    if (totalItemsElement) {
        totalItemsElement.textContent =
            getCartTotalItems();
    }

    if (totalPriceElement) {
        totalPriceElement.textContent =
            formatPrice(
                getCartTotalPrice()
            );
    }
}


/* =========================================================
   15. CHECKOUT PAGE
   ========================================================= */

function renderCheckout() {
    const checkoutItems =
        document.getElementById(
            "checkoutItems"
        );

    const totalItemsElement =
        document.getElementById(
            "checkoutTotalItems"
        );

    const totalPriceElement =
        document.getElementById(
            "checkoutTotalPrice"
        );

    if (!checkoutItems) {
        return;
    }

    const cart = getCart();

    if (cart.length === 0) {
        checkoutItems.innerHTML =
            `
                <div style="
                    padding:20px;
                    text-align:center;
                    border-radius:16px;
                    background:#f8fafc;
                ">
                    Your cart is empty.
                </div>
            `;

        if (totalItemsElement) {
            totalItemsElement.textContent =
                "0";
        }

        if (totalPriceElement) {
            totalPriceElement.textContent =
                "৳0";
        }

        return;
    }

    checkoutItems.innerHTML =
        cart
            .map(item => {
                const product =
                    getProductById(
                        item.id
                    );

                const name =
                    product?.name ||
                    item.name;

                const image =
                    product?.image ||
                    item.image ||
                    getProductImage(
                        item.id,
                        item.name
                    );

                const price =
                    product?.price ??
                    Number(
                        item.price || 0
                    );

                const quantity =
                    Number(
                        item.quantity || 1
                    );

                const subtotal =
                    price * quantity;

                return `
                    <div class="checkout-item">

                        <img
                            src="${image}"
                            alt="${name}"
                            onerror="this.src='images/earbuds.png'"
                        >

                        <div>
                            <strong>
                                ${name}
                            </strong>

                            <div>
                                ${quantity} ×
                                ${formatPrice(price)}
                            </div>
                        </div>

                        <strong>
                            ${formatPrice(subtotal)}
                        </strong>

                    </div>
                `;
            })
            .join("");

    if (totalItemsElement) {
        totalItemsElement.textContent =
            getCartTotalItems();
    }

    if (totalPriceElement) {
        totalPriceElement.textContent =
            formatPrice(
                getCartTotalPrice()
            );
    }
}


/* =========================================================
   16. CHECKOUT / PLACE ORDER
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
                        getProductById(
                            item.id
                        );

                    const quantity =
                        Number(
                            item.quantity || 1
                        );

                    const price =
                        product?.price ??
                        Number(
                            item.price || 0
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
                            item.name,

                        image:
                            image,

                        quantity:
                            quantity,

                        price:
                            price,

                        subtotal:
                            quantity * price
                    };
                });

            if (placeOrderButton) {
                placeOrderButton.disabled =
                    true;

                placeOrderButton.textContent =
                    "Processing...";
            }

            try {
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

                const confirmationOrder = {
                    orderId:
                        data.id,

                    customerName:
                        customerName,

                    customerPhone:
                        customerPhone,

                    customerDistrict:
                        customerDistrict,

                    customerAddress:
                        customerAddress,

                    customerNote:
                        customerNote || "",

                    items:
                        orderItems,

                    totalItems:
                        totalItems,

                    totalPrice:
                        totalPrice,

                    status:
                        "pending"
                };

                localStorage.setItem(
                    "dreamShopLastOrder",
                    JSON.stringify(
                        confirmationOrder
                    )
                );

                localStorage.removeItem(
                    "dreamShopCart"
                );

                updateCartCount();

                window.location.href =
                    "order-confirmation.html";

            } catch (error) {
                console.error(
                    "Order placement error:",
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
                        "✅ Confirm Order";
                }
            }
        }
    );
}


/* =========================================================
   17. MOBILE MENU
   ========================================================= */

function setupMobileMenu() {
    const menuButton =
        document.getElementById(
            "menuButton"
        );

    const mobileMenu =
        document.getElementById(
            "mobileMenu"
        );

    if (!menuButton || !mobileMenu) {
        return;
    }

    menuButton.addEventListener(
        "click",
        function () {
            mobileMenu.classList.toggle(
                "active"
            );
        }
    );
}


/* =========================================================
   18. PRODUCT CARD BUY BUTTONS
   ========================================================= */

function setupProductButtons() {
    document.addEventListener(
        "click",
        function (event) {
            const addButton =
                event.target.closest(
                    "[data-add-to-cart]"
                );

            if (addButton) {
                event.preventDefault();

                const productId =
                    addButton.dataset
                        .addToCart;

                const quantity =
                    Number(
                        addButton.dataset
                            .quantity || 1
                    );

                addToCart(
                    productId,
                    quantity
                );

                return;
            }

            const buyButton =
                event.target.closest(
                    "[data-buy-now]"
                );

            if (buyButton) {
                event.preventDefault();

                const productId =
                    buyButton.dataset
                        .buyNow;

                const quantity =
                    Number(
                        buyButton.dataset
                            .quantity || 1
                    );

                addToCart(
                    productId,
                    quantity
                );

                window.location.href =
                    "checkout.html";
            }
        }
    );
}


/* =========================================================
   19. HOME PRODUCT LINKS
   ========================================================= */

function setupProductCardLinks() {
    const links =
        document.querySelectorAll(
            "[data-product-link]"
        );

    links.forEach(link => {
        const id =
            link.dataset
                .productLink;

        if (!id) return;

        link.href =
            `product.html?id=${encodeURIComponent(
                id
            )}`;
    });
}


/* =========================================================
   20. ORDER CONFIRMATION PAGE
   ========================================================= */

function renderOrderConfirmation() {
    const order =
        getSavedOrder();

    const container =
        document.getElementById(
            "orderConfirmation"
        );

    if (!container) {
        return;
    }

    if (!order) {
        container.innerHTML = `
            <div style="
                max-width:700px;
                margin:60px auto;
                padding:40px 25px;
                text-align:center;
                border-radius:24px;
                background:#ffffff;
                box-shadow:0 20px 60px rgba(15,23,42,.10);
            ">

                <div style="
                    font-size:55px;
                    margin-bottom:15px;
                ">
                    🛍️
                </div>

                <h1>
                    No Recent Order Found
                </h1>

                <p>
                    We couldn't find a recent order
                    on this device.
                </p>

                <a
                    href="index.html"
                    style="
                        display:inline-block;
                        margin-top:20px;
                        padding:14px 25px;
                        border-radius:12px;
                        background:#0f172a;
                        color:white;
                        text-decoration:none;
                        font-weight:700;
                    "
                >
                    Continue Shopping
                </a>

            </div>
        `;

        return;
    }

    const items =
        Array.isArray(order.items)
            ? order.items
            : [];

    const itemHTML =
        items
            .map(item => {
                const image =
                    item.image ||
                    getProductImage(
                        item.product_id,
                        item.name
                    );

                const quantity =
                    Number(
                        item.quantity || 1
                    );

                const price =
                    Number(
                        item.price || 0
                    );

                const subtotal =
                    Number(
                        item.subtotal ||
                            price *
                                quantity
                    );

                return `
                    <div class="confirmation-product"
                         style="
                            display:flex;
                            align-items:center;
                            gap:16px;
                            padding:16px;
                            margin-bottom:12px;
                            border:1px solid #e5e7eb;
                            border-radius:16px;
                            background:#ffffff;
                         ">

                        <img
                            src="${image}"
                            alt="${item.name || "Product"}"
                            onerror="this.src='images/earbuds.png'"
                            style="
                                width:76px;
                                height:76px;
                                object-fit:contain;
                                border-radius:12px;
                                background:#f8fafc;
                                padding:6px;
                            "
                        >

                        <div style="
                            flex:1;
                        ">

                            <h3 style="
                                margin:0 0 6px;
                                font-size:16px;
                            ">
                                ${item.name || "Product"}
                            </h3>

                            <p style="
                                margin:0;
                                color:#64748b;
                                font-size:14px;
                            ">
                                ${quantity} ×
                                ${formatPrice(price)}
                            </p>

                        </div>

                        <strong style="
                            white-space:nowrap;
                            font-size:15px;
                        ">
                            ${formatPrice(subtotal)}
                        </strong>

                    </div>
                `;
            })
            .join("");

    container.innerHTML = `

        <div style="
            max-width:900px;
            margin:30px auto 60px;
            padding:20px;
        ">

            <!-- THANK YOU -->

            <div style="
                text-align:center;
                padding:40px 20px;
                border-radius:28px;
                background:
                    linear-gradient(
                        135deg,
                        #eff6ff,
                        #ecfeff
                    );
                border:1px solid #dbeafe;
                margin-bottom:25px;
            ">

                <div style="
                    font-size:58px;
                    margin-bottom:10px;
                ">
                    🎉
                </div>

                <h1 style="
                    margin:0 0 12px;
                    font-size:32px;
                    color:#0f172a;
                ">
                    Thank You for Your Order!
                </h1>

                <p style="
                    margin:0 auto;
                    max-width:650px;
                    line-height:1.8;
                    color:#475569;
                    font-size:16px;
                ">
                    আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।<br>
                    কিছুক্ষণের মধ্যে আমাদের একজন প্রতিনিধি
                    আপনাকে ফোন দিয়ে আপনার অর্ডারটি কনফার্ম
                    করে দেবেন।<br>
                    আমাদের সাথে থাকার জন্য ধন্যবাদ। ❤️
                </p>

            </div>


            <!-- ORDER STATUS -->

            <div style="
                padding:20px;
                border-radius:20px;
                background:#0f172a;
                color:#ffffff;
                margin-bottom:20px;
            ">

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:15px;
                    flex-wrap:wrap;
                ">

                    <div>
                        <small style="
                            color:#94a3b8;
                        ">
                            Order ID
                        </small>

                        <div style="
                            font-size:22px;
                            font-weight:800;
                            margin-top:3px;
                        ">
                            #${order.orderId}
                        </div>
                    </div>

                    <div style="
                        padding:9px 15px;
                        border-radius:30px;
                        background:#f59e0b;
                        color:#ffffff;
                        font-size:13px;
                        font-weight:700;
                    ">
                        ⏳ Confirmation Pending
                    </div>

                </div>

            </div>


            <!-- CUSTOMER INFORMATION -->

            <div style="
                background:#ffffff;
                border:1px solid #e5e7eb;
                border-radius:22px;
                padding:25px;
                margin-bottom:20px;
            ">

                <h2 style="
                    margin:0 0 20px;
                    font-size:21px;
                    color:#0f172a;
                ">
                    Customer Information
                </h2>

                <div style="
                    display:grid;
                    grid-template-columns:
                        repeat(
                            auto-fit,
                            minmax(230px, 1fr)
                        );
                    gap:16px;
                ">

                    <div>
                        <small style="
                            color:#64748b;
                        ">
                            Name
                        </small>

                        <div style="
                            font-weight:700;
                            margin-top:4px;
                        ">
                            ${order.customerName || "-"}
                        </div>
                    </div>

                    <div>
                        <small style="
                            color:#64748b;
                        ">
                            Phone Number
                        </small>

                        <div style="
                            font-weight:700;
                            margin-top:4px;
                        ">
                            ${order.customerPhone || "-"}
                        </div>
                    </div>

                    <div>
                        <small style="
                            color:#64748b;
                        ">
                            District
                        </small>

                        <div style="
                            font-weight:700;
                            margin-top:4px;
                        ">
                            ${order.customerDistrict || "-"}
                        </div>
                    </div>

                    <div style="
                        grid-column:
                            1 / -1;
                    ">

                        <small style="
                            color:#64748b;
                        ">
                            Full Address
                        </small>

                        <div style="
                            font-weight:700;
                            margin-top:4px;
                            line-height:1.6;
                        ">
                            ${order.customerAddress || "-"}
                        </div>

                    </div>

                    ${
                        order.customerNote
                            ? `
                                <div style="
                                    grid-column:1 / -1;
                                ">

                                    <small style="
                                        color:#64748b;
                                    ">
                                        Note
                                    </small>

                                    <div style="
                                        font-weight:600;
                                        margin-top:4px;
                                    ">
                                        ${order.customerNote}
                                    </div>

                                </div>
                            `
                            : ""
                    }

                </div>

            </div>


            <!-- ORDERED PRODUCTS -->

            <div style="
                background:#ffffff;
                border:1px solid #e5e7eb;
                border-radius:22px;
                padding:25px;
                margin-bottom:20px;
            ">

                <h2 style="
                    margin:0 0 20px;
                    font-size:21px;
                    color:#0f172a;
                ">
                    Ordered Products
                </h2>

                ${itemHTML}

                <div style="
                    margin-top:20px;
                    padding-top:18px;
                    border-top:1px solid #e5e7eb;
                ">

                    <div style="
                        display:flex;
                        justify-content:space-between;
                        margin-bottom:10px;
                        color:#64748b;
                    ">
                        <span>
                            Total Items
                        </span>

                        <strong>
                            ${order.totalItems || 0}
                        </strong>
                    </div>

                    <div style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                    ">

                        <strong style="
                            font-size:19px;
                            color:#0f172a;
                        ">
                            Total Amount
                        </strong>

                        <strong style="
                            font-size:25px;
                            color:#0284c7;
                        ">
                            ${formatPrice(
                                order.totalPrice || 0
                            )}
                        </strong>

                    </div>

                </div>

            </div>


            <!-- BUTTONS -->

            <div style="
                display:flex;
                gap:12px;
                justify-content:center;
                flex-wrap:wrap;
            ">

                <a
                    href="index.html"
                    style="
                        display:inline-flex;
                        justify-content:center;
                        align-items:center;
                        min-width:190px;
                        padding:15px 22px;
                        border-radius:14px;
                        background:#0f172a;
                        color:#ffffff;
                        text-decoration:none;
                        font-weight:700;
                    "
                >
                    🏠 Back to Home
                </a>

                <a
                    href="index.html"
                    style="
                        display:inline-flex;
                        justify-content:center;
                        align-items:center;
                        min-width:190px;
                        padding:15px 22px;
                        border-radius:14px;
                        background:#0284c7;
                        color:#ffffff;
                        text-decoration:none;
                        font-weight:700;
                    "
                >
                    🛍️ Continue Shopping
                </a>

            </div>

        </div>
    `;
}


/* =========================================================
   21. GET SAVED ORDER
   ========================================================= */

function getSavedOrder() {
    try {
        const saved =
            localStorage.getItem(
                "dreamShopLastOrder"
            );

        if (!saved) {
            return null;
        }

        return JSON.parse(saved);

    } catch (error) {
        console.error(
            "Saved order error:",
            error
        );

        return null;
    }
}


/* =========================================================
   22. INITIALIZE EVERYTHING
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

        setupProductDetails();

        setupProductLinks();

        setupProductCardLinks();

        setupSearch();

        setupMobileMenu();

        setupProductButtons();

        renderCart();

        renderCheckout();

        setupCheckout();

        renderOrderConfirmation();

    }
);


/* =========================================================
   23. GLOBAL FUNCTIONS
   ========================================================= */

window.products =
    products;

window.getCart =
    getCart;

window.addToCart =
    addToCart;

window.removeFromCart =
    removeFromCart;

window.changeCartQuantity =
    changeCartQuantity;

window.setCartQuantity =
    setCartQuantity;

window.getProductById =
    getProductById;

window.getCartTotalItems =
    getCartTotalItems;

window.getCartTotalPrice =
    getCartTotalPrice;

window.updateCartCount =
    updateCartCount;

window.renderCart =
    renderCart;

window.renderCheckout =
    renderCheckout;

window.setupCheckout =
    setupCheckout;

window.renderOrderConfirmation =
    renderOrderConfirmation;

window.getSavedOrder =
    getSavedOrder;
