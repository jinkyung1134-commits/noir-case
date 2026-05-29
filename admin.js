const ORDER_STATUSES = ["주문 접수", "결제 완료", "배송 준비", "배송중", "배송 완료", "취소"];

let products = ProductStore.loadProducts();
let heroSettings = ProductStore.loadHeroSettings();
let selectedHeroIndex = 0;
let selectedProductId = products[0] ? products[0].id : "";

const heroForm = document.querySelector("[data-hero-form]");
const heroSlideList = document.querySelector("[data-hero-slide-list]");
const heroEditor = document.querySelector("[data-hero-editor]");
const productForm = document.querySelector("[data-admin-editor]");
const productList = document.querySelector("[data-product-list]");
const productEditor = document.querySelector("[data-product-editor]");
const orderList = document.querySelector("[data-order-list]");
const toast = document.querySelector("[data-toast]");

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function lines(value) {
  return String(value || "")
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function uploadFiles(files, folder) {
  return Promise.all(
    Array.from(files || [])
      .filter((file) => file && file.size > 0)
      .map((file) => ProductStore.uploadAsset(file, folder)),
  );
}

function clamp(value, fallback, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function normalizeBlend(settings = {}) {
  return {
    enabled: settings.enabled !== false,
    focusX: clamp(settings.focusX, 56, -25, 125),
    focusY: clamp(settings.focusY, 52, -25, 125),
    width: clamp(settings.width, 76, 20, 180),
    height: clamp(settings.height, 70, 20, 180),
    fade: clamp(settings.fade, 18, 0, 55),
    blur: clamp(settings.blur, 48, 0, 140),
    glow: clamp(settings.glow, 22, 0, 100),
  };
}

function blendMath(settings = {}) {
  const blend = normalizeBlend(settings);
  const solid = Math.max(18, Math.min(78, 100 - blend.fade * 2.2));
  const soft = Math.max(solid + 6, Math.min(90, 100 - blend.fade * 1.15));
  const edge = Math.max(soft + 4, Math.min(98, 100 - blend.fade * 0.35));
  const bgSoft = Math.max(24, Math.min(80, 100 - blend.fade * 1.5));
  return { ...blend, solid, soft, edge, bgSoft };
}

function blendStyle(settings = {}, image = "") {
  const blend = blendMath(settings);
  return [
    `--blend-image: url('${escapeHtml(image)}')`,
    `--blend-focus-x: ${blend.focusX}%`,
    `--blend-focus-y: ${blend.focusY}%`,
    `--blend-width: ${blend.width}%`,
    `--blend-height: ${blend.height}%`,
    `--blend-blur: ${blend.blur}px`,
    `--blend-glow: ${blend.glow / 100}`,
    `--blend-overlay: ${blend.enabled ? 1 : 0}`,
    `--blend-solid: ${blend.solid}%`,
    `--blend-soft: ${blend.soft}%`,
    `--blend-edge: ${blend.edge}%`,
    `--blend-bg-soft: ${blend.bgSoft}%`,
  ].join("; ");
}

function heroStyle(settings = {}) {
  return [
    `--hero-tone: ${clamp(settings.tone, 34, 0, 100) / 100}`,
    `--hero-image-brightness: ${clamp(settings.imageBrightness, 78, 35, 150) / 100}`,
    `--hero-bg-opacity: ${clamp(settings.backgroundGlow, 22, 0, 100) / 100}`,
    `--hero-overlay: ${clamp(settings.overlayStrength, 58, 0, 100) / 100}`,
    `--hero-content-y: ${clamp(settings.textTop, 50, 25, 85)}%`,
    `--hero-art-scale: ${clamp(settings.imageScale, 100, 50, 160) / 100}`,
  ].join("; ");
}

function previewMedia(image, title, settings = {}, className = "") {
  return `
    <span class="blend-media ${className}" style="${blendStyle(settings, image)}">
      <span class="blend-media-bg" aria-hidden="true"></span>
      <img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" />
    </span>
  `;
}

function formatStorySections(sections) {
  return (sections || [])
    .map((section) => [section.eyebrow, section.title, section.body, section.image].filter((value) => value !== undefined).join(" | "))
    .join("\n");
}

function parseStorySections(value) {
  return String(value || "")
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [eyebrow = "", title = "", body = "", image = ""] = line.split("|").map((part) => part.trim());
      return { eyebrow, title, body, image };
    })
    .filter((section) => section.title || section.body);
}

