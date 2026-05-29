const checkoutForm = document.querySelector("[data-checkout-form]");
const checkoutItems = document.querySelector("[data-checkout-items]");
const checkoutTotal = document.querySelector("[data-checkout-total]");
const shippingFields = document.querySelector("[data-shipping-fields]");
const toast = document.querySelector("[data-toast]");
const paymentConfig = (window.SiteConfig && window.SiteConfig.payment) || { provider: "demo", tossClientKey: "" };

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function deliveryLabel(item) {
  if (item.deliveryType === "digital") return I18n.t("digitalDelivery");
  if (item.deliveryType === "both") return I18n.t("bothDelivery");
  return I18n.t("shippingDelivery");
}

function orderReceivedStatus() {
  if (I18n.current() === "zh") return "订单已接收";
  if (I18n.current() === "en") return "Order received";
  return "주문 접수";
}

function renderCheckout() {
  const cart = ProductStore.loadCart();
  const needsShipping = ProductStore.cartNeedsShipping(cart);
  shippingFields.hidden = !needsShipping;
  shippingFields.querySelectorAll("[name='address']").forEach((input) => {
    input.required = needsShipping;
  });

  if (!cart.length) {
    checkoutItems.innerHTML = `<p class="checkout-note">${I18n.t("cartEmpty")}</p>`;
    checkoutTotal.textContent = ProductStore.formatWon(0);
    return;
  }

  checkoutItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-line">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" />
          <div>
            <h3>${escapeHtml(item.title)}</h3>
            <span>${escapeHtml(item.option)} · ${item.quantity}개 · ${deliveryLabel(item)}</span>
          </div>
          <strong>${ProductStore.formatWon(item.price * item.quantity)}</strong>
        </div>
      `,
    )
    .join("");
  checkoutTotal.textContent = ProductStore.formatWon(ProductStore.cartTotal(cart));
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function requestTossPayment(order) {
  await loadScript("https://js.tosspayments.com/v1/payment");
  const tossPayments = TossPayments(paymentConfig.tossClientKey);
  await tossPayments.requestPayment("카드", {
    amount: order.total,
    orderId: order.id,
    orderName: order.items.length === 1 ? order.items[0].title : `${order.items[0].title} 외 ${order.items.length - 1}건`,
    customerName: order.customer.name,
    customerEmail: order.customer.email,
    successUrl: new URL("success.html", window.location.href).href,
    failUrl: new URL("fail.html", window.location.href).href,
  });
}

checkoutForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const cart = ProductStore.loadCart();
  if (!cart.length) {
    showToast(I18n.t("cartEmpty"));
    return;
  }

  const data = new FormData(checkoutForm);
  const needsShipping = ProductStore.cartNeedsShipping(cart);
  const order = {
    id: "ORDER-" + Date.now(),
    status: orderReceivedStatus(),
    items: cart,
    total: ProductStore.cartTotal(cart),
    needsShipping,
    downloadFiles: cart.flatMap((item) => item.digitalFiles || []),
    customer: {
      name: data.get("name"),
      phone: data.get("phone"),
      email: data.get("email"),
      address: needsShipping ? `${data.get("address")} ${data.get("addressDetail")}`.trim() : "",
      memo: data.get("memo"),
    },
  };
  ProductStore.saveOrder(order);

  if (paymentConfig.provider === "toss" && paymentConfig.tossClientKey) {
    try {
      showToast(I18n.current() === "ko" ? "결제창을 여는 중입니다." : I18n.current() === "zh" ? "正在打开支付窗口。" : "Opening checkout.");
      await requestTossPayment(order);
      return;
    } catch (error) {
      showToast(I18n.current() === "ko" ? "결제창을 열지 못했습니다." : I18n.current() === "zh" ? "无法打开支付窗口。" : "Could not open checkout.");
      return;
    }
  }

  ProductStore.clearCart();
  window.location.href = "success.html";
});

window.addEventListener("languagechange", () => {
  I18n.applyStatic();
  renderCheckout();
});

renderCheckout();
