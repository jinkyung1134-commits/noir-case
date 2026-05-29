let products = ProductStore.activeProducts(ProductStore.loadProducts());
let heroSettings = ProductStore.loadHeroSettings();
let heroProducts = [];
let heroIndex = 0;
let heroTimer = null;

const heroImage = document.querySelector("[data-hero-image]");
const heroCategory = document.querySelector("[data-hero-category]");
const heroTitle = document.querySelector("[data-hero-title]");
const heroCopy = document.querySelector("[data-hero-copy]");
const heroPrice = document.querySelector("[data-hero-price]");
const heroDetail = document.querySelector("[data-hero-detail]");
const heroDots = document.querySelector("[data-hero-dots]");
const productGrid = document.querySelector("[data-products]");
const cartDrawer = document.querySelector("[data-cart-drawer]");
const cartItems = document.querySelector("[data-cart-items]");
const cartTotal = document.querySelector("[data-cart-total]");
const cartCount = document.querySelector("[data-cart-count]");
const toast = document.querySelector("[data-toast]");
const searchInput = document.querySelector("[data-search]");
const categorySelect = document.querySelector("[data-category]");
const sortSelect = document.querySelector("[data-sort]");
const heroSection = document.querySelector("[data-hero]");

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function productTypeLabel(product) {
  if (product.productType === "bundle") return I18n.t("bundle");
  if (product.productType === "digital") return I18n.t("digital");
  return I18n.t("case");
}

function deliveryLabel(item) {
  if (item.deliveryType === "digital") return I18n.t("digitalDelivery");
  if (item.deliveryType === "both") return I18n.t("bothDelivery");
  return I18n.t("shippingDelivery");
}

function emptyMessage() {
  if (I18n.current() === "ko") return "조건에 맞는 상품이 없습니다.";
  if (I18n.current() === "zh") return "没有符合条件的商品。";
  return "No products match your filters.";
}

function blendedImage(src, alt, className = "") {
  const image = escapeHtml(src);
  const label = escapeHtml(alt);
  return `
    <span class="blend-media ${className}" style="--blend-image: url('${image}')">
      <span class="blend-media-bg" aria-hidden="true"></span>
      <img src="${image}" alt="${label}" />
    </span>
  `;
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

function renderProducts() {
  const filteredProducts = filteredAndSortedProducts();
  productGrid.innerHTML = filteredProducts.length
    ? filteredProducts
        .map((rawProduct) => {
          const product = I18n.localizedProduct(rawProduct);
          return `
            <article class="product-card">
              <a class="product-link" href="product.html?id=${encodeURIComponent(product.id)}" aria-label="${escapeHtml(product.title)} 상세 보기">
                <div class="product-media">
                  ${blendedImage(product.image, product.title)}
                  <span class="product-badge">${escapeHtml(product.badge)}</span>
                </div>
                <div class="product-info">
                  <span class="type-chip">${productTypeLabel(product)}</span>
                  <div class="product-top">
                    <h3>${escapeHtml(product.title)}</h3>
                    <span class="price">${ProductStore.formatWon(product.price)}</span>
                  </div>
                  <p>${escapeHtml(product.subtitle)}</p>
                </div>
              </a>
              <div class="product-actions">
                <a class="secondary-btn small-btn" href="product.html?id=${encodeURIComponent(product.id)}">${I18n.t("detail")}</a>
                <button class="add-btn" type="button" data-add="${escapeHtml(product.id)}">${I18n.t("cart")}</button>
              </div>
            </article>
          `;
        })
        .join("")
    : `<p class="empty-state">${emptyMessage()}</p>`;
}

function getHeroProducts() {
  const selected = heroSettings.selectedProductIds
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean);
  const fallback = products.filter((product) => !selected.some((item) => item.id === product.id));
  return [...selected, ...fallback].slice(0, Math.max(1, Number(heroSettings.maxSlides) || 1));
}

function renderHero() {
  heroProducts = getHeroProducts();
  if (!heroProducts.length) return;
  if (heroIndex >= heroProducts.length) heroIndex = 0;

  const product = I18n.localizedProduct(heroProducts[heroIndex]);
  heroImage.src = product.image;
  heroImage.alt = product.title;
  heroSection.style.setProperty("--hero-image", `url('${product.image}')`);
  heroCategory.textContent = product.category || "Phone Styling Set";
  heroTitle.textContent = product.title;
  heroCopy.textContent = product.subtitle;
  heroPrice.textContent = ProductStore.formatWon(product.price);
  heroDetail.href = `product.html?id=${encodeURIComponent(product.id)}`;
  heroDetail.textContent = I18n.t("detail");
  heroDots.innerHTML = heroProducts
    .map(
      (_, index) => `
        <button class="${index === heroIndex ? "active" : ""}" type="button" data-hero-dot="${index}" aria-label="${index + 1}번 상품 보기"></button>
      `,
    )
    .join("");
}