function formatSpecs(specs) {
  return (specs || [])
    .map((spec) => [spec.label, spec.value, spec.body].filter((value) => value !== undefined).join(" | "))
    .join("\n");
}

function parseSpecs(value) {
  return String(value || "")
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label = "", value = "", body = ""] = line.split("|").map((part) => part.trim());
      return { label, value, body };
    })
    .filter((spec) => spec.label || spec.value);
}

function localizedField(product, lang, key, fallback = "") {
  return product.i18n && product.i18n[lang] && product.i18n[lang][key] ? product.i18n[lang][key] : fallback;
}

function localizedList(product, lang, key) {
  const value = product.i18n && product.i18n[lang] && product.i18n[lang][key];
  return Array.isArray(value) ? value.join("\n") : "";
}

function compactLanguageFields(fields) {
  return Object.fromEntries(Object.entries(fields).filter(([, value]) => (Array.isArray(value) ? value.length > 0 : Boolean(value))));
}

function productTranslations(data, currentTranslations = {}) {
  const translations = {};
  ["en", "zh"].forEach((lang) => {
    const fields = compactLanguageFields({
      title: data.get(`i18n-${lang}-title`).trim(),
      badge: data.get(`i18n-${lang}-badge`).trim(),
      subtitle: data.get(`i18n-${lang}-subtitle`).trim(),
      detail: data.get(`i18n-${lang}-detail`).trim(),
      includedItems: lines(data.get(`i18n-${lang}-includedItems`)),
      optionText: data.get(`i18n-${lang}-optionText`).trim(),
      storySections: parseStorySections(data.get(`i18n-${lang}-storySections`)),
      specs: parseSpecs(data.get(`i18n-${lang}-specs`)),
    });
    if (Object.keys(fields).length) translations[lang] = fields;
  });

  Object.entries(currentTranslations || {}).forEach(([lang, value]) => {
    if (!["en", "zh"].includes(lang) && value) translations[lang] = value;
  });
  return translations;
}

function renderBlendControls(settings = {}, prefix = "blend") {
  const blend = normalizeBlend(settings);
  return `
    <div class="admin-fieldset blend-admin-panel">
      <div>
        <strong>블러처리 기능</strong>
        <p>이미지와 배경이 자연스럽게 연결되는 영역을 직접 조절합니다.</p>
      </div>
      <label class="toggle-row">
        <input name="${prefix}Enabled" type="checkbox" ${blend.enabled ? "checked" : ""} />
        <span>블러/페이드 사용</span>
      </label>
      <div class="blend-control-grid">
        <label>중심 X
          <input name="${prefix}FocusX" type="range" min="-25" max="125" value="${blend.focusX}" />
        </label>
        <label>중심 Y
          <input name="${prefix}FocusY" type="range" min="-25" max="125" value="${blend.focusY}" />
        </label>
        <label>가로 영역
          <input name="${prefix}Width" type="range" min="20" max="180" value="${blend.width}" />
        </label>
        <label>세로 영역
          <input name="${prefix}Height" type="range" min="20" max="180" value="${blend.height}" />
        </label>
        <label>가장자리 녹임
          <input name="${prefix}Fade" type="range" min="0" max="55" value="${blend.fade}" />
        </label>
        <label>배경 확산
          <input name="${prefix}Blur" type="range" min="0" max="140" value="${blend.blur}" />
        </label>
        <label>빛 번짐
          <input name="${prefix}Glow" type="range" min="0" max="100" value="${blend.glow}" />
        </label>
      </div>
    </div>
  `;
}

