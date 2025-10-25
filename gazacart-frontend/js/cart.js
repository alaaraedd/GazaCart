// 🛒 إضافة منتج للسلة
function addToCart(productId, productName, productStore, productPrice, productImage) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ 
      id: productId, 
      name: productName, 
      store: productStore, 
      price: Number(productPrice), 
      image: productImage, 
      quantity: 1 
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCartItems();
  showAddedMessage(productName);
}

// ✨ رسالة نجاح بعد الإضافة للسلة
function showAddedMessage(productName) {
  const msg = document.createElement("div");
  msg.innerHTML = `تمت الإضافة إلى السلة 🛒 <button id="viewCartBtn">عرض السلة</button>`;
  
  Object.assign(msg.style, {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#FFD43B",
    color: "#000",
    padding: "12px 24px",
    borderRadius: "10px",
    zIndex: "9999",
    display: "flex",
    gap: "10px",
    alignItems: "center",
    fontFamily: "Cairo, sans-serif",
    fontSize: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.25)"
  });

  document.body.appendChild(msg);

  const btn = msg.querySelector("#viewCartBtn");
  Object.assign(btn.style, {
    background: "#fff",
    color: "#FFD43B",
    border: "2px solid #FFD43B",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "0.3s"
  });

  btn.addEventListener("mouseenter", () => btn.style.background = "#FFF5CC");
  btn.addEventListener("mouseleave", () => btn.style.background = "#fff");

  const timer = setTimeout(() => msg.remove(), 3000);

  btn.addEventListener("click", () => {
    clearTimeout(timer);
    openCart();
  });
}

// 🧮 تحديث رقم السلة في الأعلى
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCount = document.querySelector(".cart span");
  if (cartCount) cartCount.textContent = count > 0 ? count : "";
}

// 🛍️ عرض المنتجات داخل الكارت
function renderCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItems = document.querySelector(".cart-items");
  if (!cartItems) return; 
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="item-info">
        <h4>${item.name}</h4>
        <p>${item.store}</p>
        <p><strong>السعر :</strong> ${item.price} شيكل</p>
        <p><strong>الكمية :</strong> ${item.quantity}</p>
      </div>
      <button class="delete-btn" onclick="removeFromCart('${item.id}')">
        <img src="images/Frame 7624.png" alt="حذف">
      </button>
    `;
    cartItems.appendChild(div);
  });

  // التوصيل
  const deliveryCost = 10;
  const deliveryEl = document.querySelector(".cart-summary .summary-row span:last-child");
  if (deliveryEl) deliveryEl.textContent = deliveryCost + " شيكل";

  // الاجمالي شامل التوصيل
  const totalEl = document.querySelector(".cart-summary .total span");
  if (totalEl) totalEl.textContent = (total + deliveryCost) + " شيكل";
}

// ❌ إزالة منتج من السلة
function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCartItems();
}

// فتح صفحة الدفع
function openPayment() {
  const cartModal = document.getElementById("cartModal");
  const paymentModal = document.getElementById("paymentModal");
  if (cartModal) cartModal.style.display = "none";
  if (paymentModal) paymentModal.style.display = "flex";
}

// فتح الكارت
function openCart() {
  const cartModal = document.getElementById("cartModal");
  if (cartModal) cartModal.style.display = "flex";
}

// ✅ تحميل السلة عند فتح الصفحة
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCartItems();

  // ربط زر الإضافة لكل المنتجات
  document.querySelectorAll(".add-product, .btn-add-product").forEach(btn => {
    btn.addEventListener("click", e => {
      const productEl = e.target.closest(".product, .card");
      if (!productEl) return;

      const id = productEl.dataset.id || Math.random().toString(36).substr(2, 9);
      const name = productEl.dataset.name || productEl.querySelector("h4")?.textContent || "منتج";
      const store = productEl.dataset.store || "متجر غير محدد";
      const priceText = productEl.dataset.price || productEl.querySelector(".price, .product-price")?.textContent || "0";
      const price = parseFloat(priceText.replace(/[^\d.]/g, "")) || 0;
      const image = productEl.dataset.image || productEl.querySelector("img")?.src || "";

      addToCart(id, name, store, price, image);
    });
  });
});
