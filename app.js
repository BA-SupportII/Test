const menuItems = [
  { id: 1, name: "Iced Latte", type: "Drink", price: 3.8, tag: "info" },
  { id: 2, name: "Mango Smoothie", type: "Drink", price: 4.2, tag: "success" },
  { id: 3, name: "Cold Brew", type: "Drink", price: 3.6, tag: "info" },
  { id: 4, name: "Chicken Wrap", type: "Food", price: 5.9, tag: "warning" },
  { id: 5, name: "Caesar Salad", type: "Food", price: 6.4, tag: "success" },
  { id: 6, name: "Steak Sandwich", type: "Food", price: 7.8, tag: "danger" }
];

const deliveryFlatFee = 2.5;
const cart = new Map();

const menuGrid = document.getElementById("menuGrid");
const cartItems = document.getElementById("cartItems");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");
const cartCountEl = document.getElementById("cartCount");
const todaySalesEl = document.getElementById("todaySales");
const totalOrdersEl = document.getElementById("totalOrders");
const checkoutForm = document.getElementById("checkoutForm");
const orderMessage = document.getElementById("orderMessage");

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

function renderMenu() {
  menuGrid.innerHTML = "";
  menuItems.forEach((item) => {
    const card = document.createElement("article");
    card.className = "menu-item";
    card.innerHTML = `
      <div class="menu-row">
        <span class="badge ${item.tag}">${item.type}</span>
        <strong>${formatCurrency(item.price)}</strong>
      </div>
      <h4>${item.name}</h4>
      <p>Freshly prepared and optimized for fast delivery.</p>
      <button class="btn btn-secondary" data-add="${item.id}" type="button">Add to cart</button>
    `;
    menuGrid.appendChild(card);
  });
}

function updateCartUI() {
  cartItems.innerHTML = "";

  if (cart.size === 0) {
    cartItems.innerHTML = '<li class="cart-line"><span>Your cart is empty.</span><span>—</span></li>';
  } else {
    cart.forEach((entry) => {
      const line = document.createElement("li");
      line.className = "cart-line";
      line.innerHTML = `
        <span>${entry.name} × ${entry.qty}</span>
        <strong>${formatCurrency(entry.qty * entry.price)}</strong>
      `;
      cartItems.appendChild(line);
    });
  }

  const subtotal = [...cart.values()].reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalItems = [...cart.values()].reduce((acc, item) => acc + item.qty, 0);
  const total = subtotal + deliveryFlatFee;

  subtotalEl.textContent = formatCurrency(subtotal);
  totalEl.textContent = formatCurrency(total);
  cartCountEl.textContent = `${totalItems} Item${totalItems === 1 ? "" : "s"}`;
  todaySalesEl.textContent = subtotal > 0 ? (subtotal * 7.5).toFixed(2) : "0.00";
  totalOrdersEl.textContent = totalItems > 0 ? Math.max(3, Math.round(totalItems * 1.5)) : 0;
}

function addToCart(itemId) {
  const item = menuItems.find((entry) => entry.id === itemId);
  if (!item) return;

  const existing = cart.get(item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.set(item.id, { ...item, qty: 1 });
  }
  updateCartUI();
}

menuGrid.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const id = Number(target.dataset.add);
  if (!id) return;
  addToCart(id);
});

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (cart.size === 0) {
    orderMessage.textContent = "Please add at least one item before placing your order.";
    orderMessage.style.color = "var(--danger)";
    return;
  }

  const formData = new FormData(checkoutForm);
  const name = String(formData.get("name") || "Customer");
  const total = totalEl.textContent;

  orderMessage.textContent = `${name}, your order is confirmed. Please transfer ${total} to ABA 500393771.`;
  orderMessage.style.color = "var(--success)";
  cart.clear();
  checkoutForm.reset();
  updateCartUI();
});

renderMenu();
updateCartUI();
