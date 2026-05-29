const ADMIN_PASSWORD = "BLACKCASE2026";
const SESSION_KEY = "noir-case-admin-session";
const ORDER_STATUSES = ["주문 접수", "결제 완료", "배송 준비", "배송중", "배송 완료", "취소"];

let products = ProductStore.loadProducts();
let heroSettings = ProductStore.loadHeroSettings();

const loginCard = document.querySelector("[data-login-card]");
const workspace = document.querySelector("[data-admin-workspace]");
const heroWorkspace = document.querySelector("[data-hero-workspace]");
const orderWorkspace = document.querySelector("[data-order-workspace]");
const loginForm = document.querySelector("[data-admin-login]");
const heroForm = document.querySelector("[data-hero-form]");
const editorForm = document.querySelector("[data-admin-editor]");
const orderList = document.querySelector("[data-order-list]");
const assetLibrary = document.querySelector("[data-asset-library]");
const logoutButton = document.querySelector("[data-logout]");
const toast = document.querySelector("[data-toast]");

const SAMPLE_ASSETS = [
  { label: "대표 케이스 사진", path: "assets/sample-product-hero.png", type: "image" },
  { label: "상세 연출 사진", path: "assets/sample-detail-scene.png", type: "image" },
  { label: "배경화면 샘플 PNG", path: "assets/sample-wallpaper-black-gold.png", type: "image" },
  { label: "배경화면 샘플 SVG", path: "assets/sample-wallpaper-midnight.svg", type: "image" },
  { label: "상품 모션 샘플", path: "assets/sample-product-motion.svg", type: "motion" },
];

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

async function uploadFiles(files, folder) {
  return Promise.all(
    Array.from(files || [])
      .filter((file) => file && file.size > 0)
      .map((file) => ProductStore.uploadAsset(file, folder)),
  );
}

