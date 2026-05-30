let product = ProductStore.findProduct(new URLSearchParams(window.location.search).get("id"));

const detail = document.querySelector("[data-detail]");
const cartDrawer = document.querySelector("[data-cart-drawer]");
const cartItems = document.querySelector("[data-cart-items]");
const cartTotal = document.querySelector("[data-cart-total]");
const cartCount = document.querySelector("[data-cart-count]");
const toast = document.querySelector("[data-toast]");
const SAMPLE_GALLERY = [
  "assets/sample-product-hero.png",
  "assets/sample-detail-scene.png",
  "assets/sample-wallpaper-black-gold.png",
  "assets/sample-wallpaper-midnight.svg",
];
const SAMPLE_MOTION = "assets/sample-product-motion.svg";

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

function blendStyle(settings = {}) {
  const focusX = Number(settings.focusX ?? 56);
  const focusY = Number(settings.focusY ?? 52);
  const width = Number(settings.width ?? 76);
  const height = Number(settings.height ?? 70);
  const fade = Number(settings.fade ?? 18);
  const blur = Number(settings.blur ?? 60);
  const glow = Number(settings.glow ?? 18);
  const enabled = settings.enabled !== false;
  const solid = Math.max(18, Math.min(78, 100 - fade * 2.2));
  const soft = Math.max(solid + 6, Math.min(90, 100 - fade * 1.15));
  const edge = Math.max(soft + 4, Math.min(98, 100 - fade * 0.35));
  const bgSoft = Math.max(24, Math.min(80, 100 - fade * 1.5));
  return [
    `--blend-focus-x: ${focusX}%`,
    `--blend-focus-y: ${focusY}%`,
    `--blend-width: ${width}%`,
    `--blend-height: ${height}%`,
    `--blend-fade: ${fade}%`,
    `--blend-blur: ${blur}px`,
    `--blend-glow: ${glow / 100}`,
    `--blend-overlay: ${enabled ? 1 : 0}`,
    `--blend-solid: ${solid}%`,
    `--blend-soft: ${soft}%`,
    `--blend-edge: ${edge}%`,
    `--blend-bg-soft: ${bgSoft}%`,
  ].join("; ");
}

function blendedImage(src, alt, className = "", settings = {}, loading = "lazy") {
  const image = escapeHtml(src);
  const label = escapeHtml(alt);
  return `
    <span class="blend-media ${className}" style="--blend-image: url('${image}'); ${blendStyle(settings)}">
      <span class="blend-media-bg" aria-hidden="true"></span>
      <img src="${image}" alt="${label}" loading="${loading}" decoding="async" />
    </span>
  `;
}

function setMeta(selector, content) {
  const element = document.querySelector(selector);
  if (element && content) element.setAttribute("content", content);
}

function updateProductMeta(displayProduct) {
  if (!displayProduct || displayProduct.status === "hidden") {
    document.title = `${I18n.t("productNotFound")} | NOIR CASE`;
    setMeta('meta[name="description"]', I18n.t("productNotFoundCopy"));
    return;
  }
  const title = `${displayProduct.title} | NOIR CASE`;
  const description = displayProduct.subtitle || displayProduct.detail || "NOIR CASE premium phone styling set.";
  document.title = title;
  setMeta('meta[name="description"]', description);
  setMeta('meta[property="og:title"]', title);
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[property="og:image"]', displayProduct.image);
  setMeta('meta[name="twitter:title"]', title);
  setMeta('meta[name="twitter:description"]', description);
  setMeta('meta[name="twitter:image"]', displayProduct.image);
}

function renderStorySections(product) {
  return product.storySections
    .map(
      (section, index) => `
        <article class="apple-story-row ${index % 2 ? "reverse" : ""}">
          <div class="apple-story-copy">
            <p class="eyebrow">${escapeHtml(section.eyebrow || product.badge)}</p>
            <h2>${escapeHtml(section.title || product.title)}</h2>
            <p>${escapeHtml(section.body || product.detail)}</p>
          </div>
          <div class="apple-story-media">
            ${blendedImage(section.image || product.image, section.title || product.title, "", product.mediaBlend)}
          </div>
        </article>
      `,
    )
    .join("");
}

