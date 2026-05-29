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
      image: "assets/case-aramid.png",
      gallery: ["assets/case-aramid.png", "assets/hero-case.png"],
      video: "",
      digitalFiles: [],
      includedItems: ["아라미드 슬림 케이스 1개", "블랙 배경화면 12종", "위젯 이미지 4종", "설치 가이드"],
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
        },
        zh: {
          title: "黑色指挥风格套装",
          subtitle: "磨砂黑手机壳搭配黑色小组件和壁纸的代表套装。",
          detail: "高级手机风格套装，将手机壳质感与屏幕色调统一起来，适合黑色桌面、车内空间和利落的日常风格。",
          includedItems: ["芳纶纤维薄款手机壳", "12 张黑色壁纸", "4 个小组件图片", "设置指南"],
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
      image: "assets/case-tactical.png",
      gallery: ["assets/case-tactical.png", "assets/hero-case.png"],
      video: "",
      digitalFiles: [],
      includedItems: ["러기드 보호 케이스 1개", "다크 메탈 배경화면 10종", "잠금화면 위젯 구성", "설치 가이드"],
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
        },
        zh: {
          title: "战术屏幕套装",
          subtitle: "坚固手机壳搭配深色金属屏幕设计。",
          detail: "保护型风格套装，包含坚固手机壳、深色金属壁纸、小组件布局和简单设置指南。",
          includedItems: ["坚固保护手机壳", "10 张深色金属壁纸", "锁屏小组件布局", "设置指南"],
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
      image: "assets/hero-case.png",
      gallery: ["assets/hero-case.png", "assets/case-leather.png"],
      video: "",
      digitalFiles: [],
      includedItems: ["배경화면 15종", "위젯 이미지 6종", "설정 가이드 PDF"],
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
        },
        zh: {
          title: "黑色数字包",
          subtitle: "适合只想更新屏幕的壁纸与小组件包。",
          detail: "数字专用商品，用简洁黑色调整理手机屏幕。包含壁纸、小组件图片和设置指南。",
          includedItems: ["15 张壁纸", "6 个小组件图片", "设置指南 PDF"],
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

  function normalizeProduct(product) {
    const image = product.image || "assets/case-aramid.png";
    const gallery = cleanList(product.gallery);
    const productType = product.productType || "case";
    const includedItems = cleanList(product.includedItems);
    return {
      id: product.id || "product-" + Date.now(),
      title: product.title || "새 스타일 세트",
      subtitle: product.subtitle || "케이스와 화면 디자인을 맞춘 상품입니다.",
      detail: product.detail || product.subtitle || "상세 설명을 입력하세요.",
      price: Number(product.price) || 0,
      productType,
      image,
      gallery: gallery.length ? gallery : [image],
      video: product.video || "",
      digitalFiles: cleanList(product.digitalFiles),
      includedItems: includedItems.length ? includedItems : ["상품 1개"],
      deliveryType: product.deliveryType || (productType === "digital" ? "digital" : productType === "bundle" ? "both" : "shipping"),
      badge: product.badge || "NEW",
      category: product.category || "Style Sets",
      optionText: product.optionText || "기본 옵션",
      stock: Number(product.stock) || 0,
      status: product.status || "active",
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
    return {
      maxSlides: 3,
      intervalSeconds: 5,
      selectedProductIds: defaultProducts.map((product) => product.id),
    };
  }

  function loadHeroSettings() {
    const fallback = defaultHeroSettings();
    const saved = localStorage.getItem(HERO_SETTINGS_KEY);
    if (!saved) return fallback;
    try {
      const parsed = JSON.parse(saved);
      return {
        maxSlides: Math.max(1, Number(parsed.maxSlides) || fallback.maxSlides),
        intervalSeconds: Math.max(2, Number(parsed.intervalSeconds) || fallback.intervalSeconds),
        selectedProductIds: Array.isArray(parsed.selectedProductIds) ? parsed.selectedProductIds : fallback.selectedProductIds,
      };
    } catch (error) {
      return fallback;
    }
  }

  function saveHeroSettings(settings) {
    const nextSettings = {
      maxSlides: Math.max(1, Number(settings.maxSlides) || 1),
      intervalSeconds: Math.max(2, Number(settings.intervalSeconds) || 5),
      selectedProductIds: Array.isArray(settings.selectedProductIds) ? settings.selectedProductIds : [],
    };
    localStorage.setItem(HERO_SETTINGS_KEY, JSON.stringify(nextSettings));
    remoteSetState("hero_settings", nextSettings).catch(() => {});
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
  };
})();