function readBlend(data, prefix = "blend") {
  return normalizeBlend({
    enabled: data.get(`${prefix}Enabled`) === "on",
    focusX: data.get(`${prefix}FocusX`),
    focusY: data.get(`${prefix}FocusY`),
    width: data.get(`${prefix}Width`),
    height: data.get(`${prefix}Height`),
    fade: data.get(`${prefix}Fade`),
    blur: data.get(`${prefix}Blur`),
    glow: data.get(`${prefix}Glow`),
  });
}

function currentHeroSlides() {
  const slides = Array.isArray(heroSettings.slides) ? heroSettings.slides : [];
  if (slides.length) return slides;
  return (heroSettings.selectedProductIds || []).map((productId) => ({ productId }));
}

function selectedHeroSlide() {
  const slides = currentHeroSlides();
  if (!slides[selectedHeroIndex]) selectedHeroIndex = 0;
  return slides[selectedHeroIndex] || { productId: products[0] ? products[0].id : "" };
}

function slideProduct(slide) {
  return products.find((product) => product.id === slide.productId) || products[0];
}

function renderHeroList() {
  const slides = currentHeroSlides();
  heroSlideList.innerHTML = slides
    .map((slide, index) => {
      const product = slideProduct(slide);
      return `
        <button class="${index === selectedHeroIndex ? "active" : ""}" type="button" data-select-hero-slide="${index}">
          <img src="${escapeHtml(product ? product.image : "")}" alt="" />
          <span>
            <strong>슬라이드 ${index + 1}</strong>
            <small>${escapeHtml(product ? product.title : "상품 없음")}</small>
          </span>
        </button>
      `;
    })
    .join("");
}

function renderHeroEditor() {
  const slide = selectedHeroSlide();
  const product = slideProduct(slide);
  if (!product) {
    heroEditor.innerHTML = `<p class="checkout-note">먼저 상품을 추가하세요.</p>`;
    return;
  }
  const blend = normalizeBlend(slide.mediaBlend || product.mediaBlend);
  const settings = {
    tone: slide.tone ?? 34,
    imageBrightness: slide.imageBrightness ?? 78,
    backgroundGlow: slide.backgroundGlow ?? 22,
    overlayStrength: slide.overlayStrength ?? 58,
    textTop: slide.textTop ?? 50,
    imageScale: slide.imageScale ?? 100,
  };

  heroEditor.innerHTML = `
    <div class="admin-preview-block">
      <strong>저장 전 예시 화면</strong>
      <div class="admin-hero-preview" data-hero-preview style="--hero-image: url('${escapeHtml(product.image)}'); ${heroStyle(settings)} ${blendStyle(blend, product.image)}">
        <div class="hero-preview-art blend-media" style="${blendStyle(blend, product.image)}">
          <span class="blend-media-bg" aria-hidden="true"></span>
          <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.title)}" />
        </div>
        <div class="hero-preview-shade"></div>
        <div class="hero-preview-copy">
          <p class="eyebrow">${escapeHtml(product.category || "Style Sets")}</p>
          <h3>${escapeHtml(product.title)}</h3>
          <p>${escapeHtml(product.subtitle)}</p>
          <strong>${ProductStore.formatPrice(product.price)}</strong>
        </div>
      </div>
    </div>

    <div class="admin-field-grid">
      <label>슬라이드 상품
        <select name="heroProductId">
          ${products.map((item) => `<option value="${escapeHtml(item.id)}" ${item.id === product.id ? "selected" : ""}>${escapeHtml(item.title)}</option>`).join("")}
        </select>
      </label>
      <label>자동 전환 시간(초)
        <input name="intervalSeconds" type="number" min="2" value="${heroSettings.intervalSeconds || 5}" />
      </label>
      <label>메인 화면 밝기
        <input name="tone" type="range" min="0" max="100" value="${settings.tone}" />
      </label>
      <label>상품 이미지 밝기
        <input name="imageBrightness" type="range" min="35" max="150" value="${settings.imageBrightness}" />
      </label>
      <label>배경 확산 강도
        <input name="backgroundGlow" type="range" min="0" max="100" value="${settings.backgroundGlow}" />
      </label>
      <label>검은 오버레이
        <input name="overlayStrength" type="range" min="0" max="100" value="${settings.overlayStrength}" />
      </label>
      <label>글 위치
        <input name="textTop" type="range" min="25" max="85" value="${settings.textTop}" />
      </label>
      <label>상품 이미지 크기
        <input name="imageScale" type="range" min="50" max="160" value="${settings.imageScale}" />
      </label>
    </div>

    ${renderBlendControls(blend, "heroBlend")}

    <div class="editor-actions bottom-actions">
      <button class="danger-btn compact" type="button" data-remove-hero-slide>선택 슬라이드 삭제</button>
      <button class="primary-btn compact" type="submit">메인 슬라이드 저장</button>
    </div>
  `;
}

