/**
 * ============================================================================
 * ATELIER MARINA — CARDÁPIO DIGITAL & SISTEMA DE ENCOMENDAS
 * Disciplina de Engenharia de Software — UFRJ
 * 
 * Arquitetura Limpa:
 * - Domain / Business Rules (Regra de 3 dias, Sinal de 50%, Pedido WhatsApp)
 * - Data Persistence (LocalStorage com backup dos dados padrão do PDF)
 * - Presentation Layer (UI State, Modais, Reatividade Vanilla JS)
 * ============================================================================
 */

// ============================================================================
// 1. DADOS INICIAIS (Fiel ao Cardápio em PDF do Atelier Marina)
// ============================================================================
const DEFAULT_CATALOG = [
  {
    id: "prod-1",
    name: "Salgados Assados",
    category: "salgados",
    description: "Massa leve e douradinha, assada artesanalmente com recheios especiais.",
    image: "assets/img/salgados_assados.jpg",
    active: true,
    variants: [
      { name: "Bandeja com 15 unid.", price: 15.00 },
      { name: "Cento", price: 60.00 }
    ],
    flavors: [
      "Queijo e Presunto",
      "Frango",
      "Frango com Catupiry",
      "Enroladinho de Salsicha"
    ]
  },
  {
    id: "prod-2",
    name: "Empadão de Frango",
    category: "salgados",
    description: "Massa que derrete na boca, recheio super cremoso e generoso.",
    image: "assets/img/empadao_frango.jpg",
    active: true,
    variants: [
      { name: "300g (Individual)", price: 8.00 },
      { name: "1 Kg (Médio)", price: 60.00 },
      { name: "2 Kg (Grande)", price: 70.00 }
    ],
    flavors: [
      "Tradicional",
      "Frango com Catupiry",
      "Frango com Palmito e Queijo"
    ]
  },
  {
    id: "prod-3",
    name: "Salgadinhos Fritos",
    category: "salgados",
    description: "Crocantes e sequinhos por fora, suculentos por dentro. Perfeitos para festas.",
    image: "assets/img/salgadinhos_fritos.jpg",
    active: true,
    variants: [
      { name: "Cento Frito (Pronto para servir)", price: 60.00 },
      { name: "Cento Congelado (Para fritar em casa)", price: 50.00 }
    ],
    flavors: [
      "Queijo e Presunto",
      "Coxinha",
      "Quibe",
      "Risole de Carne",
      "Enroladinho de Salsicha",
      "Risole de Calabresa",
      "Bolinha de Queijo"
    ]
  },
  {
    id: "prod-4",
    name: "Empadinhas",
    category: "salgados",
    description: "Perfeito para qualquer ocasião! Massa folhada e delicada com recheios nobres.",
    image: "assets/img/empadinhas.jpg",
    active: true,
    variants: [
      { name: "Unidade", price: 5.00 }
    ],
    flavors: [
      "Frango",
      "Queijo",
      "Frango com Catupiry",
      "Frango com Palmito e Queijo",
      "Camarão"
    ]
  },
  {
    id: "prod-5",
    name: "Brownie Tradicional",
    category: "doces",
    description: "Brownie artesanal de chocolate nobre, com casquinha crocante por fora e interior macio.",
    image: "assets/img/brownie_tradicional.jpg",
    active: true,
    variants: [
      { name: "Valor da Unidade", price: 5.00 }
    ],
    flavors: []
  },
  {
    id: "prod-6",
    name: "Mini Brownies",
    category: "doces",
    description: "Perfeito para o seu evento! Porções individuais decoradas com coberturas especiais.",
    image: "assets/img/mini_brownies.jpg",
    active: true,
    variants: [
      { name: "50 unidades", price: 65.00 },
      { name: "100 unidades", price: 130.00 },
      { name: "200 unidades", price: 195.00 }
    ],
    flavors: [
      "Brigadeiro",
      "Doce de Leite",
      "Ferreiro",
      "Beijinho"
    ]
  },
  {
    id: "prod-7",
    name: "Brownie Recheado",
    category: "doces",
    description: "Brownie artesanal de chocolate, recheado generosamente com um recheio delicioso.",
    image: "assets/img/brownie_recheado.jpg",
    active: true,
    variants: [
      { name: "Valor da Unidade", price: 7.00 }
    ],
    flavors: [
      "Brigadeiro",
      "Ninho com Nutella",
      "Ninho",
      "Ferreiro",
      "Beijinho"
    ]
  },
  {
    id: "prod-8",
    name: "Mini Tortinhas",
    category: "doces",
    description: "Mini tortinhas artesanais, feitas com carinho para adoçar cada momento especial.",
    image: "assets/img/mini_tortinhas.jpg",
    active: true,
    variants: [
      { name: "Valor da Unidade", price: 6.00 }
    ],
    flavors: [
      "Limão",
      "Maracujá",
      "Morango"
    ]
  }
];

