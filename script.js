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
                alert("Your cart is empty.");
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

                /*
                 * Save the confirmed order information
                 * temporarily so the confirmation page
                 * can display the complete order details.
                 */

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

                /*
                 * Clear cart after successful order.
                 */

                localStorage.removeItem(
                    "dreamShopCart"
                );

                updateCartCount();

                /*
                 * Open the new order confirmation page.
                 */

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