function renderHeroAdmin() {
  renderHeroList();
  renderHeroEditor();
}

function readHeroSlideForm() {
  const data = new FormData(heroForm);
  return {
    productId: data.get("heroProductId"),
    tone: Number(data.get("tone")),
    imageBrightness: Number(data.get("imageBrightness")),
    backgroundGlow: Number(data.get("backgroundGlow")),
    overlayStrength: Number(data.get("overlayStrength")),
    textTop: Number(data.get("textTop")),
    imageScale: Number(data.get("imageScale")),
    mediaBlend: readBlend(data, "heroBlend"),
  };
}

function updateHeroPreview() {
  const preview = heroEditor.querySelector("[data-hero-preview]");
  const productId = heroEditor.querySelector('[name="heroProductId"]')?.value;
  const product = products.find((item) => item.id === productId);
  if (!preview || !product) return;
  const slide = readHeroSlideForm();
  preview.style.cssText = `--hero-image: url('${escapeHtml(product.image)}'); ${heroStyle(slide)} ${blendStyle(slide.mediaBlend, product.image)}`;
  preview.querySelector(".hero-preview-art").style.cssText = blendStyle(slide.mediaBlend, product.image);
  preview.querySelector(".hero-preview-art img").src = product.image;
  preview.querySelector(".hero-preview-art img").alt = product.title;
  preview.querySelector(".hero-preview-copy .eyebrow").textContent = product.category || "Style Sets";
  preview.querySelector(".hero-preview-copy h3").textContent = product.title;
  preview.querySelector(".hero-preview-copy p:not(.eyebrow)").textContent = product.subtitle;
  preview.querySelector(".hero-preview-copy strong").textContent = ProductStore.formatPrice(product.price);
}

function renderProductList() {
  if (!products.some((product) => product.id === selectedProductId)) selectedProductId = products[0] ? products[0].id : "";
  productList.innerHTML = products
    .map(
      (product) => `
        <button class="${product.id === selectedProductId ? "active" : ""}" type="button" data-select-product="${escapeHtml(product.id)}">
          <img src="${escapeHtml(product.image)}" alt="" />
          <span>
            <strong>${escapeHtml(product.title)}</strong>
            <small>${escapeHtml(product.category)} · ${product.status === "hidden" ? "숨김" : "노출중"}</small>
          </span>
        </button>
      `,
    )
    .join("");
}

