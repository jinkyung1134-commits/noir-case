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
const logoutButton = document.querySelector("[data-logout]");
const toast = document.querySelector("[data-toast]");

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
            </div>
          `,
        )
        .join("")}
    </section>
  `;
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
              <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.title)}" />
              <span>${product.status === "hidden" ? "숨김" : "노출중"}</span>
            </div>
            <div class="admin-fields">
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
              <label>포함 구성
                <textarea name="includedItems-${index}" placeholder="한 줄에 하나씩 입력">${escapeHtml(product.includedItems.join("\n"))}</textarea>
              </label>
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
    image: "assets/case-aramid.png",
    gallery: ["assets/case-aramid.png"],
    video: "",
    digitalFiles: [],
    includedItems: ["케이스 1개", "배경화면 10종", "위젯 세팅 가이드"],
    deliveryType: "both",
    badge: "STYLE SET",
    category: "Style Sets",
    optionText: "iPhone 15, iPhone 15 Pro, Galaxy S24",
    stock: 10,
    status: "active",
    i18n: {},
  });
  ProductStore.saveProducts(products);
  renderHeroSettings();
  renderEditor();
  showToast("새 상품을 추가했습니다.");
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
      badge: data.get(`badge-${index}`).trim(),
      category: data.get(`category-${index}`),
      optionText: data.get(`optionText-${index}`).trim(),
      stock: Number(data.get(`stock-${index}`)),
      status: data.get(`status-${index}`),
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
