(function () {
  const LANG_KEY = "noir-case-lang";
  const supported = ["ko", "en", "zh"];
  const labels = { ko: "한국어", en: "English", zh: "中文" };

  const dict = {
    ko: {
      navProducts: "스타일 세트",
      navQuality: "품질",
      navSupport: "배송",
      admin: "관리자",
      cart: "장바구니",
      detail: "상세 보기",
      addCartLong: "장바구니 담기",
      buyNow: "바로 결제",
      checkout: "결제하기",
      orderSheet: "주문서",
      cartEmpty: "담긴 상품이 없습니다.",
      cartEmptyAction: "스타일 세트 보러가기",
      cartTotalLabel: "결제 예정 금액",
      cartDemoNote: "현재는 데모 결제입니다. 실제 판매 전 PG 가맹점 심사와 서버 검증을 연결하세요.",
      remove: "삭제",
      cartOpen: "장바구니 열기",
      cartClose: "장바구니 닫기",
      itemUnit: "개",
      productSearch: "상품 검색",
      allCategories: "전체 카테고리",
      featured: "추천순",
      priceLow: "낮은 가격순",
      priceHigh: "높은 가격순",
      newest: "신상품순",
      heroDefaultTitle: "케이스와 화면을 하나의 무드로",
      heroDefaultCopy: "케이스, 배경화면, 위젯까지 맞춰 폰 전체의 인상을 완성하는 프리미엄 스타일링 세트.",
      completeStyling: "Complete Phone Styling",
      collectionTitle: "스타일 세트 컬렉션",
      qualityTitle: "손에 드는 케이스와 매일 보는 화면까지",
      qualityCopy: "케이스의 소재감과 배경화면의 색감, 위젯 구성까지 하나의 무드로 설계합니다. 폰을 켤 때부터 손에 쥘 때까지 자연스럽게 이어지도록 구성했습니다.",
      deliveryDownload: "배송 + 다운로드",
      deliveryDownloadCopy: "케이스는 배송으로, 배경화면과 위젯 파일은 디지털 다운로드로 제공할 수 있습니다.",
      styleMatching: "스타일 매칭",
      styleMatchingCopy: "케이스 컬러와 화면 디자인이 따로 놀지 않도록 세트 단위로 구성합니다.",
      paymentReady: "결제 연동 준비",
      paymentReadyCopy: "토스페이먼츠, 포트원, 카카오페이 같은 국내 PG를 붙일 수 있는 버튼 구조입니다.",
      careReady: "운영 안내 준비",
      careReadyCopy: "교환, 환불, 문의 정보는 실제 판매 전 운영자 확인이 필요합니다. 현재는 안내 구조를 먼저 준비했습니다.",
      footer: "케이스와 화면 디자인을 맞춰주는 폰 스타일링 스토어",
      productNotFound: "상품을 찾을 수 없습니다",
      productNotFoundCopy: "관리자에서 상품을 숨김 처리했거나 삭제했습니다.",
      backStore: "스토어로 돌아가기",
      optionSelect: "옵션 선택",
      quantity: "수량",
      story: "제품 이야기",
      included: "포함 구성",
      experience: "제공 방식",
      gallery: "사진과 영상",
      sampleAssets: "샘플 에셋",
      sampleAssetsTitle: "케이스와 화면 샘플",
      buy: "구매",
      digital: "화면 디자인",
      bundle: "스타일 세트",
      case: "케이스",
      digitalDelivery: "디지털 다운로드",
      bothDelivery: "배송 + 다운로드",
      shippingDelivery: "배송 상품",
      digitalExperience: "결제 후 배경화면, 위젯, 설치 가이드 파일을 디지털로 제공합니다.",
      bothExperience: "케이스는 배송으로, 배경화면과 위젯 파일은 디지털 다운로드로 제공합니다.",
      shippingExperience: "케이스를 입력한 배송지로 발송합니다.",
      noVideo: "등록된 상품 영상이 없습니다.",
      checkoutTitle: "주문서 작성",
      name: "받는 분",
      namePlaceholder: "이름",
      phone: "연락처",
      email: "이메일",
      address: "주소",
      addressPlaceholder: "도로명 주소",
      addressDetail: "상세 주소",
      addressDetailPlaceholder: "동, 호수 등",
      memo: "배송 요청사항",
      memoPlaceholder: "부재 시 문 앞에 놓아주세요.",
      createOrder: "주문 생성 및 결제",
      checkoutHelp: "현재는 데모 주문으로 저장됩니다. PG 키를 연결하면 실제 결제창으로 전환할 수 있습니다.",
      checkoutDemoNote: "데모 주문으로 흐름을 먼저 확인합니다.",
      checkoutPaymentNote: "실결제는 PG 키 연결 후 전환됩니다.",
      checkoutOperatorNote: "배송/환불 정책은 운영자 확인이 필요합니다.",
      orderProducts: "주문 상품",
      total: "총 결제 금액",
    },
    en: {
      navProducts: "Style Sets",
      navQuality: "Quality",
      navSupport: "Delivery",
      admin: "Admin",
      cart: "Cart",
      detail: "View details",
      addCartLong: "Add to cart",
      buyNow: "Buy now",
      checkout: "Checkout",
      orderSheet: "Order",
      cartEmpty: "Your cart is empty.",
      cartEmptyAction: "Browse style sets",
      cartTotalLabel: "Estimated total",
      cartDemoNote: "This is a demo checkout. Connect PG approval and server verification before real sales.",
      remove: "Remove",
      cartOpen: "Open cart",
      cartClose: "Close cart",
      itemUnit: "item",
      productSearch: "Search products",
      allCategories: "All categories",
      featured: "Featured",
      priceLow: "Price: low to high",
      priceHigh: "Price: high to low",
      newest: "Newest",
      heroDefaultTitle: "Case and screen, one complete mood.",
      heroDefaultCopy: "Premium phone styling sets matching cases, wallpapers, widgets, and setup guides.",
      completeStyling: "Complete Phone Styling",
      collectionTitle: "Style Set Collection",
      qualityTitle: "The case you hold. The screen you see.",
      qualityCopy: "We match tactile case finishes, wallpaper tones, and widget layouts into one cohesive look for your phone.",
      deliveryDownload: "Shipping + Download",
      deliveryDownloadCopy: "Cases ship physically, while wallpapers and widget files can be delivered digitally.",
      styleMatching: "Style Matching",
      styleMatchingCopy: "Each set is curated so the case color and screen design feel like one system.",
      paymentReady: "Payment Ready",
      paymentReadyCopy: "The checkout flow is prepared for providers like Toss Payments, PortOne, and Kakao Pay.",
      careReady: "Care Policy Ready",
      careReadyCopy: "Exchange, refund, and contact details need operator confirmation before real sales. The guidance structure is prepared first.",
      footer: "A phone styling store matching cases and screen designs",
      productNotFound: "Product not found",
      productNotFoundCopy: "This product may be hidden or removed by the administrator.",
      backStore: "Back to store",
      optionSelect: "Choose option",
      quantity: "Quantity",
      story: "Product story",
      included: "What's included",
      experience: "How you receive it",
      gallery: "Photos and video",
      sampleAssets: "Sample Assets",
      sampleAssetsTitle: "Case and screen samples",
      buy: "Buy",
      digital: "Screen Design",
      bundle: "Style Set",
      case: "Case",
      digitalDelivery: "Digital download",
      bothDelivery: "Shipping + download",
      shippingDelivery: "Ships physically",
      digitalExperience: "Wallpaper, widget, and setup guide files are provided digitally after purchase.",
      bothExperience: "The case ships to you, while wallpapers and widgets are provided as digital downloads.",
      shippingExperience: "The case ships to your delivery address.",
      noVideo: "No product video has been uploaded.",
      checkoutTitle: "Checkout",
      name: "Recipient",
      namePlaceholder: "Name",
      phone: "Phone",
      email: "Email",
      address: "Address",
      addressPlaceholder: "Street address",
      addressDetail: "Address detail",
      addressDetailPlaceholder: "Apartment, unit, etc.",
      memo: "Delivery note",
      memoPlaceholder: "Leave delivery notes here.",
      createOrder: "Create order & pay",
      checkoutHelp: "This currently saves a demo order. Add a payment key to open a real checkout.",
      checkoutDemoNote: "Use demo orders to verify the flow first.",
      checkoutPaymentNote: "Live payment opens after a PG key is connected.",
      checkoutOperatorNote: "Shipping and refund policy require operator confirmation.",
      orderProducts: "Order items",
      total: "Total",
    },
    zh: {
      navProducts: "风格套装",
      navQuality: "品质",
      navSupport: "配送",
      admin: "管理",
      cart: "购物车",
      detail: "查看详情",
      addCartLong: "加入购物车",
      buyNow: "立即购买",
      checkout: "结账",
      orderSheet: "订单",
      cartEmpty: "购物车为空。",
      cartEmptyAction: "浏览风格套装",
      cartTotalLabel: "预计支付金额",
      cartDemoNote: "当前为演示结账。正式销售前需要连接支付审核和服务器验证。",
      remove: "删除",
      cartOpen: "打开购物车",
      cartClose: "关闭购物车",
      itemUnit: "件",
      productSearch: "搜索商品",
      allCategories: "全部分类",
      featured: "推荐",
      priceLow: "价格从低到高",
      priceHigh: "价格从高到低",
      newest: "新品",
      heroDefaultTitle: "手机壳与屏幕，统一成一种风格。",
      heroDefaultCopy: "将手机壳、壁纸、小组件与设置指南组合成完整的高级手机风格套装。",
      completeStyling: "完整手机风格",
      collectionTitle: "风格套装系列",
      qualityTitle: "手中的手机壳，每天看到的屏幕。",
      qualityCopy: "我们把手机壳质感、壁纸色调与小组件布局整合成一个完整的手机视觉系统。",
      deliveryDownload: "配送 + 下载",
      deliveryDownloadCopy: "手机壳实体配送，壁纸和小组件文件可通过数字下载提供。",
      styleMatching: "风格搭配",
      styleMatchingCopy: "每个套装都经过搭配，让手机壳颜色和屏幕设计看起来像同一个系统。",
      paymentReady: "支付准备",
      paymentReadyCopy: "结账流程已预留，可接入 Toss Payments、PortOne、Kakao Pay 等支付服务。",
      careReady: "运营说明准备",
      careReadyCopy: "换货、退款和联系信息需要在正式销售前由运营者确认。当前先准备说明结构。",
      footer: "搭配手机壳与屏幕设计的手机风格商店",
      productNotFound: "未找到商品",
      productNotFoundCopy: "该商品可能已被管理员隐藏或删除。",
      backStore: "返回商店",
      optionSelect: "选择选项",
      quantity: "数量",
      story: "产品故事",
      included: "包含内容",
      experience: "交付方式",
      gallery: "照片和视频",
      sampleAssets: "示例素材",
      sampleAssetsTitle: "手机壳与屏幕示例",
      buy: "购买",
      digital: "屏幕设计",
      bundle: "风格套装",
      case: "手机壳",
      digitalDelivery: "数字下载",
      bothDelivery: "配送 + 下载",
      shippingDelivery: "实体配送",
      digitalExperience: "购买后提供壁纸、小组件和设置指南文件。",
      bothExperience: "手机壳实体配送，壁纸和小组件以数字下载方式提供。",
      shippingExperience: "手机壳将配送到你填写的地址。",
      noVideo: "尚未上传商品视频。",
      checkoutTitle: "填写订单",
      name: "收件人",
      namePlaceholder: "姓名",
      phone: "电话",
      email: "邮箱",
      address: "地址",
      addressPlaceholder: "街道地址",
      addressDetail: "详细地址",
      addressDetailPlaceholder: "楼栋、门牌号等",
      memo: "配送备注",
      memoPlaceholder: "请填写配送备注。",
      createOrder: "创建订单并支付",
      checkoutHelp: "当前会保存为演示订单。添加支付密钥后可打开真实结账页。",
      checkoutDemoNote: "先用演示订单确认流程。",
      checkoutPaymentNote: "连接支付密钥后再切换为真实支付。",
      checkoutOperatorNote: "配送和退款政策需要运营者确认。",
      orderProducts: "订单商品",
      total: "合计",
    },
  };

  function normalize(lang) {
    const lower = String(lang || "").toLowerCase();
    if (lower.startsWith("zh")) return "zh";
    if (lower.startsWith("ko")) return "ko";
    return "en";
  }

  function current() {
    return localStorage.getItem(LANG_KEY) || normalize(navigator.language);
  }

  async function detect() {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved) return saved;
    try {
      const response = await fetch("https://ipapi.co/json/", { cache: "no-store" });
      const data = await response.json();
      if (data.country_code === "KR") return "ko";
      if (["CN", "HK", "TW", "MO"].includes(data.country_code)) return "zh";
      return normalize(data.languages || navigator.language);
    } catch (error) {
      return normalize(navigator.language);
    }
  }

  function t(key) {
    const lang = current();
    return (dict[lang] && dict[lang][key]) || dict.en[key] || key;
  }

  function setLanguage(lang) {
    localStorage.setItem(LANG_KEY, normalize(lang));
    document.documentElement.lang = current();
    window.dispatchEvent(new CustomEvent("languagechange", { detail: { lang: current() } }));
  }

  function localizedProduct(product) {
    const lang = current();
    const local = product && product.i18n && product.i18n[lang];
    return local ? { ...product, ...local } : product;
  }

  function mountSwitcher() {
    const header = document.querySelector(".site-header");
    if (!header || document.querySelector("[data-language-select]")) return;
    const select = document.createElement("select");
    select.className = "language-select";
    select.dataset.languageSelect = "";
    select.innerHTML = supported.map((lang) => `<option value="${lang}">${labels[lang]}</option>`).join("");
    select.value = current();
    select.addEventListener("change", () => setLanguage(select.value));
    header.appendChild(select);
  }

  function applyStatic() {
    document.documentElement.lang = current();
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = t(node.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      node.placeholder = t(node.dataset.i18nPlaceholder);
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
      node.setAttribute("aria-label", t(node.dataset.i18nAriaLabel));
    });
    const select = document.querySelector("[data-language-select]");
    if (select) select.value = current();
  }

  window.I18n = { t, current, detect, setLanguage, localizedProduct, applyStatic, mountSwitcher };

  document.addEventListener("DOMContentLoaded", async () => {
    const before = current();
    if (!localStorage.getItem(LANG_KEY)) localStorage.setItem(LANG_KEY, await detect());
    mountSwitcher();
    applyStatic();
    if (current() !== before) window.dispatchEvent(new CustomEvent("languagechange", { detail: { lang: current() } }));
  });
})();