function renderLanguageFields(product) {
  return `
    <details class="admin-edit-group">
      <summary>언어별 설명</summary>
      <div class="admin-field-grid">
        ${[
          ["en", "영어"],
          ["zh", "중국어"],
        ]
          .map(
            ([code, label]) => `
              <div class="translation-card">
                <h4>${label}</h4>
                <label>${label} 상품명
                  <input name="i18n-${code}-title" value="${escapeHtml(localizedField(product, code, "title"))}" />
                </label>
                <label>${label} 배지
                  <input name="i18n-${code}-badge" value="${escapeHtml(localizedField(product, code, "badge"))}" />
                </label>
                <label>${label} 짧은 설명
                  <textarea name="i18n-${code}-subtitle">${escapeHtml(localizedField(product, code, "subtitle"))}</textarea>
                </label>
                <label>${label} 상세 설명
                  <textarea name="i18n-${code}-detail">${escapeHtml(localizedField(product, code, "detail"))}</textarea>
                </label>
                <label>${label} 포함 구성
                  <textarea name="i18n-${code}-includedItems">${escapeHtml(localizedList(product, code, "includedItems"))}</textarea>
                </label>
                <label>${label} 옵션
                  <textarea name="i18n-${code}-optionText">${escapeHtml(localizedField(product, code, "optionText"))}</textarea>
                </label>
                <label>${label} 상세 소개 섹션
                  <textarea name="i18n-${code}-storySections">${escapeHtml(formatStorySections(localizedField(product, code, "storySections", [])))}</textarea>
                </label>
                <label>${label} 강조 스펙
                  <textarea name="i18n-${code}-specs">${escapeHtml(formatSpecs(localizedField(product, code, "specs", [])))}</textarea>
                </label>
              </div>
            `,
          )
          .join("")}
      </div>
    </details>
  `;
}