// ============================================================================
// 2. SERVIÇO DE PERSISTÊNCIA (LocalStorage)
// ============================================================================
const StorageService = {
  CATALOG_KEY: "atelier_marina_catalog_v1",
  CART_KEY: "atelier_marina_cart_v1",
  ADMIN_PIN: "1234",

  getProducts() {
    try {
      const data = localStorage.getItem(this.CATALOG_KEY);
      if (!data) {
        this.saveProducts(DEFAULT_CATALOG);
        return DEFAULT_CATALOG;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error("Erro ao carregar catálogo do localStorage", e);
      return DEFAULT_CATALOG;
    }
  },

  saveProducts(products) {
    try {
      localStorage.setItem(this.CATALOG_KEY, JSON.stringify(products));
    } catch (e) {
      console.error("Erro ao salvar catálogo no localStorage", e);
    }
  },

  resetCatalog() {
    localStorage.removeItem(this.CATALOG_KEY);
    this.saveProducts(DEFAULT_CATALOG);
    return DEFAULT_CATALOG;
  },

  getCart() {
    try {
      const data = localStorage.getItem(this.CART_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveCart(cart) {
    try {
      localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
    } catch (e) {}
  },

  clearCart() {
    localStorage.removeItem(this.CART_KEY);
  }
};

// ============================================================================
// 3. REGRAS DE NEGÓCIO E DOMÍNIO (Engenharia de Software)
// ============================================================================
const BusinessRules = {
  MIN_LEAD_DAYS: 3,
  SIGNAL_PERCENTAGE: 0.50, // 50% de sinal obrigatório para reserva
  WHATSAPP_PHONE_PRIMARY: "5521997999296",
  WHATSAPP_PHONE_SECONDARY: "5521976240118",

  /**
   * Calcula a data mínima de encomenda respeitando a antecedência mínima de 3 dias
   */
  getMinimumOrderDate() {
    const today = new Date();
    const minDate = new Date();
    minDate.setDate(today.getDate() + this.MIN_LEAD_DAYS);
    return minDate.toISOString().split("T")[0];
  },

  /**
   * Formata data para exibição brasileira (DD/MM/AAAA)
   */
  formatDateBR(isoDateStr) {
    if (!isoDateStr) return "";
    const [year, month, day] = isoDateStr.split("-");
    return `${day}/${month}/${year}`;
  },

  /**
   * Valida se a data selecionada respeita o prazo mínimo de 3 dias
   */
  isValidOrderDate(selectedDateStr) {
    if (!selectedDateStr) return false;
    const minDateStr = this.getMinimumOrderDate();
    return selectedDateStr >= minDateStr;
  },

  /**
   * Calcula o valor do sinal obrigatório (50%)
   */
  calculateDeposit(totalAmount) {
    return totalAmount * this.SIGNAL_PERCENTAGE;
  },

  /**
   * Formata moeda BRL
   */
  formatCurrency(value) {
    return Number(value || 0)
      .toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      })
      .replace(/\u00A0/g, " ");
  },

  /**
   * Gera a mensagem formatada para envio via WhatsApp
   */
  buildWhatsAppMessage(orderData) {
    const { items, customer, delivery, payment, subtotal, deposit, remaining } = orderData;
    
    let msg = `✨ *NOVA ENCOMENDA — ATELIER MARINA* ✨\n\n`;
    msg += `👤 *Cliente:* ${customer.name}\n`;
    msg += `📱 *Telefone:* ${customer.phone}\n`;
    msg += `📅 *Data Desejada:* ${this.formatDateBR(delivery.date)}\n`;
    msg += `⏰ *Horário:* ${delivery.time}\n`;
    msg += `🚚 *Modalidade:* ${delivery.type}\n`;
    if (delivery.type.includes("Uber") && delivery.address) {
      msg += `📍 *Endereço:* ${delivery.address}\n`;
    }
    msg += `\n🛒 *ITENS DA ENCOMENDA:*\n`;

    items.forEach((item, index) => {
      msg += `\n${index + 1}. *${item.productName}* (${item.variantName})\n`;
      msg += `   • Qtd: ${item.quantity}x de ${this.formatCurrency(item.unitPrice)} = *${this.formatCurrency(item.total)}*\n`;
      if (item.flavors && item.flavors.length > 0) {
        msg += `   • Sabores: ${item.flavors.join(", ")}\n`;
      }
      if (item.notes) {
        msg += `   • Obs: _${item.notes}_\n`;
      }
    });

    msg += `\n─────────────────────────\n`;
    msg += `💰 *Subtotal:* ${this.formatCurrency(subtotal)}\n`;
    msg += `⭐ *Sinal para Reserva (50%):* ${this.formatCurrency(deposit)}\n`;
    msg += `💳 *Saldo na Retirada/Entrega:* ${this.formatCurrency(remaining)}\n`;
    msg += `🏷️ *Forma de Pagamento:* ${payment}\n`;
    msg += `─────────────────────────\n`;
    msg += `\n_Olá Atelier Marina! Aguardo a confirmação dos dados e a chave PIX/link para pagamento do sinal de 50%._`;

    return encodeURIComponent(msg);
  }
};

// ============================================================================
// 4. ESTADO DA APLICAÇÃO (Single Source of Truth)
// ============================================================================
const AppState = {
  products: [],
  cart: [],
  currentCategory: "all",
  searchQuery: "",
  selectedProductForModal: null,
  modalSelectedVariant: null,
  modalSelectedFlavors: [],
  modalQuantity: 1,

  init() {
    this.products = StorageService.getProducts();
    this.cart = StorageService.getCart();
  }
};

// ============================================================================
// 5. CONTROLADOR E MANIPULADORES DE EVENTOS
// ============================================================================
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
  AppState.init();

  // Elementos DOM principais
  const gridSalgados = document.getElementById("grid-salgados");
  const gridDoces = document.getElementById("grid-doces");
  const categoryTabs = document.getElementById("categoryTabs");
  const searchInput = document.getElementById("searchInput");
  const btnClearSearch = document.getElementById("btnClearSearch");

  // Floating Cart
  const floatingCartBar = document.getElementById("floatingCartBar");
  const cartCountBadge = document.getElementById("cartCountBadge");
  const cartFloatTotal = document.getElementById("cartFloatTotal");
  const cartFloatSignal = document.getElementById("cartFloatSignal");
  const btnOpenCart = document.getElementById("btnOpenCart");

  // Product Customization Modal
  const productModal = document.getElementById("productModal");
  const btnCloseProductModal = document.getElementById("btnCloseProductModal");
  const modalProductImg = document.getElementById("modalProductImg");
  const modalProductCategory = document.getElementById("modalProductCategory");
  const modalProductTitle = document.getElementById("modalProductTitle");
  const modalProductDesc = document.getElementById("modalProductDesc");
  const modalVariantsList = document.getElementById("modalVariantsList");
  const modalFlavorsList = document.getElementById("modalFlavorsList");
  const flavorsSelectorGroup = document.getElementById("flavorsSelectorGroup");
  const modalProductNotes = document.getElementById("modalProductNotes");
  const modalQtyDisplay = document.getElementById("modalQtyDisplay");
  const btnQtyMinus = document.getElementById("btnQtyMinus");
  const btnQtyPlus = document.getElementById("btnQtyPlus");
  const modalCalculatedTotal = document.getElementById("modalCalculatedTotal");
  const btnConfirmAddToCart = document.getElementById("btnConfirmAddToCart");

  // Cart Drawer
  const cartModal = document.getElementById("cartModal");
  const btnCloseCartModal = document.getElementById("btnCloseCartModal");
  const cartItemsList = document.getElementById("cartItemsList");
  const orderDateInput = document.getElementById("orderDate");
  const orderTimeSelect = document.getElementById("orderTime");
  const customerNameInput = document.getElementById("customerName");
  const customerPhoneInput = document.getElementById("customerPhone");
  const customerAddressInput = document.getElementById("customerAddress");
  const addressGroup = document.getElementById("addressGroup");
  const paymentMethodSelect = document.getElementById("paymentMethod");
  const cartSummarySubtotal = document.getElementById("cartSummarySubtotal");
  const cartSummaryTotal = document.getElementById("cartSummaryTotal");
  const cartSummarySignal = document.getElementById("cartSummarySignal");
  const btnSendWhatsapp = document.getElementById("btnSendWhatsapp");
  const dateValidationFeedback = document.getElementById("dateValidationFeedback");

  // Admin Modal
  const btnOpenAdmin = document.getElementById("btnOpenAdmin");
  const adminModal = document.getElementById("adminModal");
  const btnCloseAdminModal = document.getElementById("btnCloseAdminModal");
  const adminLockScreen = document.getElementById("adminLockScreen");
  const adminContentScreen = document.getElementById("adminContentScreen");
  const adminPinInput = document.getElementById("adminPinInput");
  const btnSubmitPin = document.getElementById("btnSubmitPin");
  const pinErrorMsg = document.getElementById("pinErrorMsg");
  const btnNewProduct = document.getElementById("btnNewProduct");
  const adminProductFormCard = document.getElementById("adminProductFormCard");
  const productEditForm = document.getElementById("productEditForm");
  const btnCancelEdit = document.getElementById("btnCancelEdit");
  const adminProductsTableBody = document.getElementById("adminProductsTableBody");
  const btnResetCatalog = document.getElementById("btnResetCatalog");
  const btnExportJson = document.getElementById("btnExportJson");
  const formVariantsContainer = document.getElementById("formVariantsContainer");
  const btnAddVariantRow = document.getElementById("btnAddVariantRow");

  // Configurar data mínima permitida no checkout (Regra de Domínio de 3 dias)
  const minDateStr = BusinessRules.getMinimumOrderDate();
  orderDateInput.min = minDateStr;
  orderDateInput.value = minDateStr;

  // Modal Helpers para trava de rolagem no mobile
  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.style.display = "none";
    const anyOpen = [productModal, cartModal, adminModal].some(m => m && m.style.display === "flex");
    if (!anyOpen) {
      document.body.style.overflow = "";
    }
  }

  // Render inicial
  renderCatalog();
  updateCartUI();

  // ==========================================================================
  // RENDERIZAÇÃO DO CARDÁPIO
  // ==========================================================================
  function renderCatalog() {
    const q = AppState.searchQuery.toLowerCase().trim();
    const activeCategory = AppState.currentCategory;

    const filtered = AppState.products.filter(p => {
      if (!p.active) return false;
      const matchCategory = activeCategory === "all" || p.category === activeCategory;
      const matchSearch = !q || 
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.flavors && p.flavors.some(f => f.toLowerCase().includes(q)));
      return matchCategory && matchSearch;
    });

    const salgados = filtered.filter(p => p.category === "salgados");
    const doces = filtered.filter(p => p.category === "doces");

    const sectionSalgados = document.getElementById("section-salgados");
    const sectionDoces = document.getElementById("section-doces");

    if (activeCategory === "doces") {
      sectionSalgados.style.display = "none";
      sectionDoces.style.display = "block";
    } else if (activeCategory === "salgados") {
      sectionSalgados.style.display = "block";
      sectionDoces.style.display = "none";
    } else {
      sectionSalgados.style.display = salgados.length ? "block" : "none";
      sectionDoces.style.display = doces.length ? "block" : "none";
    }

    gridSalgados.innerHTML = salgados.map(createProductCardHTML).join("");
    gridDoces.innerHTML = doces.map(createProductCardHTML).join("");

    if (filtered.length === 0) {
      const emptyMsg = `<div class="cart-empty-state" style="grid-column: 1/-1;">
        <i class="fa-solid fa-cookie-bite"></i>
        <p>Nenhum produto encontrado para "<strong>${escapeHtml(AppState.searchQuery)}</strong>".</p>
      </div>`;
      if (activeCategory === "salgados" || activeCategory === "all") gridSalgados.innerHTML = emptyMsg;
      if (activeCategory === "doces") gridDoces.innerHTML = emptyMsg;
    }

    // Vincular cliques nos botões dos cards e no card inteiro
    document.querySelectorAll(".product-card").forEach(card => {
      card.addEventListener("click", (e) => {
        if (!e.target.closest("button")) {
          const prodId = card.getAttribute("data-id");
          openProductModal(prodId);
        }
      });
      card.style.cursor = "pointer";
    });

    document.querySelectorAll(".btn-open-product-modal").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const prodId = btn.getAttribute("data-id");
        openProductModal(prodId);
      });
    });
  }

  function createProductCardHTML(product) {
    const minPrice = Math.min(...product.variants.map(v => v.price));
    const categoryLabel = product.category === "salgados" ? "Salgados Artesanais" : "Doces & Sobremesas";
    
    // Gera os selos de preço no estilo do PDF
    const priceBadges = product.variants.map(v => `
      <div class="price-seal">
        <span class="price-seal-portion">${escapeHtml(v.name)}</span>
        <span class="price-seal-val">${BusinessRules.formatCurrency(v.price)}</span>
      </div>
    `).join("");

    // Sabores disponíveis
    let flavorsHTML = "";
    if (product.flavors && product.flavors.length > 0) {
      flavorsHTML = `
        <div class="flavors-wrap">
          <span class="flavors-label">Sabores Disponíveis:</span>
          <div class="flavors-tags">${product.flavors.map(escapeHtml).join(" • ")}</div>
        </div>
      `;
    }

    return `
      <article class="product-card" data-id="${product.id}">
        <div class="product-card-top-media">
          <img src="${product.image || 'assets/img/empadinhas.jpg'}" alt="${escapeHtml(product.name)}" class="product-img" loading="lazy" onerror="this.src='assets/img/empadinhas.jpg'">
          <span class="card-category-pill">${categoryLabel}</span>
          <span class="card-starting-price">A partir de <strong>${BusinessRules.formatCurrency(minPrice)}</strong></span>
        </div>

        <div class="product-card-body">
          <h3 class="product-card-title">${escapeHtml(product.name)}</h3>
          <p class="product-desc">${escapeHtml(product.description || "")}</p>

          ${flavorsHTML}

          <div class="price-variants-container">
            ${priceBadges}
          </div>

          <button class="btn-card-action btn-open-product-modal" data-id="${product.id}" aria-label="Personalizar ${escapeHtml(product.name)}">
            <i class="fa-solid fa-plus" aria-hidden="true"></i>
            <span>Personalizar & Encomendar</span>
          </button>
        </div>
      </article>
    `;
  }

  // ==========================================================================
  // MODAL DE CUSTOMIZAÇÃO DO PRODUTO
  // ==========================================================================
  function openProductModal(productId) {
    const product = AppState.products.find(p => p.id === productId);
    if (!product) return;

    AppState.selectedProductForModal = product;
    AppState.modalSelectedVariant = product.variants[0];
    AppState.modalSelectedFlavors = [];
    AppState.modalQuantity = 1;

    modalProductImg.src = product.image || "assets/img/empadinhas.jpg";
    modalProductCategory.textContent = product.category === "salgados" ? "Salgados Artesanais" : "Doces & Sobremesas";
    modalProductTitle.textContent = product.name;
    modalProductDesc.textContent = product.description || "";
    modalProductNotes.value = "";
    modalQtyDisplay.textContent = "1";

    // Variações de tamanho/porção
    modalVariantsList.innerHTML = product.variants.map((variant, idx) => `
      <button type="button" class="variant-pill-btn ${idx === 0 ? 'selected' : ''}" data-idx="${idx}">
        <span class="variant-pill-name">${escapeHtml(variant.name)}</span>
        <span class="variant-pill-price">${BusinessRules.formatCurrency(variant.price)}</span>
      </button>
    `).join("");

    modalVariantsList.querySelectorAll(".variant-pill-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        modalVariantsList.querySelectorAll(".variant-pill-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        const idx = parseInt(btn.getAttribute("data-idx"), 10);
        AppState.modalSelectedVariant = product.variants[idx];
        updateModalCalculatedTotal();
      });
    });

    // Sabores disponíveis
    if (product.flavors && product.flavors.length > 0) {
      flavorsSelectorGroup.style.display = "block";
      modalFlavorsList.innerHTML = product.flavors.map(flavor => `
        <label class="flavor-checkbox-item">
          <input type="checkbox" value="${escapeHtml(flavor)}" class="flavor-chk">
          <span>${escapeHtml(flavor)}</span>
        </label>
      `).join("");

      modalFlavorsList.querySelectorAll(".flavor-chk").forEach(chk => {
        chk.addEventListener("change", () => {
          AppState.modalSelectedFlavors = Array.from(
            modalFlavorsList.querySelectorAll(".flavor-chk:checked")
          ).map(c => c.value);
        });
      });
    } else {
      flavorsSelectorGroup.style.display = "none";
      modalFlavorsList.innerHTML = "";
    }

    updateModalCalculatedTotal();
    openModal(productModal);
  }

  function updateModalCalculatedTotal() {
    const unitPrice = AppState.modalSelectedVariant ? AppState.modalSelectedVariant.price : 0;
    const total = unitPrice * AppState.modalQuantity;
    modalCalculatedTotal.textContent = BusinessRules.formatCurrency(total);
  }

  btnQtyMinus.addEventListener("click", () => {
    if (AppState.modalQuantity > 1) {
      AppState.modalQuantity--;
      modalQtyDisplay.textContent = AppState.modalQuantity;
      updateModalCalculatedTotal();
    }
  });

  btnQtyPlus.addEventListener("click", () => {
    AppState.modalQuantity++;
    modalQtyDisplay.textContent = AppState.modalQuantity;
    updateModalCalculatedTotal();
  });

  btnCloseProductModal.addEventListener("click", () => {
    closeModal(productModal);
  });

  // Adicionar ao Carrinho
  btnConfirmAddToCart.addEventListener("click", () => {
    const product = AppState.selectedProductForModal;
    const variant = AppState.modalSelectedVariant;
    if (!product || !variant) return;

    // Se o produto tiver sabores e nenhum foi marcado, avisar ou incluir todos
    let selectedFlavors = [...AppState.modalSelectedFlavors];

    const cartItem = {
      cartItemId: "item-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
      productId: product.id,
      productName: product.name,
      category: product.category,
      variantName: variant.name,
      unitPrice: variant.price,
      quantity: AppState.modalQuantity,
      total: variant.price * AppState.modalQuantity,
      flavors: selectedFlavors,
      notes: modalProductNotes.value.trim(),
      image: product.image
    };

    AppState.cart.push(cartItem);
    StorageService.saveCart(AppState.cart);
    updateCartUI();

    closeModal(productModal);
    showToast(`Adicionado: ${product.name} (${variant.name})`, "success");
  });

  // ==========================================================================
  // CARRINHO & CHECKOUT
  // ==========================================================================
  function updateCartUI() {
    const totalItems = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = AppState.cart.reduce((sum, item) => sum + item.total, 0);
    const deposit = BusinessRules.calculateDeposit(subtotal);

    // Barra flutuante
    if (totalItems > 0) {
      floatingCartBar.style.display = "block";
      cartCountBadge.textContent = totalItems;
      cartFloatTotal.textContent = BusinessRules.formatCurrency(subtotal);
      cartFloatSignal.textContent = BusinessRules.formatCurrency(deposit);
    } else {
      floatingCartBar.style.display = "none";
    }

    // Modal do Carrinho
    renderCartModalItems();
    cartSummarySubtotal.textContent = BusinessRules.formatCurrency(subtotal);
    cartSummaryTotal.textContent = BusinessRules.formatCurrency(subtotal);
    cartSummarySignal.textContent = BusinessRules.formatCurrency(deposit);
  }

  function renderCartModalItems() {
    if (AppState.cart.length === 0) {
      cartItemsList.innerHTML = `
        <div class="cart-empty-state">
          <i class="fa-solid fa-basket-shopping"></i>
          <h4>Sua encomenda está vazia</h4>
          <p>Escolha seus doces e salgados favoritos no cardápio para começar.</p>
        </div>
      `;
      document.getElementById("checkoutForm").style.display = "none";
      btnSendWhatsapp.disabled = true;
      btnSendWhatsapp.style.opacity = "0.5";
      return;
    }

    document.getElementById("checkoutForm").style.display = "block";
    btnSendWhatsapp.disabled = false;
    btnSendWhatsapp.style.opacity = "1";

    cartItemsList.innerHTML = AppState.cart.map(item => `
      <div class="cart-item-row" data-id="${item.cartItemId}">
        <img src="${item.image || 'assets/img/empadinhas.jpg'}" alt="${escapeHtml(item.productName)}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-title">${escapeHtml(item.productName)}</div>
          <div class="cart-item-variant">${escapeHtml(item.variantName)}</div>
          ${item.flavors && item.flavors.length ? `<div class="cart-item-flavors"><strong>Sabores:</strong> ${item.flavors.map(escapeHtml).join(", ")}</div>` : ''}
          ${item.notes ? `<div class="cart-item-flavors"><strong>Obs:</strong> ${escapeHtml(item.notes)}</div>` : ''}
          <div class="cart-item-bottom">
            <div class="cart-item-stepper">
              <button class="cart-step-btn btn-cart-minus" data-id="${item.cartItemId}"><i class="fa-solid fa-minus"></i></button>
              <span class="cart-step-val">${item.quantity}</span>
              <button class="cart-step-btn btn-cart-plus" data-id="${item.cartItemId}"><i class="fa-solid fa-plus"></i></button>
            </div>
            <span class="cart-item-price">${BusinessRules.formatCurrency(item.total)}</span>
            <button class="btn-remove-item btn-cart-delete" data-id="${item.cartItemId}" title="Remover item">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>
    `).join("");

    // Eventos do stepper do carrinho
    cartItemsList.querySelectorAll(".btn-cart-minus").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        changeCartItemQty(id, -1);
      });
    });

    cartItemsList.querySelectorAll(".btn-cart-plus").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        changeCartItemQty(id, 1);
      });
    });

    cartItemsList.querySelectorAll(".btn-cart-delete").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        removeCartItem(id);
      });
    });
  }

  function changeCartItemQty(cartItemId, delta) {
    const item = AppState.cart.find(i => i.cartItemId === cartItemId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      AppState.cart = AppState.cart.filter(i => i.cartItemId !== cartItemId);
    } else {
      item.total = item.quantity * item.unitPrice;
    }
    StorageService.saveCart(AppState.cart);
    updateCartUI();
  }

  function removeCartItem(cartItemId) {
    AppState.cart = AppState.cart.filter(i => i.cartItemId !== cartItemId);
    StorageService.saveCart(AppState.cart);
    updateCartUI();
    showToast("Item removido da encomenda", "warning");
  }

  btnOpenCart.addEventListener("click", () => {
    openModal(cartModal);
  });

  btnCloseCartModal.addEventListener("click", () => {
    closeModal(cartModal);
  });

  // Máscara e formatação amigável de telefone brasileiro
  if (customerPhoneInput) {
    customerPhoneInput.addEventListener("input", (e) => {
      let v = e.target.value.replace(/\D/g, "");
      if (v.length > 11) v = v.substring(0, 11);
      if (v.length > 6) {
        e.target.value = `(${v.substring(0, 2)}) ${v.substring(2, 7)}-${v.substring(7)}`;
      } else if (v.length > 2) {
        e.target.value = `(${v.substring(0, 2)}) ${v.substring(2)}`;
      } else if (v.length > 0) {
        e.target.value = `(${v}`;
      }
    });
  }

  // Toggle do campo de endereço quando Uber for selecionado
  document.querySelectorAll('input[name="deliveryType"]').forEach(radio => {
    radio.addEventListener("change", (e) => {
      if (e.target.value.includes("Uber")) {
        addressGroup.style.display = "block";
        customerAddressInput.required = true;
      } else {
        addressGroup.style.display = "none";
        customerAddressInput.required = false;
      }
    });
  });

  // Validação da Data (Regra de Domínio: mínimo 3 dias)
  orderDateInput.addEventListener("change", () => {
    const selected = orderDateInput.value;
    const minDate = BusinessRules.getMinimumOrderDate();
    if (selected < minDate) {
      dateValidationFeedback.style.color = "var(--color-danger)";
      dateValidationFeedback.textContent = `Atenção: o prazo mínimo do Atelier é de 3 dias (a partir de ${BusinessRules.formatDateBR(minDate)}).`;
    } else {
      dateValidationFeedback.style.color = "var(--color-success)";
      dateValidationFeedback.textContent = "Data dentro do prazo de produção!";
    }
  });

  // Finalização do Pedido e Redirecionamento para WhatsApp
  btnSendWhatsapp.addEventListener("click", () => {
    if (AppState.cart.length === 0) {
      showToast("Seu carrinho está vazio!", "warning");
      return;
    }

    const name = customerNameInput.value.trim();
    const phone = customerPhoneInput.value.trim();
    const selectedDate = orderDateInput.value;
    const minDate = BusinessRules.getMinimumOrderDate();

    if (!name) {
      customerNameInput.focus();
      showToast("Por favor, preencha o seu nome.", "warning");
      return;
    }

    if (!phone) {
      customerPhoneInput.focus();
      showToast("Por favor, informe seu telefone.", "warning");
      return;
    }

    if (!selectedDate || selectedDate < minDate) {
      orderDateInput.focus();
      showToast(`Atenção: A data deve ser a partir de ${BusinessRules.formatDateBR(minDate)} (3 dias de antecedência).`, "error");
      return;
    }

    const deliveryTypeRadio = document.querySelector('input[name="deliveryType"]:checked');
    const deliveryType = deliveryTypeRadio ? deliveryTypeRadio.value : "Retirada no Atelier";
    const address = customerAddressInput.value.trim();

    if (deliveryType.includes("Uber") && !address) {
      customerAddressInput.focus();
      showToast("Informe o endereço para simulação do Uber.", "warning");
      return;
    }

    const subtotal = AppState.cart.reduce((sum, item) => sum + item.total, 0);
    const deposit = BusinessRules.calculateDeposit(subtotal);
    const remaining = subtotal - deposit;

    const orderData = {
      items: AppState.cart,
      customer: { name, phone },
      delivery: {
        type: deliveryType,
        date: selectedDate,
        time: orderTimeSelect.value,
        address: address
      },
      payment: paymentMethodSelect.value,
      subtotal,
      deposit,
      remaining
    };

    const encodedText = BusinessRules.buildWhatsAppMessage(orderData);
    const whatsappUrl = `https://wa.me/${BusinessRules.WHATSAPP_PHONE_PRIMARY}?text=${encodedText}`;

    // Abre o WhatsApp
    window.open(whatsappUrl, "_blank");

    // Limpa o carrinho após fechar o pedido
    AppState.cart = [];
    StorageService.clearCart();
    updateCartUI();
    closeModal(cartModal);
    showToast("Pedido gerado com sucesso! Redirecionando para o WhatsApp...", "success");
  });

  // ==========================================================================
  // FILTROS E BUSCA
  // ==========================================================================
  categoryTabs.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      categoryTabs.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      AppState.currentCategory = btn.getAttribute("data-category");
      renderCatalog();
    });
  });

  searchInput.addEventListener("input", () => {
    AppState.searchQuery = searchInput.value;
    btnClearSearch.style.display = searchInput.value ? "block" : "none";
    renderCatalog();
  });

  btnClearSearch.addEventListener("click", () => {
    searchInput.value = "";
    AppState.searchQuery = "";
    btnClearSearch.style.display = "none";
    renderCatalog();
  });

  // ==========================================================================
  // PAINEL ADMINISTRATIVO (CRUD & Gestão)
  // ==========================================================================
  btnOpenAdmin.addEventListener("click", () => {
    openModal(adminModal);
    adminPinInput.value = "";
    pinErrorMsg.style.display = "none";
  });

  btnCloseAdminModal.addEventListener("click", () => {
    closeModal(adminModal);
    adminProductFormCard.style.display = "none";
  });

  btnSubmitPin.addEventListener("click", checkAdminPin);
  adminPinInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") checkAdminPin();
  });

  function checkAdminPin() {
    const entered = adminPinInput.value.trim();
    if (entered === StorageService.ADMIN_PIN) {
      adminLockScreen.style.display = "none";
      adminContentScreen.style.display = "block";
      renderAdminTable();
    } else {
      pinErrorMsg.style.display = "block";
      adminPinInput.value = "";
      adminPinInput.focus();
    }
  }

  function renderAdminTable() {
    adminProductsTableBody.innerHTML = AppState.products.map(p => {
      const variantsText = p.variants.map(v => `${v.name}: ${BusinessRules.formatCurrency(v.price)}`).join("<br>");
      return `
        <tr>
          <td>
            <img src="${p.image || 'assets/img/empadinhas.jpg'}" alt="${escapeHtml(p.name)}" class="admin-table-img">
          </td>
          <td><strong>${escapeHtml(p.name)}</strong></td>
          <td>${p.category === 'salgados' ? 'Salgados' : 'Doces'}</td>
          <td style="font-size: 0.8rem;">${variantsText}</td>
          <td>
            <span class="status-badge ${p.active ? 'active' : 'inactive'}">
              ${p.active ? 'Ativo' : 'Pausado'}
            </span>
          </td>
          <td>
            <div class="table-actions">
              <button class="btn-action-icon btn-admin-edit" data-id="${p.id}" title="Editar produto">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="btn-action-icon btn-admin-toggle" data-id="${p.id}" title="${p.active ? 'Pausar no cardápio' : 'Ativar no cardápio'}">
                <i class="fa-solid ${p.active ? 'fa-eye-slash' : 'fa-eye'}"></i>
              </button>
              <button class="btn-action-icon delete btn-admin-delete" data-id="${p.id}" title="Excluir produto">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");

    // Ações na tabela
    adminProductsTableBody.querySelectorAll(".btn-admin-edit").forEach(btn => {
      btn.addEventListener("click", () => openEditProductForm(btn.getAttribute("data-id")));
    });

    adminProductsTableBody.querySelectorAll(".btn-admin-toggle").forEach(btn => {
      btn.addEventListener("click", () => toggleProductActive(btn.getAttribute("data-id")));
    });

    adminProductsTableBody.querySelectorAll(".btn-admin-delete").forEach(btn => {
      btn.addEventListener("click", () => deleteProduct(btn.getAttribute("data-id")));
    });
  }

  // Novo Produto
  btnNewProduct.addEventListener("click", () => {
    document.getElementById("adminFormTitle").textContent = "Adicionar Novo Produto";
    document.getElementById("editProductId").value = "";
    document.getElementById("prodFormName").value = "";
    document.getElementById("prodFormCategory").value = "salgados";
    document.getElementById("prodFormDesc").value = "";
    document.getElementById("prodFormImage").value = "assets/img/empadinhas.jpg";
    document.getElementById("prodFormFlavors").value = "";

    // Começa com uma linha de variação
    formVariantsContainer.innerHTML = "";
    addVariantRowToForm("Unidade", 10.00);

    adminProductFormCard.style.display = "block";
    adminProductFormCard.scrollIntoView({ behavior: "smooth" });
  });

  btnCancelEdit.addEventListener("click", () => {
    adminProductFormCard.style.display = "none";
  });

  btnAddVariantRow.addEventListener("click", () => {
    addVariantRowToForm("", "");
  });

  function addVariantRowToForm(name = "", price = "") {
    const row = document.createElement("div");
    row.className = "variant-row";
    row.innerHTML = `
      <input type="text" class="form-control var-name" placeholder="Nome da Opção (ex: 100un, 1Kg)" value="${escapeHtml(name)}" required>
      <input type="number" step="0.5" class="form-control var-price" placeholder="Preço (R$)" value="${price}" style="max-width: 130px;" required>
      <button type="button" class="btn-remove-row" title="Remover"><i class="fa-solid fa-trash"></i></button>
    `;
    row.querySelector(".btn-remove-row").addEventListener("click", () => {
      if (formVariantsContainer.children.length > 1) {
        row.remove();
      } else {
        showToast("O produto deve ter ao menos uma variação de preço.", "warning");
      }
    });
    formVariantsContainer.appendChild(row);
  }

  function openEditProductForm(productId) {
    const p = AppState.products.find(item => item.id === productId);
    if (!p) return;

    document.getElementById("adminFormTitle").textContent = `Editar: ${p.name}`;
    document.getElementById("editProductId").value = p.id;
    document.getElementById("prodFormName").value = p.name;
    document.getElementById("prodFormCategory").value = p.category;
    document.getElementById("prodFormDesc").value = p.description || "";
    document.getElementById("prodFormImage").value = p.image || "";
    document.getElementById("prodFormFlavors").value = (p.flavors || []).join(", ");

    formVariantsContainer.innerHTML = "";
    p.variants.forEach(v => addVariantRowToForm(v.name, v.price));

    adminProductFormCard.style.display = "block";
    adminProductFormCard.scrollIntoView({ behavior: "smooth" });
  }

  // Salvar Produto (Novo ou Editado)
  productEditForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = document.getElementById("editProductId").value;
    const name = document.getElementById("prodFormName").value.trim();
    const category = document.getElementById("prodFormCategory").value;
    const desc = document.getElementById("prodFormDesc").value.trim();
    const image = document.getElementById("prodFormImage").value.trim() || "assets/img/empadinhas.jpg";
    const flavorsRaw = document.getElementById("prodFormFlavors").value;
    const flavors = flavorsRaw.split(",").map(s => s.trim()).filter(Boolean);

    // Coleta as variações
    const variantRows = formVariantsContainer.querySelectorAll(".variant-row");
    const variants = [];
    variantRows.forEach(row => {
      const vName = row.querySelector(".var-name").value.trim();
      const vPrice = parseFloat(row.querySelector(".var-price").value);
      if (vName && !isNaN(vPrice)) {
        variants.push({ name: vName, price: vPrice });
      }
    });

    if (variants.length === 0) {
      showToast("Cadastre pelo menos uma variação com nome e preço válido.", "warning");
      return;
    }

    if (id) {
      // Edição
      const index = AppState.products.findIndex(p => p.id === id);
      if (index !== -1) {
        AppState.products[index] = {
          ...AppState.products[index],
          name,
          category,
          description: desc,
          image,
          flavors,
          variants
        };
        showToast("Produto atualizado com sucesso!", "success");
      }
    } else {
      // Criação
      const newProduct = {
        id: "prod-" + Date.now(),
        name,
        category,
        description: desc,
        image,
        active: true,
        flavors,
        variants
      };
      AppState.products.push(newProduct);
      showToast("Novo produto cadastrado com sucesso!", "success");
    }

    StorageService.saveProducts(AppState.products);
    adminProductFormCard.style.display = "none";
    renderAdminTable();
    renderCatalog();
  });

  function toggleProductActive(productId) {
    const product = AppState.products.find(p => p.id === productId);
    if (!product) return;
    product.active = !product.active;
    StorageService.saveProducts(AppState.products);
    renderAdminTable();
    renderCatalog();
    showToast(`Produto "${product.name}" agora está ${product.active ? 'ativo' : 'pausado'}.`, "warning");
  }

  function deleteProduct(productId) {
    const product = AppState.products.find(p => p.id === productId);
    if (!product) return;
    if (confirm(`Tem certeza que deseja remover "${product.name}" do cardápio?`)) {
      AppState.products = AppState.products.filter(p => p.id !== productId);
      StorageService.saveProducts(AppState.products);
      renderAdminTable();
      renderCatalog();
      showToast("Produto removido com sucesso.", "warning");
    }
  }

  // Restaurar Catálogo Original
  btnResetCatalog.addEventListener("click", () => {
    if (confirm("Deseja restaurar o cardápio padrão com todos os produtos do Atelier Marina? Quaisquer alterações locais serão substituídas.")) {
      AppState.products = StorageService.resetCatalog();
      renderAdminTable();
      renderCatalog();
      showToast("Cardápio original do Atelier restaurado com sucesso!", "success");
    }
  });

  // Exportar Catálogo em JSON
  btnExportJson.addEventListener("click", () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(AppState.products, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "cardapio_atelier_marina.json");
    dlAnchor.click();
    showToast("Catálogo exportado em arquivo JSON!", "success");
  });

  // Fechar modais ao clicar no fundo escuro
  window.addEventListener("click", (e) => {
    if (e.target === productModal) closeModal(productModal);
    if (e.target === cartModal) closeModal(cartModal);
    if (e.target === adminModal) closeModal(adminModal);
  });
});
}

// ============================================================================
// 6. UTILITÁRIOS (Toast & XSS Escape)
// ============================================================================
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  let icon = "fa-circle-info";
  if (type === "success") icon = "fa-circle-check";
  if (type === "warning") icon = "fa-triangle-exclamation";
  if (type === "error") icon = "fa-circle-xmark";

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideInRight 0.3s ease reverse";
    setTimeout(() => toast.remove(), 280);
  }, 3500);
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Exportações globais para testes e integração
if (typeof window !== "undefined") {
  window.Atelier = { BusinessRules, StorageService, AppState, DEFAULT_CATALOG };
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { BusinessRules, StorageService, AppState, DEFAULT_CATALOG };
}