function renderDetail() {
  const displayProduct = product ? I18n.localizedProduct(product) : null;
  updateProductMeta(displayProduct);
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

  const productGallery = Array.isArray(displayProduct.gallery) ? displayProduct.gallery.filter(Boolean) : [];
  const hasCustomGallery = productGallery.some((image) => !SAMPLE_GALLERY.includes(image) && image !== displayProduct.image);
  const gallery = Array.from(new Set([displayProduct.image, ...(hasCustomGallery ? productGallery : [...productGallery, ...SAMPLE_GALLERY])].filter(Boolean)));
  const options = optionList(displayProduct.optionText);
  const specs = displayProduct.specs && displayProduct.specs.length ? displayProduct.specs : [];

  detail.innerHTML = `
    <nav class="product-local-nav">
      <strong>${escapeHtml(displayProduct.title)}</strong>
      <a href="#buy">${I18n.t("buy")}</a>
    </nav>

    <section class="apple-immersive-hero">
      <div class="apple-hero-copy">
        <p class="eyebrow">${escapeHtml(displayProduct.badge)}</p>
        <h1>${escapeHtml(displayProduct.title)}</h1>
        <p>${escapeHtml(displayProduct.subtitle)}</p>
        <strong>${ProductStore.formatPrice(displayProduct.price)}</strong>
      </div>
      <div class="apple-hero-visual">
        ${blendedImage(displayProduct.image, displayProduct.title, "hero-blend", displayProduct.mediaBlend, "eager")}
      </div>
    </section>

    <section class="apple-overview-strip">
      <article>
        <span>${escapeHtml(displayProduct.category)}</span>
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

    <section class="apple-intro-lockup">
      <p class="eyebrow">${I18n.t("story")}</p>
      <h2>${escapeHtml(displayProduct.detail)}</h2>
    </section>

    <section class="apple-story-section">
      ${renderStorySections(displayProduct)}
    </section>

    <section class="apple-spec-showcase">
      ${specs
        .map(
          (spec) => `
            <article>
              <span>${escapeHtml(spec.label)}</span>
              <strong>${escapeHtml(spec.value)}</strong>
              <p>${escapeHtml(spec.body)}</p>
            </article>
          `,
        )
        .join("")}
    </section>

    <section class="apple-gallery-stage">
      <div>
        <p class="eyebrow">${I18n.t("gallery")}</p>
        <h2>${I18n.t("gallery")}</h2>
      </div>
      <div class="detail-main-image" data-main-image-wrap>
        ${blendedImage(displayProduct.image, displayProduct.title, "", displayProduct.mediaBlend, "eager")}
      </div>
      <div class="detail-thumbs">
        ${gallery
          .map(
            (image) => `
              <button type="button" data-thumb="${escapeHtml(image)}" aria-label="${I18n.t("gallery")}">
                <img src="${escapeHtml(image)}" alt="${escapeHtml(displayProduct.title)}" loading="lazy" decoding="async" />
              </button>
            `,
          )
          .join("")}
      </div>
    </section>

    <section class="apple-video-section">
      ${renderMotionAsset(displayProduct)}
    </section>

    <section class="apple-sample-assets">
      <div>
        <p class="eyebrow">Sample Assets</p>
        <h2>케이스와 화면 샘플</h2>
      </div>
      <div class="sample-media-row">
        ${gallery
          .slice(0, 4)
          .map((image) => blendedImage(image, `${displayProduct.title} sample`, "sample-blend", displayProduct.mediaBlend))
          .join("")}
      </div>
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
        <strong class="detail-price">${ProductStore.formatPrice(displayProduct.price)}</strong>
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

    <div class="mobile-buy-bar">
      <span>${ProductStore.formatPrice(displayProduct.price)}</span>
      <button class="primary-btn" type="button" data-mobile-buy>${I18n.t("buyNow")}</button>
    </div>
  `;
  requestAnimationFrame(setupScrollMotion);
}

function renderMotionAsset(product) {
  const source = product.video || SAMPLE_MOTION;
  if (String(source).toLowerCase().endsWith(".svg")) {
    return `<img class="detail-video motion-preview" src="${escapeHtml(source)}" alt="${escapeHtml(product.title)} motion preview" loading="lazy" decoding="async" />`;
  }
  return `<video class="detail-video" src="${escapeHtml(source)}" controls playsinline preload="metadata"></video>`;
}

function setupScrollMotion() {
  const animatedItems = detail.querySelectorAll(".apple-hero-copy, .apple-hero-visual, .apple-intro-lockup, .apple-story-row, .apple-spec-showcase article, .apple-gallery-stage, .apple-video-section, .apple-buy-section");
  animatedItems.forEach((item) => item.classList.add("scroll-reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.22, rootMargin: "0px 0px -8% 0px" },
  );

  animatedItems.forEach((item) => observer.observe(item));

  const hero = detail.querySelector(".apple-immersive-hero");
  const heroImage = detail.querySelector(".apple-hero-visual .blend-media");
  const heroCopy = detail.querySelector(".apple-hero-copy");

  function updateHeroMotion() {
    if (!hero || !heroImage || !heroCopy) return;
    const rect = hero.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height * 0.72, 1)));
    heroImage.style.transform = `translateY(${progress * 26}px) scale(${1 + progress * 0.055})`;
    heroCopy.style.transform = `translateY(${progress * -20}px)`;
    heroCopy.style.opacity = String(1 - progress * 0.36);
  }

  updateHeroMotion();
  window.addEventListener("scroll", updateHeroMotion, { passive: true });
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
                <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async" />
                <div>
                  <h3>${escapeHtml(item.title)}</h3>
                  <span>${escapeHtml(item.option)} · ${item.quantity}개 · ${ProductStore.formatPrice(item.price * item.quantity)}</span>
                </div>
                <button class="remove-btn" type="button" data-remove="${escapeHtml(item.lineId)}">삭제</button>
              </div>
            `,
          )
          .join("");
  cartTotal.textContent = ProductStore.formatPrice(ProductStore.cartTotal(cart));
}

function selectedPurchase() {
  const form = document.querySelector("[data-detail-form]");
  if (!form) return { option: defaultOption(), quantity: 1 };
  const data = new FormData(form);
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

function addSelectedProduct() {
  const purchase = selectedPurchase();
  ProductStore.addToCart(product, purchase.quantity, purchase.option);
  renderCart();
}

detail.addEventListener("click", (event) => {
  const thumb = event.target.closest("[data-thumb]");
  if (thumb) {
    const wrap = document.querySelector("[data-main-image-wrap]");
    const label = product ? I18n.localizedProduct(product).title : "sample";
    if (wrap) wrap.innerHTML = blendedImage(thumb.dataset.thumb, label, "", product ? product.mediaBlend : {});
    return;
  }

  if (event.target.closest("[data-add-cart]")) {
    addSelectedProduct();
    cartDrawer.classList.add("open");
    showToast(addedMessage());
    return;
  }

  if (event.target.closest("[data-buy-now], [data-mobile-buy]")) {
    addSelectedProduct();
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