function renderProductEditor() {
  const product = products.find((item) => item.id === selectedProductId);
  if (!product) {
    productEditor.innerHTML = `<p class="checkout-note">등록된 상품이 없습니다.</p>`;
    return;
  }

  productEditor.innerHTML = `
    <div class="admin-preview-block">
      <strong>설정 변경 예시 화면</strong>
      <div class="admin-product-preview" data-product-preview>
        ${previewMedia(product.image, product.title, product.mediaBlend, "admin-product-preview-media")}
        <div>
          <p class="eyebrow">${escapeHtml(product.badge)}</p>
          <h3>${escapeHtml(product.title)}</h3>
          <p>${escapeHtml(product.subtitle)}</p>
          <strong>${ProductStore.formatPrice(product.price)}</strong>
        </div>
      </div>
    </div>

    <details class="admin-edit-group" open>
      <summary>기본 정보</summary>
      <div class="admin-field-grid">
        <label>상품명
          <input name="title" value="${escapeHtml(product.title)}" />
        </label>
        <label>가격
          <input name="price" type="number" min="0" step="1000" value="${product.price}" />
        </label>
        <label>카테고리
          <select name="category">
            ${["Style Sets", "Cases", "Wallpapers", "Widgets"].map((category) => `<option value="${category}" ${product.category === category ? "selected" : ""}>${category}</option>`).join("")}
          </select>
        </label>
        <label>상품 타입
          <select name="productType">
            <option value="bundle" ${product.productType === "bundle" ? "selected" : ""}>스타일 세트</option>
            <option value="case" ${product.productType === "case" ? "selected" : ""}>케이스</option>
            <option value="digital" ${product.productType === "digital" ? "selected" : ""}>화면 디자인</option>
          </select>
        </label>
        <label>배송 유형
          <select name="deliveryType">
            <option value="both" ${product.deliveryType === "both" ? "selected" : ""}>배송 + 디지털</option>
            <option value="shipping" ${product.deliveryType === "shipping" ? "selected" : ""}>배송 상품</option>
            <option value="digital" ${product.deliveryType === "digital" ? "selected" : ""}>디지털 다운로드</option>
          </select>
        </label>
        <label>배지
          <input name="badge" value="${escapeHtml(product.badge)}" />
        </label>
        <label>짧은 설명
          <textarea name="subtitle">${escapeHtml(product.subtitle)}</textarea>
        </label>
        <label>상세 설명
          <textarea name="detail">${escapeHtml(product.detail)}</textarea>
        </label>
        <label>포함 구성
          <textarea name="includedItems">${escapeHtml(product.includedItems.join("\n"))}</textarea>
        </label>
        <label>상세 소개 섹션
          <textarea name="storySections" placeholder="eyebrow | title | body | image">${escapeHtml(formatStorySections(product.storySections))}</textarea>
        </label>
        <label>강조 스펙
          <textarea name="specs" placeholder="label | value | body">${escapeHtml(formatSpecs(product.specs))}</textarea>
        </label>
      </div>
    </details>

    <details class="admin-edit-group" open>
      <summary>사진/영상 업로드</summary>
      <div class="admin-field-grid">
        <label>대표 이미지 주소
          <input name="image" value="${escapeHtml(product.image)}" />
        </label>
        <label>대표 사진 업로드
          <input name="imageFile" type="file" accept="image/*" />
        </label>
        <label>갤러리 이미지 주소
          <textarea name="gallery">${escapeHtml(product.gallery.join("\n"))}</textarea>
        </label>
        <label>갤러리 사진 업로드
          <input name="galleryFiles" type="file" accept="image/*" multiple />
        </label>
        <label>상품 동영상 주소
          <input name="video" value="${escapeHtml(product.video)}" />
        </label>
        <label>상품 동영상 업로드
          <input name="videoFile" type="file" accept="video/*" />
        </label>
        <label>디지털 파일 URL
          <textarea name="digitalFiles">${escapeHtml(product.digitalFiles.join("\n"))}</textarea>
        </label>
        <label>디지털 파일 업로드
          <input name="digitalFileUploads" type="file" multiple />
        </label>
      </div>
      ${renderBlendControls(product.mediaBlend, "productBlend")}
    </details>

    <details class="admin-edit-group">
      <summary>옵션/노출</summary>
      <div class="admin-field-grid">
        <label>옵션
          <textarea name="optionText">${escapeHtml(product.optionText)}</textarea>
        </label>
        <label>재고
          <input name="stock" type="number" min="0" value="${product.stock}" />
        </label>
        <label>노출 상태
          <select name="status">
            <option value="active" ${product.status !== "hidden" ? "selected" : ""}>노출중</option>
            <option value="hidden" ${product.status === "hidden" ? "selected" : ""}>숨김</option>
          </select>
        </label>
      </div>
    </details>

    ${renderLanguageFields(product)}

    <div class="editor-actions bottom-actions">
      <button class="danger-btn compact" type="button" data-delete-product>선택 상품 삭제</button>
      <button class="primary-btn compact" type="submit">상품 저장</button>
    </div>
  `;
}

function renderProductAdmin() {
  renderProductList();
  renderProductEditor();
}

function updateProductPreview() {
  const product = products.find((item) => item.id === selectedProductId);
  const preview = productEditor.querySelector("[data-product-preview]");
  if (!product || !preview) return;
  const data = new FormData(productForm);
  const image = data.get("image") || product.image;
  const blend = readBlend(data, "productBlend");
  preview.querySelector(".blend-media").style.cssText = blendStyle(blend, image);
  preview.querySelector(".blend-media img").src = image;
  preview.querySelector(".eyebrow").textContent = data.get("badge") || "";
  preview.querySelector("h3").textContent = data.get("title") || "";
  preview.querySelector("p:not(.eyebrow)").textContent = data.get("subtitle") || "";
  preview.querySelector("strong").textContent = ProductStore.formatPrice(Number(data.get("price")) || 0);
}

