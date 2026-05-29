let product = ProductStore.findProduct(new URLSearchParams(window.location.search).get("id"));

const detail = document.querySelector("[data-detail]");
const cartDrawer = document.querySelector("[data-cart-drawer]");
const cartItems = document.querySelector("[data-cart-items]");
const cartTotal = document.querySelector("[data-cart-total]");
const cartCount = document.querySelector("[data-cart-count]");
const toast = document.querySelector("[data-toast]");

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function defaultOption() {
  if (I18n.current() === "ko") return "기본 옵션";
  if (I18n.current() === "zh") return "默认选项";
  return "Default option";
}

function addedMessage() {
  if (I18n.current() === "ko") return "장바구니에 담았습니다.";
  if (I18n.current() === "zh") return "已加入购物车。";
  return "Added to cart.";
}

function optionList(productOptionText) {
  return String(productOptionText || defaultOption())
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function typeLabel(product) {
  if (product.productType === "digital") return I18n.t("digital");
  if (product.productType === "bundle") return I18n.t("bundle");
  return I18n.t("case");
}

function deliveryLabel(product) {
  if (product.deliveryType === "digital") return I18n.t("digitalDelivery");
  if (product.deliveryType === "both") return I18n.t("bothDelivery");
  return I18n.t("shippingDelivery");
}

function renderDetail() {
  const displayProduct = product ? I18n.localizedProduct(product) : null;
  if (!displayProduct || displayProduct.status === "hidden") {
    detail.innerHTML = `
      <section class="result-box detail-missing">
        <p class="eyebrow">Not Found</p>
        <h1>${I18n.t("productNotFound")}</h1>
        <p>${I18n.t("productNotFoundCopy")}</p>
        <a class="primary-btn" href="index.html">${I18n.t("backStore")}</a>
      </section>
    `;
    return;
  }

  const gallery = Array.from(new Set([displayProduct.image, ...displayProduct.gallery].filter(Boolean)));
  const options = optionList(displayProduct.optionText);
  detail.innerHTML = `
    <nav class="product-local-nav">
      <strong>${escapeHtml(displayProduct.title)}</strong>
      <a href="#buy">${I18n.t("buy")}</a>
    </nav>

    <section class="apple-detail-hero">
      <div>
        <p class="eyebrow">${escapeHtml(displayProduct.category)}</p>
        <h1>${escapeHtml(displayProduct.title)}</h1>
        <p>${escapeHtml(displayProduct.subtitle)}</p>
        <strong>${ProductStore.formatWon(displayProduct.price)}</strong>
      </div>
      <img src="${escapeHtml(displayProduct.image)}" alt="${escapeHtml(displayProduct.title)}" />
    </section>

    <section class="apple-feature-band">
      <article>
        <span>${escapeHtml(displayProduct.badge)}</span>
        <strong>${typeLabel(displayProduct)}</strong>
      </article>
      <article>
        <span>${I18n.t("experience")}</span>
        <strong>${deliveryLabel(displayProduct)}</strong>
      </article>
      <article>
        <span>${I18n.t("quantity")}</span>
        <strong>${displayProduct.productType === "digital" ? "∞" : displayProduct.stock}</strong>
      </article>
    </section>

    <section class="apple-showcase">
      <div class="showcase-copy">
        <p class="eyebrow">${I18n.t("story")}</p>
        <h2>${escapeHtml(displayProduct.title)}</h2>
        <p>${escapeHtml(displayProduct.detail)}</p>
      </div>
      <div class="showcase-media">
        <img class="detail-main-image" src="${escapeHtml(displayProduct.image)}" alt="${escapeHtml(displayProduct.title)}" data-main-image />
        <div class="detail-thumbs">
          ${gallery
            .map(
              (image) => `
                <button type="button" data-thumb="${escapeHtml(image)}" aria-label="${I18n.t("gallery")}">
                  <img src="${escapeHtml(image)}" alt="${escapeHtml(displayProduct.title)}" />
                </button>
              `,
            )
            .join("")}
        </div>
      </div>
    </section>

    <section class="apple-video-section">
      <div>
        <p class="eyebrow">${I18n.t("gallery")}</p>
        <h2>${I18n.t("gallery")}</h2>
      </div>
      ${
        displayProduct.video
          ? `<video class="detail-video" src="${escapeHtml(displayProduct.video)}" controls playsinline preload="metadata"></video>`
          : `<div class="video-empty">${I18n.t("noVideo")}</div>`
      }
    </section>

    <section class="apple-buy-section" id="buy">
      <div class="buy-copy">
        <p class="eyebrow">${I18n.t("included")}</p>
        <h2>${I18n.t("included")}</h2>
        <ul class="included-list">
          ${displayProduct.includedItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
        <p>${displayProduct.deliveryType === "digital" ? I18n.t("digitalExperience") : displayProduct.deliveryType === "both" ? I18n.t("bothExperience") : I18n.t("shippingExperience")}</p>
      </div>
      <form class="detail-info apple-buy-card" data-detail-form>
        <h2>${I18n.t("buy")}</h2>
        <strong class="detail-price">${ProductStore.formatWon(displayProduct.price)}</strong>
        <label>${I18n.t("optionSelect")}
          <select name="option">
            ${options.map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("")}
          </select>
        </label>
        <label>${I18n.t("quantity")}
          <input name="quantity" type="number" min="1" max="${Math.max(displayProduct.stock, 1)}" value="1" />
        </label>
        <div class="detail-actions">
          <button class="secondary-btn" type="button" data-add-cart>${I18n.t("addCartLong")}</button>
          <button class="primary-btn" type="button" data-buy-now>${I18n.t("buyNow")}</button>
        </div>
      </form>
    </section>
  `;
}

function renderCart() {
  const cart = ProductStore.loadCart();
  cartCount.textContent = cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
  cartItems.innerHTML =
    cart.length === 0
      ? `<p class="checkout-note">${I18n.t("cartEmpty")}</p>`
      : cart
          .map(
            (item) => `
              <div class="cart-line">
                <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" />
                <div>
                  <h3>${escapeHtml(item.title)}</h3>
                  <span>${escapeHtml(item.option)} · ${item.quantity}개 · ${ProductStore.formatWon(item.price * item.quantity)}</span>
                </div>
                <button class="remove-btn" type="button" data-remove="${escapeHtml(item.lineId)}">삭제</button>
              </div>
            `,
          )
          .join("");
  cartTotal.textContent = ProductStore.formatWon(ProductStore.cartTotal(cart));
}

function selectedPurchase() {
  const data = new FormData(document.querySelector("[data-detail-form]"));
  return {
    option: data.get("option"),
    quantity: Number(data.get("quantity")) || 1,
  };
}

function goCheckout() {
  if (!ProductStore.loadCart().length) {
    showToast(I18n.t("cartEmpty"));
    return;
  }
  window.location.href = "checkout.html";
}

detail.addEventListener("click", (event) => {
  const thumb = event.target.closest("[data-thumb]");
  if (thumb) {
    document.querySelector("[data-main-image]").src = thumb.dataset.thumb;
    return;
  }

  if (event.target.closest("[data-add-cart]")) {
    const purchase = selectedPurchase();
    ProductStore.addToCart(product, purchase.quantity, purchase.option);
    renderCart();
    cartDrawer.classList.add("open");
    showToast(addedMessage());
    return;
  }

  if (event.target.closest("[data-buy-now]")) {
    const purchase = selectedPurchase();
    ProductStore.addToCart(product, purchase.quantity, purchase.option);
    renderCart();
    goCheckout();
  }
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;
  ProductStore.removeCartLine(button.dataset.remove);
  renderCart();
});

document.querySelector("[data-open-cart]").addEventListener("click", () => cartDrawer.classList.add("open"));
document.querySelector("[data-floating-cart]").addEventListener("click", () => cartDrawer.classList.add("open"));
document.querySelector("[data-close-cart]").addEventListener("click", () => cartDrawer.classList.remove("open"));
document.querySelector("[data-checkout]").addEventListener("click", goCheckout);
window.addEventListener("languagechange", () => {
  I18n.applyStatic();
  renderDetail();
  renderCart();
});

renderDetail();
renderCart();

ProductStore.syncFromRemote().then((synced) => {
  if (!synced) return;
  product = ProductStore.findProduct(new URLSearchParams(window.location.search).get("id"));
  renderDetail();
  renderCart();
});
