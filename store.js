(function () {
  const STORAGE_KEY = "noir-case-products";
  const ORDERS_KEY = "noir-case-orders";
  const CART_KEY = "noir-case-cart";
  const HERO_SETTINGS_KEY = "noir-case-hero-settings";

  const defaultProducts = [
    {
      id: "black-command-set",
      title: "Black Command Style Set",
      subtitle: "매트 블랙 케이스와 블랙 위젯, 배경화면을 한 번에 맞춘 대표 세트",
      detail:
        "케이스의 소재감과 화면의 톤을 하나로 맞춘 프리미엄 폰 스타일링 세트입니다. 블랙 데스크 셋업, 차량 인테리어, 정장 스타일과 자연스럽게 어울립니다.",
      price: 79000,
      productType: "bundle",
      image: "assets/sample-product-hero.png",
      gallery: ["assets/sample-product-hero.png", "assets/sample-detail-scene.png", "assets/sample-wallpaper-black-gold.png", "assets/hero-case.png"],
      video: "assets/sample-product-motion.svg",
      digitalFiles: ["assets/sample-wallpaper-black-gold.png", "assets/sample-wallpaper-midnight.svg"],
      includedItems: ["아라미드 슬림 케이스 1개", "블랙 배경화면 12종", "위젯 이미지 4종", "설치 가이드"],
      storySections: [
        { eyebrow: "Material", title: "손끝에 남는 매트 블랙", body: "얇고 단단한 케이스 표면이 빛을 과하게 반사하지 않아 화면 디자인과 차분하게 맞물립니다.", image: "assets/sample-product-hero.png" },
        { eyebrow: "Screen Set", title: "잠금화면까지 하나의 톤으로", body: "배경화면과 위젯 이미지를 함께 제공해 케이스를 씌운 순간부터 화면을 켠 순간까지 같은 인상을 만듭니다.", image: "assets/sample-detail-scene.png" },
      ],
      specs: [
        { label: "Profile", value: "1.2mm", body: "카메라 보호 립" },
        { label: "Weight", value: "38g", body: "슬림 라인 평균 중량" },
        { label: "Set", value: "16 files", body: "배경화면과 위젯 구성" },
      ],
      deliveryType: "both",
      badge: "STYLE SET",
      category: "Style Sets",
      optionText: "iPhone 15 Pro, iPhone 15 Pro Max, Galaxy S24",
      stock: 18,
      status: "active",
      i18n: {
        en: {
          title: "Black Command Style Set",
          subtitle: "A signature set matching a matte black case with black widgets and wallpapers.",
          detail: "A premium phone styling set matching the tactile finish of the case with the tone of your screen. It fits black desk setups, car interiors, and tailored everyday style.",
          includedItems: ["Aramid slim case", "12 black wallpapers", "4 widget images", "Setup guide"],
          storySections: [
            { eyebrow: "Material", title: "Matte black at your fingertips", body: "A slim, rigid surface keeps reflections low and pairs naturally with a dark screen system.", image: "assets/sample-product-hero.png" },
            { eyebrow: "Screen Set", title: "One tone from lock screen to case", body: "Wallpapers and widget images complete the same impression from the moment the screen lights up.", image: "assets/sample-detail-scene.png" },
          ],
          specs: [
            { label: "Profile", value: "1.2mm", body: "Camera protection lip" },
            { label: "Weight", value: "38g", body: "Average slim-line weight" },
            { label: "Set", value: "16 files", body: "Wallpaper and widget assets" },
          ],
        },
        zh: {
          title: "黑色指挥风格套装",
          subtitle: "磨砂黑手机壳搭配黑色小组件和壁纸的代表套装。",
          detail: "高级手机风格套装，将手机壳质感与屏幕色调统一起来，适合黑色桌面、车内空间和利落的日常风格。",
          includedItems: ["芳纶纤维薄款手机壳", "12 张黑色壁纸", "4 个小组件图片", "设置指南"],
          storySections: [
            { eyebrow: "材质", title: "指尖上的哑光黑", body: "纤薄而坚固的表面减少反光，与深色屏幕系统自然融合。", image: "assets/sample-product-hero.png" },
            { eyebrow: "屏幕套装", title: "从锁屏到手机壳统一色调", body: "壁纸和小组件图片让屏幕亮起的瞬间也保持同一种风格。", image: "assets/sample-detail-scene.png" },
          ],
          specs: [
            { label: "厚度", value: "1.2mm", body: "相机保护边框" },
            { label: "重量", value: "38g", body: "薄款平均重量" },
            { label: "套装", value: "16 files", body: "壁纸和小组件素材" },
          ],
        },
      },
    },
    {
      id: "tactical-screen-set",
      title: "Tactical Screen Set",
      subtitle: "러기드 케이스와 다크 메탈 화면 디자인을 묶은 보호형 세트",
      detail:
        "강한 보호감을 주는 러기드 케이스와 다크 메탈 무드의 배경화면, 위젯 구성을 함께 제공합니다. 실용성과 분위기를 동시에 잡는 세트입니다.",
      price: 89000,
      productType: "bundle",
      image: "assets/sample-detail-scene.png",
      gallery: ["assets/sample-detail-scene.png", "assets/case-tactical.png", "assets/sample-wallpaper-black-gold.png"],
      video: "assets/sample-product-motion.svg",
      digitalFiles: ["assets/sample-wallpaper-black-gold.png", "assets/sample-wallpaper-midnight.svg"],
      includedItems: ["러기드 보호 케이스 1개", "다크 메탈 배경화면 10종", "잠금화면 위젯 구성", "설치 가이드"],
      storySections: [
        { eyebrow: "Protection", title: "두껍지 않게, 더 단단하게", body: "모서리 충격을 분산하는 러기드 구조로 일상 사용에서 안심감을 줍니다.", image: "assets/case-tactical.png" },
        { eyebrow: "Metal Mood", title: "다크 메탈 화면 디자인", body: "잠금화면과 홈 화면이 케이스의 보호감과 같은 무드로 이어집니다.", image: "assets/hero-case.png" },
      ],
      specs: [
        { label: "Guard", value: "360°", body: "모서리 충격 분산" },
        { label: "Files", value: "10+", body: "다크 메탈 배경화면" },
        { label: "Guide", value: "PDF", body: "설치 가이드 제공" },
      ],
      deliveryType: "both",
      badge: "RUGGED SET",
      category: "Style Sets",
      optionText: "iPhone 15, iPhone 15 Pro, Galaxy S24 Ultra",
      stock: 11,
      status: "active",
      i18n: {
        en: {
          title: "Tactical Screen Set",
          subtitle: "A rugged case paired with dark metal screen designs.",
          detail: "A protective styling set combining a rugged case, dark metal wallpapers, widget layouts, and a simple setup guide.",
          includedItems: ["Rugged protective case", "10 dark metal wallpapers", "Lock screen widget layout", "Setup guide"],
          storySections: [
            { eyebrow: "Protection", title: "Tougher without feeling bulky", body: "A rugged corner structure disperses impact and keeps daily use reassuring.", image: "assets/case-tactical.png" },
            { eyebrow: "Metal Mood", title: "Dark metal screen design", body: "The lock screen and home screen carry the same protective tone as the case.", image: "assets/hero-case.png" },
          ],
          specs: [
            { label: "Guard", value: "360°", body: "Corner impact dispersion" },
            { label: "Files", value: "10+", body: "Dark metal wallpapers" },
            { label: "Guide", value: "PDF", body: "Setup guide included" },
          ],
        },
        zh: {
          title: "战术屏幕套装",
          subtitle: "坚固手机壳搭配深色金属屏幕设计。",
          detail: "保护型风格套装，包含坚固手机壳、深色金属壁纸、小组件布局和简单设置指南。",
          includedItems: ["坚固保护手机壳", "10 张深色金属壁纸", "锁屏小组件布局", "设置指南"],
          storySections: [
            { eyebrow: "保护", title: "不厚重，也更安心", body: "坚固的边角结构分散冲击，适合日常使用。", image: "assets/case-tactical.png" },
            { eyebrow: "金属质感", title: "深色金属屏幕设计", body: "锁屏和主屏延续手机壳的保护感与深色风格。", image: "assets/hero-case.png" },
          ],
          specs: [
            { label: "保护", value: "360°", body: "边角冲击分散" },
            { label: "文件", value: "10+", body: "深色金属壁纸" },
            { label: "指南", value: "PDF", body: "包含设置指南" },
          ],
        },
      },
    },
    {
      id: "noir-widget-pack",
      title: "Noir Digital Pack",
      subtitle: "케이스 없이 화면만 바꾸고 싶은 고객을 위한 배경화면과 위젯 팩",
      detail:
        "폰 화면의 분위기를 블랙 톤으로 정리하는 디지털 전용 상품입니다. 배경화면, 위젯 이미지, 세팅 가이드를 다운로드 형태로 제공합니다.",
      price: 19900,
      productType: "digital",
      image: "assets/sample-wallpaper-black-gold.png",
      gallery: ["assets/sample-wallpaper-black-gold.png", "assets/sample-wallpaper-midnight.svg", "assets/hero-case.png"],
      video: "assets/sample-product-motion.svg",
      digitalFiles: ["assets/sample-wallpaper-black-gold.png", "assets/sample-wallpaper-midnight.svg"],
      includedItems: ["배경화면 15종", "위젯 이미지 6종", "설정 가이드 PDF"],
      storySections: [
        { eyebrow: "Digital", title: "케이스 없이도 완성되는 화면", body: "블랙 톤 배경화면과 위젯 이미지만으로 폰의 첫인상을 정리합니다.", image: "assets/hero-case.png" },
        { eyebrow: "Setup", title: "따라 하기 쉬운 구성", body: "설정 가이드를 따라 잠금화면과 홈 화면을 빠르게 맞출 수 있습니다.", image: "assets/case-leather.png" },
      ],
      specs: [
        { label: "Wallpaper", value: "15", body: "배경화면 파일" },
        { label: "Widget", value: "6", body: "위젯 이미지" },
        { label: "Delivery", value: "Instant", body: "디지털 다운로드" },
      ],
      deliveryType: "digital",
      badge: "DIGITAL",
      category: "Wallpapers",
      optionText: "iPhone, Galaxy",
      stock: 999,
      status: "active",
      i18n: {
        en: {
          title: "Noir Digital Pack",
          subtitle: "A wallpaper and widget pack for customers who want to refresh only the screen.",
          detail: "A digital-only product for organizing your phone screen in a clean black tone. Includes wallpapers, widget images, and a setup guide.",
          includedItems: ["15 wallpapers", "6 widget images", "Setup guide PDF"],
          storySections: [
            { eyebrow: "Digital", title: "A complete screen without a case", body: "Black wallpapers and widget images refine the first impression of your phone.", image: "assets/hero-case.png" },
            { eyebrow: "Setup", title: "Easy to follow", body: "Use the guide to quickly match your lock screen and home screen.", image: "assets/case-leather.png" },
          ],
          specs: [
            { label: "Wallpaper", value: "15", body: "Wallpaper files" },
            { label: "Widget", value: "6", body: "Widget images" },
            { label: "Delivery", value: "Instant", body: "Digital download" },
          ],
        },
        zh: {
          title: "黑色数字包",
          subtitle: "适合只想更新屏幕的壁纸与小组件包。",
          detail: "数字专用商品，用简洁黑色调整理手机屏幕。包含壁纸、小组件图片和设置指南。",
          includedItems: ["15 张壁纸", "6 个小组件图片", "设置指南 PDF"],
          storySections: [
            { eyebrow: "数字", title: "没有手机壳也能完成屏幕风格", body: "黑色壁纸和小组件图片可以快速整理手机第一印象。", image: "assets/hero-case.png" },
            { eyebrow: "设置", title: "容易跟随的配置", body: "按照指南快速搭配锁屏和主屏。", image: "assets/case-leather.png" },
          ],
          specs: [
            { label: "壁纸", value: "15", body: "壁纸文件" },
            { label: "小组件", value: "6", body: "小组件图片" },
            { label: "交付", value: "Instant", body: "数字下载" },
          ],
        },
      },
    },
  ];

  function getConfig() {
    return window.SiteConfig || { supabase: {}, payment: {} };
  }

  function remoteReady() {
    const supabase = getConfig().supabase || {};
    return Boolean(supabase.url && supabase.anonKey);
  }

  function remoteHeaders() {
    const supabase = getConfig().supabase || {};
    return {
      apikey: supabase.anonKey,
      Authorization: `Bearer ${supabase.anonKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    };
  }

  async function remoteSetState(key, data) {
    if (!remoteReady()) return;
    const supabase = getConfig().supabase;
    await fetch(`${supabase.url.replace(/\/$/, "")}/rest/v1/site_state?on_conflict=key`, {
      method: "POST",
      headers: remoteHeaders(),
      body: JSON.stringify({ key, data, updated_at: new Date().toISOString() }),
    });
  }

  async function remoteGetState(key) {
    if (!remoteReady()) return null;
    const supabase = getConfig().supabase;
    const response = await fetch(
      `${supabase.url.replace(/\/$/, "")}/rest/v1/site_state?key=eq.${encodeURIComponent(key)}&select=data&limit=1`,
      { headers: remoteHeaders() },
    );
    if (!response.ok) return null;
    const rows = await response.json();
    return rows[0] ? rows[0].data : null;
  }

  function cleanList(value) {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (!value) return [];
    return String(value)
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function cleanObjects(value, fallback = []) {
    if (!Array.isArray(value)) return fallback;
    return value
      .filter((item) => item && typeof item === "object")
      .map((item) => ({ ...item }))
      .filter((item) => Object.values(item).some(Boolean));
  }

  function clampNumber(value, fallback, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, number));
  }

  function normalizeMediaBlend(value = {}) {
    return {
      enabled: value.enabled !== false,
      focusX: clampNumber(value.focusX, 56, -25, 125),
      focusY: clampNumber(value.focusY, 52, -25, 125),
      width: clampNumber(value.width, 76, 20, 180),
      height: clampNumber(value.height, 70, 20, 180),
      fade: clampNumber(value.fade, 18, 0, 55),
      blur: clampNumber(value.blur, 60, 0, 140),
      glow: clampNumber(value.glow, 18, 0, 100),
    };
  }

  function fallbackProductCopy(product = {}, image = "", productType = "case") {
    const title = String(product.title || "").trim();
    const subtitle = String(product.subtitle || "").trim();
    const genericTitles = new Set(["새 스타일 세트", "New Style Set"]);
    const genericSubtitles = new Set(["케이스와 화면 디자인을 한 번에 맞춘 세트입니다.", "케이스와 화면 디자인을 맞춘 상품입니다."]);
    const titleIsGeneric = !title || genericTitles.has(title);
    const subtitleIsGeneric = !subtitle || genericSubtitles.has(subtitle);

    if (titleIsGeneric && String(product.id || "").startsWith("custom-")) {
      return {
        title: "Noir Signature Style Set",
        subtitle: "대표 상품으로 다듬어 판매할 수 있는 프리미엄 스타일 세트",
      };
    }

    if (image.includes("sample-detail-scene") || image.includes("case-tactical")) {
      return {
        title: titleIsGeneric ? "Tactical Screen Set" : title,
        subtitle: subtitleIsGeneric ? "강한 보호감과 다크 메탈 화면 무드를 하나로 맞춘 세트" : subtitle,
      };
    }

    if (productType === "digital" || image.includes("wallpaper")) {
      return {
        title: titleIsGeneric ? "Noir Digital Pack" : title,
        subtitle: subtitleIsGeneric ? "화면만 바꿔도 분위기가 정리되는 배경화면과 위젯 팩" : subtitle,
      };
    }

    return {
      title: titleIsGeneric ? "Black Command Style Set" : title,
      subtitle: subtitleIsGeneric ? "매트 블랙 케이스와 화면 디자인을 한 번에 맞춘 대표 세트" : subtitle,
    };
  }

  function normalizeProduct(product) {
    const image = product.image || "assets/case-aramid.png";
    const gallery = cleanList(product.gallery);
    const productType = product.productType || "case";
    const includedItems = cleanList(product.includedItems);
    const fallbackCopy = fallbackProductCopy(product, image, productType);
    const fallbackStorySections = [
      { eyebrow: product.badge || "Design", title: fallbackCopy.title, body: product.detail || fallbackCopy.subtitle, image },
    ];
    const fallbackSpecs = [
      { label: "Type", value: productType === "digital" ? "Digital" : "Case", body: product.deliveryType || "shipping" },
      { label: "Stock", value: productType === "digital" ? "∞" : String(Number(product.stock) || 0), body: "available" },
      { label: "Set", value: String(includedItems.length || 1), body: "included items" },
    ];
    return {
      id: product.id || "product-" + Date.now(),
      title: fallbackCopy.title,
      subtitle: fallbackCopy.subtitle,
      detail: product.detail || fallbackCopy.subtitle,
      price: Number(product.price) || 0,
      productType,
      image,
      gallery: gallery.length ? gallery : [image],
      video: product.video || "",
      digitalFiles: cleanList(product.digitalFiles),
      includedItems: includedItems.length ? includedItems : ["상품 1개"],
      storySections: cleanObjects(product.storySections, fallbackStorySections),
      specs: cleanObjects(product.specs, fallbackSpecs),
      deliveryType: product.deliveryType || (productType === "digital" ? "digital" : productType === "bundle" ? "both" : "shipping"),
      badge: product.badge || "NEW",
      category: product.category || "Style Sets",
      optionText: product.optionText || "기본 옵션",
      stock: Number(product.stock) || 0,
      status: product.status || "active",
      mediaBlend: normalizeMediaBlend(product.mediaBlend),
      i18n: product.i18n || {},
    };
  }

  function loadProducts() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultProducts.map(normalizeProduct);
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.map(normalizeProduct) : defaultProducts.map(normalizeProduct);
    } catch (error) {
      return defaultProducts.map(normalizeProduct);
    }
  }

  function saveProducts(products) {
    const normalized = products.map(normalizeProduct);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    remoteSetState("products", normalized).catch(() => {});
  }

  async function publishProducts(products) {
    const normalized = products.map(normalizeProduct);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    await remoteSetState("products", normalized);
    return normalized;
  }

  function resetProducts() {
    saveProducts(defaultProducts);
    return loadProducts();
  }

  function activeProducts(products) {
    return products.filter((product) => product.status !== "hidden");
  }

  function findProduct(id) {
    return loadProducts().find((product) => product.id === id);
  }

  function currentCurrency() {
    const lang = window.I18n && I18n.current ? I18n.current() : "ko";
    if (lang === "en") return { code: "USD", locale: "en-US", maximumFractionDigits: 2 };
    if (lang === "zh") return { code: "CNY", locale: "zh-CN", maximumFractionDigits: 2 };
    return { code: "KRW", locale: "ko-KR", maximumFractionDigits: 0 };
  }

  function currencyRate(currencyCode) {
    const currency = (getConfig().currency || {});
    const rates = currency.rates || {};
    return Number(rates[currencyCode]) || 1;
  }

  function formatPrice(value) {
    const currency = currentCurrency();
    const converted = (Number(value) || 0) * currencyRate(currency.code);
    if (currency.code === "KRW") {
      return new Intl.NumberFormat("ko-KR").format(converted) + "원";
    }
    return new Intl.NumberFormat(currency.locale, {
      style: "currency",
      currency: currency.code,
      maximumFractionDigits: currency.maximumFractionDigits,
    }).format(converted);
  }

  function formatWon(value) {
    return formatPrice(value);
  }

  function loadCart() {
    const saved = localStorage.getItem(CART_KEY);
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function addToCart(product, quantity, option) {
    const displayProduct = window.I18n && I18n.localizedProduct ? I18n.localizedProduct(product) : product;
    const cart = loadCart();
    cart.push({
      lineId: "LINE-" + Date.now(),
      productId: product.id,
      title: displayProduct.title,
      price: Number(product.price) || 0,
      image: product.image,
      quantity: Number(quantity) || 1,
      option: option || "기본 옵션",
      productType: product.productType || "case",
      deliveryType: product.deliveryType || "shipping",
      digitalFiles: product.digitalFiles || [],
    });
    saveCart(cart);
    return cart;
  }

  function removeCartLine(lineId) {
    const cart = loadCart().filter((item) => item.lineId !== lineId);
    saveCart(cart);
    return cart;
  }

  function clearCart() {
    saveCart([]);
  }

  function cartTotal(cart) {
    return cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity || 1), 0);
  }

  function cartNeedsShipping(cart) {
    return cart.some((item) => item.deliveryType === "shipping" || item.deliveryType === "both");
  }

  function loadOrders() {
    const saved = localStorage.getItem(ORDERS_KEY);
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function saveOrders(orders) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    remoteSetState("orders", orders).catch(() => {});
  }

  function saveOrder(order) {
    const orders = loadOrders();
    orders.unshift({
      id: order.id || "ORDER-" + Date.now(),
      createdAt: order.createdAt || new Date().toISOString(),
      status: order.status || "주문 접수",
      items: order.items || [],
      total: Number(order.total) || 0,
      customer: order.customer || null,
      needsShipping: Boolean(order.needsShipping),
      downloadFiles: order.downloadFiles || [],
    });
    saveOrders(orders);
    return orders;
  }

  function updateOrderStatus(orderId, status) {
    const orders = loadOrders().map((order) => (order.id === orderId ? { ...order, status } : order));
    saveOrders(orders);
    return orders;
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function uploadAsset(file, folder) {
    const config = getConfig();
    const supabase = config.supabase || {};
    if (!supabase.url || !supabase.anonKey || !supabase.storageBucket) {
      return fileToDataUrl(file);
    }
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${folder}/${Date.now()}-${safeName}`;
    const endpoint = `${supabase.url.replace(/\/$/, "")}/storage/v1/object/${supabase.storageBucket}/${path}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: supabase.anonKey,
        Authorization: `Bearer ${supabase.anonKey}`,
        "Content-Type": file.type || "application/octet-stream",
        "x-upsert": "true",
      },
      body: file,
    });
    if (!response.ok) throw new Error("파일 업로드에 실패했습니다.");
    return `${supabase.url.replace(/\/$/, "")}/storage/v1/object/public/${supabase.storageBucket}/${path}`;
  }

  function defaultHeroSettings() {
    const slides = defaultProducts.map((product) => ({
      productId: product.id,
      tone: 34,
      imageBrightness: 92,
      backgroundGlow: 26,
      overlayStrength: 48,
      textTop: 46,
      imageScale: 100,
      mediaBlend: normalizeMediaBlend(product.mediaBlend),
    }));
    return {
      maxSlides: 3,
      intervalSeconds: 5,
      selectedProductIds: defaultProducts.map((product) => product.id),
      slides,
      tone: 34,
      imageBrightness: 92,
      backgroundGlow: 26,
      overlayStrength: 48,
      textTop: 46,
      imageScale: 100,
    };
  }

  function normalizeHeroSlide(slide = {}, fallback = {}) {
    return {
      productId: slide.productId || fallback.productId || "",
      eyebrow: slide.eyebrow || "",
      title: slide.title || "",
      subtitle: slide.subtitle || "",
      image: slide.image || "",
      backgroundColor: slide.backgroundColor || fallback.backgroundColor || "#050506",
      backgroundEndColor: slide.backgroundEndColor || fallback.backgroundEndColor || "#111214",
      accentColor: slide.accentColor || fallback.accentColor || "#b9975b",
      textColor: slide.textColor || fallback.textColor || "#f7f3ea",
      tone: clampNumber(slide.tone, fallback.tone ?? 34, 0, 100),
      imageBrightness: clampNumber(slide.imageBrightness, fallback.imageBrightness ?? 92, 55, 150),
      backgroundGlow: clampNumber(slide.backgroundGlow, fallback.backgroundGlow ?? 22, 0, 100),
      overlayStrength: clampNumber(slide.overlayStrength, fallback.overlayStrength ?? 48, 0, 74),
      textTop: clampNumber(slide.textTop, fallback.textTop ?? 46, 25, 56),
      imageScale: clampNumber(slide.imageScale, fallback.imageScale ?? 100, 50, 160),
      mediaBlend: normalizeMediaBlend(slide.mediaBlend || fallback.mediaBlend),
    };
  }

  function normalizeHeroSettings(settings = {}) {
    const fallback = defaultHeroSettings();
    const selectedProductIds = Array.isArray(settings.selectedProductIds) ? settings.selectedProductIds : fallback.selectedProductIds;
    const legacySlideDefaults = {
      tone: settings.tone,
      imageBrightness: settings.imageBrightness,
      backgroundGlow: settings.backgroundGlow,
      overlayStrength: settings.overlayStrength,
      textTop: settings.textTop,
      imageScale: settings.imageScale,
    };
    const slidesSource = Array.isArray(settings.slides) && settings.slides.length
      ? settings.slides
      : selectedProductIds.map((productId) => ({ productId, ...legacySlideDefaults }));
    const slides = slidesSource.map((slide) => normalizeHeroSlide(slide, legacySlideDefaults)).filter((slide) => slide.productId);
    return {
      maxSlides: Math.max(1, Number(settings.maxSlides) || fallback.maxSlides),
      intervalSeconds: Math.max(2, Number(settings.intervalSeconds) || fallback.intervalSeconds),
      selectedProductIds: slides.length ? slides.map((slide) => slide.productId) : selectedProductIds,
      slides: slides.length ? slides : fallback.slides,
      tone: clampNumber(settings.tone, fallback.tone, 0, 100),
      imageBrightness: clampNumber(settings.imageBrightness, fallback.imageBrightness, 55, 150),
      backgroundGlow: clampNumber(settings.backgroundGlow, fallback.backgroundGlow, 0, 100),
      overlayStrength: clampNumber(settings.overlayStrength, fallback.overlayStrength, 0, 74),
      textTop: clampNumber(settings.textTop, fallback.textTop, 25, 56),
      imageScale: clampNumber(settings.imageScale, fallback.imageScale, 50, 160),
    };
  }

  function loadHeroSettings() {
    const saved = localStorage.getItem(HERO_SETTINGS_KEY);
    if (!saved) return defaultHeroSettings();
    try {
      return normalizeHeroSettings(JSON.parse(saved));
    } catch (error) {
      return defaultHeroSettings();
    }
  }

  function saveHeroSettings(settings) {
    const nextSettings = normalizeHeroSettings(settings);
    localStorage.setItem(HERO_SETTINGS_KEY, JSON.stringify(nextSettings));
    remoteSetState("hero_settings", nextSettings).catch(() => {});
    return nextSettings;
  }

  async function publishHeroSettings(settings) {
    const nextSettings = normalizeHeroSettings(settings);
    localStorage.setItem(HERO_SETTINGS_KEY, JSON.stringify(nextSettings));
    await remoteSetState("hero_settings", nextSettings);
    return nextSettings;
  }

  async function syncFromRemote() {
    if (!remoteReady()) return false;
    const [remoteProducts, remoteOrders, remoteHeroSettings] = await Promise.all([
      remoteGetState("products"),
      remoteGetState("orders"),
      remoteGetState("hero_settings"),
    ]);
    if (Array.isArray(remoteProducts)) localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteProducts.map(normalizeProduct)));
    if (Array.isArray(remoteOrders)) localStorage.setItem(ORDERS_KEY, JSON.stringify(remoteOrders));
    if (remoteHeroSettings) localStorage.setItem(HERO_SETTINGS_KEY, JSON.stringify(remoteHeroSettings));
    return true;
  }

  window.ProductStore = {
    STORAGE_KEY,
    ORDERS_KEY,
    CART_KEY,
    HERO_SETTINGS_KEY,
    defaultProducts,
    loadProducts,
    saveProducts,
    publishProducts,
    resetProducts,
    activeProducts,
    findProduct,
    formatPrice,
    formatWon,
    loadCart,
    saveCart,
    addToCart,
    removeCartLine,
    clearCart,
    cartTotal,
    cartNeedsShipping,
    loadOrders,
    saveOrders,
    saveOrder,
    updateOrderStatus,
    uploadAsset,
    syncFromRemote,
    loadHeroSettings,
    saveHeroSettings,
    publishHeroSettings,
  };
})();