function renderOrders() {
  const orders = ProductStore.loadOrders();
  orderList.innerHTML =
    orders.length === 0
      ? `<p class="checkout-note">아직 주문 기록이 없습니다.</p>`
      : orders
          .map(
            (order) => `
              <article class="order-card">
                <div>
                  <strong>${escapeHtml(order.id)}</strong>
                  <span>${new Date(order.createdAt).toLocaleString("ko-KR")}</span>
                </div>
                <label class="order-status">주문 상태
                  <select data-order-status="${escapeHtml(order.id)}">
                    ${ORDER_STATUSES.map((status) => `<option value="${status}" ${order.status === status ? "selected" : ""}>${status}</option>`).join("")}
                  </select>
                </label>
                <p>${order.items.map((item) => `${escapeHtml(item.title)} ${item.quantity || 1}개`).join(", ")}</p>
                ${order.customer ? `<p>${escapeHtml(order.customer.name)} · ${escapeHtml(order.customer.phone)} · ${escapeHtml(order.customer.address || "디지털 상품")}</p>` : ""}
                <strong>${ProductStore.formatPrice(order.total)}</strong>
              </article>
            `,
          )
          .join("");
}

function saveHeroSettingsFromForm() {
  const slides = currentHeroSlides();
  slides[selectedHeroIndex] = readHeroSlideForm();
  heroSettings = ProductStore.saveHeroSettings({
    ...heroSettings,
    intervalSeconds: Number(new FormData(heroForm).get("intervalSeconds")) || heroSettings.intervalSeconds,
    maxSlides: slides.length,
    selectedProductIds: slides.map((slide) => slide.productId),
    slides,
  });
  renderHeroAdmin();
  showToast("메인 슬라이드를 저장했습니다.");
}

async function saveSelectedProduct() {
  const productIndex = products.findIndex((product) => product.id === selectedProductId);
  if (productIndex < 0) return;
  const product = products[productIndex];
  const data = new FormData(productForm);
  const imageUpload = data.get("imageFile");
  const uploadedImage = imageUpload && imageUpload.size > 0 ? await ProductStore.uploadAsset(imageUpload, "products") : "";
  const galleryUploads = await uploadFiles(data.getAll("galleryFiles"), "products");
  const videoUpload = data.get("videoFile");
  const uploadedVideo = videoUpload && videoUpload.size > 0 ? await ProductStore.uploadAsset(videoUpload, "videos") : "";
  const digitalUploads = await uploadFiles(data.getAll("digitalFileUploads"), "digital");
  const image = uploadedImage || data.get("image").trim();

  products[productIndex] = {
    ...product,
    title: data.get("title").trim(),
    subtitle: data.get("subtitle").trim(),
    detail: data.get("detail").trim(),
    price: Number(data.get("price")) || 0,
    productType: data.get("productType"),
    deliveryType: data.get("deliveryType"),
    badge: data.get("badge").trim(),
    category: data.get("category"),
    image,
    gallery: [image, ...lines(data.get("gallery")), ...galleryUploads].filter(Boolean),
    video: uploadedVideo || data.get("video").trim(),
    digitalFiles: [...lines(data.get("digitalFiles")), ...digitalUploads].filter(Boolean),
    includedItems: lines(data.get("includedItems")),
    storySections: parseStorySections(data.get("storySections")),
    specs: parseSpecs(data.get("specs")),
    optionText: data.get("optionText").trim(),
    stock: Number(data.get("stock")) || 0,
    status: data.get("status"),
    mediaBlend: readBlend(data, "productBlend"),
    i18n: productTranslations(data, product.i18n),
  };

  ProductStore.saveProducts(products);
  renderHeroAdmin();
  renderProductAdmin();
  showToast("상품을 저장했습니다.");
}

document.querySelector("[data-add-hero-slide]").addEventListener("click", () => {
  const product = products[0];
  if (!product) return;
  const slides = currentHeroSlides();
  slides.push({ productId: product.id, mediaBlend: normalizeBlend(product.mediaBlend), tone: 34, imageBrightness: 78, backgroundGlow: 22, overlayStrength: 58, textTop: 50, imageScale: 100 });
  selectedHeroIndex = slides.length - 1;
  heroSettings = ProductStore.saveHeroSettings({ ...heroSettings, maxSlides: slides.length, selectedProductIds: slides.map((slide) => slide.productId), slides });
  renderHeroAdmin();
});