function lines(value) {
  return String(value || "")
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function localizedField(product, lang, key, fallback = "") {
  return product.i18n && product.i18n[lang] && product.i18n[lang][key] ? product.i18n[lang][key] : fallback;
}

function localizedList(product, lang, key) {
  const value = product.i18n && product.i18n[lang] && product.i18n[lang][key];
  return Array.isArray(value) ? value.join("\n") : "";
}

function formatStorySections(sections) {
  return (sections || [])
    .map((section) => [section.eyebrow, section.title, section.body, section.image].filter((value) => value !== undefined).join(" | "))
    .join("\n");
}

function formatSpecs(specs) {
  return (specs || [])
    .map((spec) => [spec.label, spec.value, spec.body].filter((value) => value !== undefined).join(" | "))
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

function renderLanguageFields(product, index) {
  const languages = [
    { code: "en", label: "영어", placeholder: "English text" },
    { code: "zh", label: "중국어", placeholder: "中文内容" },
  ];

  return `
    <section class="translation-panel">
      <div>
        <strong>언어별 표시 설정</strong>
        <p>비워두면 한국어 기본 정보가 그대로 표시됩니다.</p>
      </div>
      ${languages
        .map(
          (language) => `
            <div class="translation-card">
              <h4>${language.label}</h4>
              <label>${language.label} 상품명
                <input name="i18n-${language.code}-title-${index}" value="${escapeHtml(localizedField(product, language.code, "title"))}" placeholder="${language.placeholder}" />
              </label>
              <label>${language.label} 배지
                <input name="i18n-${language.code}-badge-${index}" value="${escapeHtml(localizedField(product, language.code, "badge"))}" placeholder="STYLE SET" />
              </label>
              <label>${language.label} 짧은 설명
                <textarea name="i18n-${language.code}-subtitle-${index}" placeholder="${language.placeholder}">${escapeHtml(localizedField(product, language.code, "subtitle"))}</textarea>
              </label>
              <label>${language.label} 상세 설명
                <textarea name="i18n-${language.code}-detail-${index}" placeholder="${language.placeholder}">${escapeHtml(localizedField(product, language.code, "detail"))}</textarea>
              </label>
              <label>${language.label} 포함 구성
                <textarea name="i18n-${language.code}-includedItems-${index}" placeholder="한 줄에 하나씩 입력">${escapeHtml(localizedList(product, language.code, "includedItems"))}</textarea>
              </label>
              <label>${language.label} 옵션
                <textarea name="i18n-${language.code}-optionText-${index}" placeholder="iPhone 15, Galaxy S24">${escapeHtml(localizedField(product, language.code, "optionText"))}</textarea>
              </label>
              <label>${language.label} 상세 소개 섹션
                <textarea name="i18n-${language.code}-storySections-${index}" placeholder="eyebrow | title | body | image">${escapeHtml(formatStorySections(localizedField(product, language.code, "storySections", [])))}</textarea>
              </label>
              <label>${language.label} 강조 스펙
                <textarea name="i18n-${language.code}-specs-${index}" placeholder="label | value | body">${escapeHtml(formatSpecs(localizedField(product, language.code, "specs", [])))}</textarea>
              </label>
            </div>
          `,
        )
        .join("")}
    </section>
  `;
}

function blendValue(product, key, fallback) {
  return product.mediaBlend && product.mediaBlend[key] !== undefined ? product.mediaBlend[key] : fallback;
}

function adminBlendStyle(product) {
  const fade = Number(blendValue(product, "fade", 18));
  const solid = Math.max(18, Math.min(78, 100 - fade * 2.2));
  const soft = Math.max(solid + 6, Math.min(90, 100 - fade * 1.15));
  const edge = Math.max(soft + 4, Math.min(98, 100 - fade * 0.35));
  const bgSoft = Math.max(24, Math.min(80, 100 - fade * 1.5));
  return [
    `--blend-image: url('${escapeHtml(product.image)}')`,
    `--blend-focus-x: ${blendValue(product, "focusX", 56)}%`,
    `--blend-focus-y: ${blendValue(product, "focusY", 52)}%`,
    `--blend-width: ${blendValue(product, "width", 76)}%`,
    `--blend-height: ${blendValue(product, "height", 70)}%`,
    `--blend-blur: ${blendValue(product, "blur", 48)}px`,
    `--blend-glow: ${Number(blendValue(product, "glow", 22)) / 100}`,
    `--blend-overlay: ${blendValue(product, "enabled", true) ? 1 : 0}`,
    `--blend-solid: ${solid}%`,
    `--blend-soft: ${soft}%`,
    `--blend-edge: ${edge}%`,
    `--blend-bg-soft: ${bgSoft}%`,
  ].join("; ");
}

function renderBlendControls(product, index) {
  const enabled = blendValue(product, "enabled", true);
  return `
    <div class="blend-admin-panel">
      <div class="admin-section-note compact-note">
        <strong>이미지/영상 자연 연결 설정</strong>
        <span>사진이 배경에 녹아드는 중심과 페이드 영역을 직접 지정합니다. 메인 화면, 상품 상세, 샘플 이미지에 같이 적용됩니다.</span>
      </div>
      <label class="toggle-row">
        <input name="blendEnabled-${index}" type="checkbox" ${enabled ? "checked" : ""} />
        <span>블렌딩 사용</span>
      </label>
      <div class="blend-control-grid">
        <label>중심 위치 X
          <input name="blendFocusX-${index}" type="range" min="0" max="100" value="${blendValue(product, "focusX", 56)}" />
        </label>
        <label>중심 위치 Y
          <input name="blendFocusY-${index}" type="range" min="0" max="100" value="${blendValue(product, "focusY", 52)}" />
        </label>
        <label>가로 유지 영역
          <input name="blendWidth-${index}" type="range" min="35" max="120" value="${blendValue(product, "width", 76)}" />
        </label>
        <label>세로 유지 영역
          <input name="blendHeight-${index}" type="range" min="35" max="120" value="${blendValue(product, "height", 70)}" />
        </label>
        <label>가장자리 녹임
          <input name="blendFade-${index}" type="range" min="4" max="36" value="${blendValue(product, "fade", 18)}" />
        </label>
        <label>배경 확산
          <input name="blendBlur-${index}" type="range" min="0" max="90" value="${blendValue(product, "blur", 48)}" />
        </label>
        <label>뒤쪽 빛 번짐
          <input name="blendGlow-${index}" type="range" min="0" max="70" value="${blendValue(product, "glow", 22)}" />
        </label>
      </div>
    </div>
  `;
}

function readBlendSettings(data, index) {
  return {
    enabled: data.get(`blendEnabled-${index}`) === "on",
    focusX: Number(data.get(`blendFocusX-${index}`)),
    focusY: Number(data.get(`blendFocusY-${index}`)),
    width: Number(data.get(`blendWidth-${index}`)),
    height: Number(data.get(`blendHeight-${index}`)),
    fade: Number(data.get(`blendFade-${index}`)),
    blur: Number(data.get(`blendBlur-${index}`)),
    glow: Number(data.get(`blendGlow-${index}`)),
  };
}

function blendStyleFromSettings(settings, image) {
  const fade = Number(settings.fade ?? 18);
  const solid = Math.max(18, Math.min(78, 100 - fade * 2.2));
  const soft = Math.max(solid + 6, Math.min(90, 100 - fade * 1.15));
  const edge = Math.max(soft + 4, Math.min(98, 100 - fade * 0.35));
  const bgSoft = Math.max(24, Math.min(80, 100 - fade * 1.5));
  return [
    `--blend-image: url('${escapeHtml(image)}')`,
    `--blend-focus-x: ${Number(settings.focusX ?? 56)}%`,
    `--blend-focus-y: ${Number(settings.focusY ?? 52)}%`,
    `--blend-width: ${Number(settings.width ?? 76)}%`,
    `--blend-height: ${Number(settings.height ?? 70)}%`,
    `--blend-blur: ${Number(settings.blur ?? 48)}px`,
    `--blend-glow: ${Number(settings.glow ?? 22) / 100}`,
    `--blend-overlay: ${settings.enabled !== false ? 1 : 0}`,
    `--blend-solid: ${solid}%`,
    `--blend-soft: ${soft}%`,
    `--blend-edge: ${edge}%`,
    `--blend-bg-soft: ${bgSoft}%`,
  ].join("; ");
}

function compactLanguageFields(fields) {
  return Object.fromEntries(Object.entries(fields).filter(([, value]) => (Array.isArray(value) ? value.length > 0 : Boolean(value))));
}

function productTranslations(data, index, currentTranslations = {}) {
  const translations = {};
  ["en", "zh"].forEach((lang) => {
    const fields = compactLanguageFields({
      title: data.get(`i18n-${lang}-title-${index}`).trim(),
      badge: data.get(`i18n-${lang}-badge-${index}`).trim(),
      subtitle: data.get(`i18n-${lang}-subtitle-${index}`).trim(),
      detail: data.get(`i18n-${lang}-detail-${index}`).trim(),
      includedItems: lines(data.get(`i18n-${lang}-includedItems-${index}`)),
      optionText: data.get(`i18n-${lang}-optionText-${index}`).trim(),
      storySections: parseStorySections(data.get(`i18n-${lang}-storySections-${index}`)),
      specs: parseSpecs(data.get(`i18n-${lang}-specs-${index}`)),
    });
    if (Object.keys(fields).length) translations[lang] = fields;
  });

  Object.entries(currentTranslations || {}).forEach(([lang, value]) => {
    if (!["en", "zh"].includes(lang) && value) translations[lang] = value;
  });

  return translations;
}

function showWorkspace() {
  loginCard.hidden = true;
  heroWorkspace.hidden = false;
  workspace.hidden = false;
  orderWorkspace.hidden = false;
  logoutButton.hidden = false;
  renderHeroSettings();
  renderAssetLibrary();
  renderEditor();
  renderOrders();
}

function showLogin() {
  loginCard.hidden = false;
  heroWorkspace.hidden = true;
  workspace.hidden = true;
  orderWorkspace.hidden = true;
  logoutButton.hidden = true;
}

function renderHeroSettings() {
  const selectedIds = new Set(heroSettings.selectedProductIds);
  heroForm.innerHTML = `
    <div class="hero-setting-grid">
      <label>메인에 보일 상품 개수
        <input name="maxSlides" type="number" min="1" max="${Math.max(products.length, 1)}" value="${heroSettings.maxSlides}" />
      </label>
      <label>자동 전환 시간(초)
        <input name="intervalSeconds" type="number" min="2" step="1" value="${heroSettings.intervalSeconds}" />
      </label>
    </div>
    <div class="featured-product-list">
      ${products
        .map(
          (product) => `
            <label class="featured-product">
              <input type="checkbox" name="selectedProductIds" value="${escapeHtml(product.id)}" ${selectedIds.has(product.id) ? "checked" : ""} />
              <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.title)}" />
              <span>
                <strong>${escapeHtml(product.title)}</strong>
                <small>${product.status === "hidden" ? "숨김 상품" : escapeHtml(product.category)}</small>
              </span>
            </label>
          `,
        )
        .join("")}
    </div>
    <button class="primary-btn full" type="submit">메인 화면 설정 저장</button>
  `;
}