function moveHero(direction) {
  if (!heroProducts.length) return;
  heroIndex = (heroIndex + direction + heroProducts.length) % heroProducts.length;
  renderHero();
  restartHeroTimer();
}

function restartHeroTimer() {
  window.clearInterval(heroTimer);
  if (heroProducts.length <= 1) return;
  heroTimer = window.setInterval(() => moveHero(1), Math.max(2, Number(heroSettings.intervalSeconds) || 5) * 1000);
}

function renderCategories() {
  const selected = categorySelect.value || "all";
  const categories = Array.from(new Set(products.map((product) => product.category).filter(Boolean)));
  categorySelect.innerHTML = `<option value="all">${I18n.t("allCategories")}</option>${categories
    .map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
    .join("")}`;
  categorySelect.value = categories.includes(selected) ? selected : "all";
}

function filteredAndSortedProducts() {
  const keyword = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;
  const sort = sortSelect.value;
  const filtered = products.filter((product) => {
    const localized = I18n.localizedProduct(product);
    const matchesKeyword = [localized.title, localized.subtitle, product.category, product.productType].join(" ").toLowerCase().includes(keyword);
    const matchesCategory = category === "all" || product.category === category;
    return matchesKeyword && matchesCategory;
  });

  return filtered.sort((a, b) => {
    if (sort === "price-low") return a.price - b.price;
    if (sort === "price-high") return b.price - a.price;
    if (sort === "newest") return String(b.id).localeCompare(String(a.id));
    return 0;
  });
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
                  <span>${escapeHtml(item.option)} · ${item.quantity}개 · ${deliveryLabel(item)} · ${ProductStore.formatWon(item.price * item.quantity)}</span>
                </div>
                <button class="remove-btn" type="button" data-remove="${escapeHtml(item.lineId)}">삭제</button>
              </div>
            `,
          )
          .join("");

  cartTotal.textContent = ProductStore.formatWon(ProductStore.cartTotal(cart));
}

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  event.preventDefault();
  const product = products.find((item) => item.id === button.dataset.add);
  ProductStore.addToCart(product, 1, defaultOption());
  renderCart();
  cartDrawer.classList.add("open");
  showToast(addedMessage());
});

document.querySelector("[data-hero-add]").addEventListener("click", () => {
  if (!heroProducts.length) return;
  ProductStore.addToCart(heroProducts[heroIndex], 1, defaultOption());
  renderCart();
  cartDrawer.classList.add("open");
  showToast(addedMessage());
});

document.querySelector("[data-hero-prev]").addEventListener("click", () => moveHero(-1));
document.querySelector("[data-hero-next]").addEventListener("click", () => moveHero(1));
heroDots.addEventListener("click", (event) => {
  const button = event.target.closest("[data-hero-dot]");
  if (!button) return;
  heroIndex = Number(button.dataset.heroDot);
  renderHero();
  restartHeroTimer();
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;
  ProductStore.removeCartLine(button.dataset.remove);
  renderCart();
});

document.querySelector("[data-open-cart]").addEventListener("click", () => cartDrawer.classList.add("open"));
document.querySelector("[data-close-cart]").addEventListener("click", () => cartDrawer.classList.remove("open"));
document.querySelector("[data-checkout]").addEventListener("click", () => {
  if (!ProductStore.loadCart().length) {
    showToast(I18n.t("cartEmpty"));
    return;
  }
  window.location.href = "checkout.html";
});

window.addEventListener("storage", (event) => {
  if (event.key === ProductStore.STORAGE_KEY) {
    products = ProductStore.activeProducts(ProductStore.loadProducts());
    renderCategories();
    renderHero();
    restartHeroTimer();
    renderProducts();
  }
  if (event.key === ProductStore.HERO_SETTINGS_KEY) {
    heroSettings = ProductStore.loadHeroSettings();
    heroIndex = 0;
    renderHero();
    restartHeroTimer();
  }
  if (event.key === ProductStore.CART_KEY) renderCart();
});

searchInput.addEventListener("input", renderProducts);
categorySelect.addEventListener("change", renderProducts);
sortSelect.addEventListener("change", renderProducts);
window.addEventListener("languagechange", () => {
  I18n.applyStatic();
  renderCategories();
  renderHero();
  renderProducts();
  renderCart();
});

renderCategories();
renderHero();
restartHeroTimer();
renderProducts();
renderCart();

ProductStore.syncFromRemote().then((synced) => {
  if (!synced) return;
  products = ProductStore.activeProducts(ProductStore.loadProducts());
  heroSettings = ProductStore.loadHeroSettings();
  renderCategories();
  renderHero();
  restartHeroTimer();
  renderProducts();
  renderCart();
});