heroForm.addEventListener("click", (event) => {
  const select = event.target.closest("[data-select-hero-slide]");
  if (select) {
    selectedHeroIndex = Number(select.dataset.selectHeroSlide);
    renderHeroAdmin();
    return;
  }
  if (event.target.closest("[data-remove-hero-slide]")) {
    const slides = currentHeroSlides();
    if (slides.length <= 1) {
      showToast("메인 슬라이드는 최소 1개가 필요합니다.");
      return;
    }
    slides.splice(selectedHeroIndex, 1);
    selectedHeroIndex = Math.max(0, selectedHeroIndex - 1);
    heroSettings = ProductStore.saveHeroSettings({ ...heroSettings, maxSlides: slides.length, selectedProductIds: slides.map((slide) => slide.productId), slides });
    renderHeroAdmin();
  }
});

heroForm.addEventListener("input", updateHeroPreview);
heroForm.addEventListener("change", updateHeroPreview);
heroForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveHeroSettingsFromForm();
});

document.querySelector("[data-add-product]").addEventListener("click", () => {
  const product = {
    id: "custom-" + Date.now(),
    title: "새 스타일 세트",
    subtitle: "케이스와 화면 디자인을 함께 구성한 상품입니다.",
    detail: "상품 상세 설명을 입력하세요.",
    price: 79000,
    productType: "bundle",
    deliveryType: "both",
    badge: "STYLE SET",
    category: "Style Sets",
    image: "assets/sample-product-hero.png",
    gallery: ["assets/sample-product-hero.png"],
    video: "",
    digitalFiles: [],
    includedItems: ["케이스 1개", "배경화면", "설정 가이드"],
    storySections: [],
    specs: [],
    optionText: "iPhone 15, Galaxy S24",
    stock: 10,
    status: "active",
    mediaBlend: normalizeBlend(),
    i18n: {},
  };
  products.unshift(product);
  selectedProductId = product.id;
  ProductStore.saveProducts(products);
  renderProductAdmin();
  renderHeroAdmin();
});

document.querySelector("[data-reset-products]").addEventListener("click", () => {
  products = ProductStore.resetProducts();
  selectedProductId = products[0] ? products[0].id : "";
  heroSettings = ProductStore.loadHeroSettings();
  renderProductAdmin();
  renderHeroAdmin();
  showToast("기본 상품으로 초기화했습니다.");
});

productForm.addEventListener("click", (event) => {
  const select = event.target.closest("[data-select-product]");
  if (select) {
    selectedProductId = select.dataset.selectProduct;
    renderProductAdmin();
    return;
  }
  if (event.target.closest("[data-delete-product]")) {
    products = products.filter((product) => product.id !== selectedProductId);
    selectedProductId = products[0] ? products[0].id : "";
    ProductStore.saveProducts(products);
    renderProductAdmin();
    renderHeroAdmin();
    showToast("상품을 삭제했습니다.");
  }
});

productForm.addEventListener("input", updateProductPreview);
productForm.addEventListener("change", updateProductPreview);
productForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveSelectedProduct();
});

orderList.addEventListener("change", (event) => {
  const select = event.target.closest("[data-order-status]");
  if (!select) return;
  ProductStore.updateOrderStatus(select.dataset.orderStatus, select.value);
  renderOrders();
  showToast("주문 상태가 변경되었습니다.");
});

renderHeroAdmin();
renderProductAdmin();
renderOrders();

ProductStore.syncFromRemote().then((synced) => {
  if (!synced) return;
  products = ProductStore.loadProducts();
  heroSettings = ProductStore.loadHeroSettings();
  if (!products.some((product) => product.id === selectedProductId)) selectedProductId = products[0] ? products[0].id : "";
  renderHeroAdmin();
  renderProductAdmin();
  renderOrders();
});