function renderAssetLibrary() {
  assetLibrary.innerHTML = `
    <section class="sample-asset-panel">
      <div>
        <strong>샘플 자산</strong>
        <p>아래 경로를 상품 이미지, 갤러리, 동영상, 디지털 파일 URL에 넣어 테스트할 수 있습니다.</p>
      </div>
      <div class="sample-asset-grid">
        ${SAMPLE_ASSETS.map(
          (asset) => `
            <article>
              <img src="${asset.path}" alt="${asset.label}" />
              <span>${asset.label}</span>
              <code>${asset.path}</code>
              <button class="secondary-btn small-btn" type="button" data-copy-asset="${asset.path}">경로 복사</button>
            </article>
          `,
        ).join("")}
      </div>
    </section>
  `;
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
                    ${ORDER_STATUSES.map(
                      (status) => `<option value="${status}" ${order.status === status ? "selected" : ""}>${status}</option>`,
                    ).join("")}
                  </select>
                </label>
                <p>${order.items.map((item) => `${escapeHtml(item.title)} ${item.quantity || 1}개`).join(", ")}</p>
                ${order.customer ? `<p>${escapeHtml(order.customer.name)} · ${escapeHtml(order.customer.phone)} · ${escapeHtml(order.customer.address || "디지털 상품")}</p>` : ""}
                <strong>${ProductStore.formatWon(order.total)}</strong>
              </article>
            `,
          )
          .join("");
}

function renderEditor() {
  editorForm.innerHTML = products
    .map(
      (product, index) => `
        <fieldset class="product-editor">
          <legend>${index + 1}번 상품</legend>
          <div class="admin-product-layout">
            <div class="admin-preview">
              <span class="blend-media admin-preview-media" style="${adminBlendStyle(product)}">
                <span class="blend-media-bg" aria-hidden="true"></span>
                <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.title)}" />
              </span>
              <span class="admin-preview-status">${product.status === "hidden" ? "숨김" : "노출중"}</span>
            </div>
            <div class="admin-fields">
              <details class="admin-edit-group" open>
                <summary>기본 정보</summary>
                <div class="admin-group-grid">
              <div class="admin-section-note">
                <strong>한국어 기본 정보</strong>
                <span>한국어 페이지와 번역이 비어 있는 언어의 기본값으로 사용됩니다.</span>
              </div>
              <label>상품명
                <input name="title-${index}" value="${escapeHtml(product.title)}" />
              </label>
              <label>가격
                <input name="price-${index}" type="number" min="0" step="1000" value="${product.price}" />
                <small>표시 가격: ${ProductStore.formatPrice(product.price)}</small>
              </label>
              <label>카테고리
                <select name="category-${index}">
                  ${["Style Sets", "Cases", "Wallpapers", "Widgets"].map(
                    (category) => `<option value="${category}" ${product.category === category ? "selected" : ""}>${category}</option>`,
                  ).join("")}
                </select>
              </label>
              <label>상품 타입
                <select name="productType-${index}">
                  <option value="bundle" ${product.productType === "bundle" ? "selected" : ""}>스타일 세트</option>
                  <option value="case" ${product.productType === "case" ? "selected" : ""}>케이스</option>
                  <option value="digital" ${product.productType === "digital" ? "selected" : ""}>화면 디자인</option>
                </select>
              </label>
              <label>배송 유형
                <select name="deliveryType-${index}">
                  <option value="both" ${product.deliveryType === "both" ? "selected" : ""}>배송 + 디지털</option>
                  <option value="shipping" ${product.deliveryType === "shipping" ? "selected" : ""}>배송 상품</option>
                  <option value="digital" ${product.deliveryType === "digital" ? "selected" : ""}>디지털 다운로드</option>
                </select>
              </label>
              <label>배지
                <input name="badge-${index}" value="${escapeHtml(product.badge)}" />
              </label>
              <label>짧은 설명
                <textarea name="subtitle-${index}">${escapeHtml(product.subtitle)}</textarea>
              </label>
              <label>상세 설명
                <textarea name="detail-${index}">${escapeHtml(product.detail)}</textarea>
              </label>
              <label>상세 소개 섹션
                <textarea name="storySections-${index}" placeholder="eyebrow | title | body | image">${escapeHtml(formatStorySections(product.storySections))}</textarea>
              </label>
              <label>강조 스펙
                <textarea name="specs-${index}" placeholder="label | value | body">${escapeHtml(formatSpecs(product.specs))}</textarea>
              </label>
              <label>포함 구성
                <textarea name="includedItems-${index}" placeholder="한 줄에 하나씩 입력">${escapeHtml(product.includedItems.join("\n"))}</textarea>
              </label>
                </div>
              </details>
              <details class="admin-edit-group" open>
                <summary>사진/영상 업로드</summary>
                <div class="admin-group-grid">
              <label>대표 이미지 주소
                <input name="image-${index}" value="${escapeHtml(product.image)}" />
              </label>
              <label>대표 사진 업로드
                <input name="file-${index}" type="file" accept="image/*" />
              </label>
              <label>갤러리 이미지 주소
                <textarea name="gallery-${index}" placeholder="한 줄에 하나씩 입력">${escapeHtml(product.gallery.join("\n"))}</textarea>
              </label>
              <label>갤러리 사진 여러 장 업로드
                <input name="galleryFiles-${index}" type="file" accept="image/*" multiple />
              </label>
              <label>상품 동영상 주소
                <input name="video-${index}" value="${escapeHtml(product.video)}" placeholder="mp4 주소 또는 업로드 사용" />
              </label>
              <label>상품 동영상 업로드
                <input name="videoFile-${index}" type="file" accept="video/*" />
              </label>
              <label>디지털 파일 URL
                <textarea name="digitalFiles-${index}" placeholder="결제 후 제공할 파일 URL">${escapeHtml(product.digitalFiles.join("\n"))}</textarea>
              </label>
              <label>디지털 파일 업로드
                <input name="digitalFileUploads-${index}" type="file" multiple />
              </label>
              ${renderBlendControls(product, index)}
                </div>
              </details>
              <details class="admin-edit-group">
                <summary>옵션/번역/노출</summary>
                <div class="admin-group-grid">
              <label>옵션
                <textarea name="optionText-${index}" placeholder="iPhone 15, Galaxy S24">${escapeHtml(product.optionText)}</textarea>
              </label>
              ${renderLanguageFields(product, index)}
              <label>재고
                <input name="stock-${index}" type="number" min="0" step="1" value="${product.stock}" />
              </label>
              <label>노출 상태
                <select name="status-${index}">
                  <option value="active" ${product.status !== "hidden" ? "selected" : ""}>메인에 노출</option>
                  <option value="hidden" ${product.status === "hidden" ? "selected" : ""}>숨김</option>
                </select>
              </label>
                </div>
              </details>
            </div>
          </div>
          <button class="danger-btn compact" type="button" data-delete-product="${index}">이 상품 삭제</button>
        </fieldset>
      `,
    )
    .join("");

  editorForm.insertAdjacentHTML("beforeend", `<button class="primary-btn full" type="submit">전체 변경 저장</button>`);
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const password = new FormData(loginForm).get("password");
  if (password !== ADMIN_PASSWORD) {
    showToast("비밀번호가 맞지 않습니다.");
    return;
  }
  sessionStorage.setItem(SESSION_KEY, "true");
  showWorkspace();
});

logoutButton.addEventListener("click", () => {
  sessionStorage.removeItem(SESSION_KEY);
  showLogin();
  showToast("로그아웃했습니다.");
});

document.querySelector("[data-add-product]").addEventListener("click", () => {
  products.unshift({
    id: "custom-" + Date.now(),
    title: "새 스타일 세트",
    subtitle: "케이스와 화면 디자인을 한 번에 맞춘 세트입니다.",
    detail: "케이스, 배경화면, 위젯, 설치 가이드를 포함한 스타일링 세트입니다.",
    price: 79000,
    productType: "bundle",
    image: "assets/sample-product-hero.png",
    gallery: ["assets/sample-product-hero.png", "assets/sample-detail-scene.png", "assets/sample-wallpaper-black-gold.png"],
    video: "assets/sample-product-motion.svg",
    digitalFiles: ["assets/sample-wallpaper-black-gold.png", "assets/sample-wallpaper-midnight.svg"],
    includedItems: ["케이스 1개", "배경화면 10종", "위젯 세팅 가이드"],
    storySections: [
      { eyebrow: "Design", title: "케이스와 화면을 한 번에", body: "상품의 핵심 장점을 애플식 상세 페이지 흐름으로 보여주세요.", image: "assets/sample-product-hero.png" },
    ],
    specs: [
      { label: "Set", value: "3", body: "포함 구성" },
      { label: "Delivery", value: "Both", body: "배송 + 디지털" },
      { label: "Guide", value: "PDF", body: "설정 가이드" },
    ],
    deliveryType: "both",
    badge: "STYLE SET",
    category: "Style Sets",
    optionText: "iPhone 15, iPhone 15 Pro, Galaxy S24",
    stock: 10,
    status: "active",
    mediaBlend: { enabled: true, focusX: 56, focusY: 52, width: 76, height: 70, fade: 18, blur: 48, glow: 22 },
    i18n: {},
  });
  ProductStore.saveProducts(products);
  renderHeroSettings();
  renderEditor();
  showToast("새 상품을 추가했습니다.");
});

assetLibrary.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-copy-asset]");
  if (!button) return;
  try {
    await navigator.clipboard.writeText(button.dataset.copyAsset);
    showToast("샘플 자산 경로를 복사했습니다.");
  } catch (error) {
    showToast(button.dataset.copyAsset);
  }
});

document.querySelector("[data-reset-products]").addEventListener("click", () => {
  products = ProductStore.resetProducts();
  heroSettings = ProductStore.loadHeroSettings();
  renderHeroSettings();
  renderEditor();
  showToast("기본 상품으로 초기화했습니다.");
});

heroForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(heroForm);
  heroSettings = ProductStore.saveHeroSettings({
    maxSlides: data.get("maxSlides"),
    intervalSeconds: data.get("intervalSeconds"),
    selectedProductIds: data.getAll("selectedProductIds"),
  });
  renderHeroSettings();
  showToast("메인 화면 설정을 저장했습니다.");
});

editorForm.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete-product]");
  if (!deleteButton) return;

  products.splice(Number(deleteButton.dataset.deleteProduct), 1);
  ProductStore.saveProducts(products);
  heroSettings = ProductStore.saveHeroSettings({
    ...heroSettings,
    selectedProductIds: heroSettings.selectedProductIds.filter((id) => products.some((product) => product.id === id)),
  });
  renderHeroSettings();
  renderEditor();
  showToast("상품을 삭제했습니다.");
});

editorForm.addEventListener("input", (event) => {
  const match = event.target.name && event.target.name.match(/^blend(?:Enabled|FocusX|FocusY|Width|Height|Fade|Blur|Glow)-(\d+)$/);
  if (!match) return;
  const index = Number(match[1]);
  const formData = new FormData(editorForm);
  const fieldset = event.target.closest(".product-editor");
  const preview = fieldset && fieldset.querySelector(".admin-preview-media");
  if (!preview) return;
  const imageInput = editorForm.querySelector(`[name="image-${index}"]`);
  preview.style.cssText = blendStyleFromSettings(readBlendSettings(formData, index), imageInput ? imageInput.value : products[index].image);
});

editorForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(editorForm);
  const nextProducts = [];

  for (let index = 0; index < products.length; index += 1) {
    const imageUpload = data.get(`file-${index}`);
    const uploadedImage = imageUpload && imageUpload.size > 0 ? await ProductStore.uploadAsset(imageUpload, "products") : "";
    const galleryUploads = await uploadFiles(data.getAll(`galleryFiles-${index}`), "products");
    const videoUpload = data.get(`videoFile-${index}`);
    const uploadedVideo = videoUpload && videoUpload.size > 0 ? await ProductStore.uploadAsset(videoUpload, "videos") : "";
    const digitalUploads = await uploadFiles(data.getAll(`digitalFileUploads-${index}`), "digital");
    const image = uploadedImage || data.get(`image-${index}`).trim();

    nextProducts.push({
      ...products[index],
      title: data.get(`title-${index}`).trim(),
      subtitle: data.get(`subtitle-${index}`).trim(),
      detail: data.get(`detail-${index}`).trim(),
      price: Number(data.get(`price-${index}`)),
      productType: data.get(`productType-${index}`),
      deliveryType: data.get(`deliveryType-${index}`),
      image,
      gallery: [image, ...lines(data.get(`gallery-${index}`)), ...galleryUploads].filter(Boolean),
      video: uploadedVideo || data.get(`video-${index}`).trim(),
      digitalFiles: [...lines(data.get(`digitalFiles-${index}`)), ...digitalUploads].filter(Boolean),
      includedItems: lines(data.get(`includedItems-${index}`)),
      storySections: parseStorySections(data.get(`storySections-${index}`)),
      specs: parseSpecs(data.get(`specs-${index}`)),
      badge: data.get(`badge-${index}`).trim(),
      category: data.get(`category-${index}`),
      optionText: data.get(`optionText-${index}`).trim(),
      stock: Number(data.get(`stock-${index}`)),
      status: data.get(`status-${index}`),
      mediaBlend: readBlendSettings(data, index),
      i18n: productTranslations(data, index, products[index].i18n),
    });
  }

  products = nextProducts;
  ProductStore.saveProducts(products);
  renderHeroSettings();
  renderEditor();
  showToast("상품 정보가 저장되었습니다. 메인과 상세 페이지에 반영됩니다.");
});

orderList.addEventListener("change", (event) => {
  const select = event.target.closest("[data-order-status]");
  if (!select) return;
  ProductStore.updateOrderStatus(select.dataset.orderStatus, select.value);
  renderOrders();
  showToast("주문 상태가 변경되었습니다.");
});

if (sessionStorage.getItem(SESSION_KEY) === "true") {
  showWorkspace();
} else {
  showLogin();
}

ProductStore.syncFromRemote().then((synced) => {
  if (!synced) return;
  products = ProductStore.loadProducts();
  heroSettings = ProductStore.loadHeroSettings();
  if (sessionStorage.getItem(SESSION_KEY) === "true") {
    renderHeroSettings();
    renderEditor();
    renderOrders();
  }
});

window.addEventListener("languagechange", () => {
  renderHeroSettings();
  renderEditor();
  renderOrders();
});
