const revealItems = document.querySelectorAll(".reveal");
const cartKey = "iphone-store-core-cart";
let cart = JSON.parse(localStorage.getItem(cartKey) || "[]");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.16 });

    revealItems.forEach((item) => observer.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add("visible"));
}

document.querySelectorAll(".favorite").forEach((button) => {
    button.addEventListener("click", () => {
        button.classList.toggle("active");
    });
});

const filterButtons = document.querySelectorAll("[data-filter]");
const catalogCards = document.querySelectorAll("[data-category]");

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        filterButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");

        catalogCards.forEach((card) => {
            const show = filter === "todos" || card.dataset.category === filter;
            card.style.display = show ? "flex" : "none";
        });
    });
});

const cartPanel = document.querySelector(".cart-panel");
const cartItems = document.querySelector(".cart-items");
const cartEmpty = document.querySelector(".cart-empty");
const cartCount = document.querySelector(".cart-count");
const cartToggle = document.querySelector(".cart-toggle");
const cartClose = document.querySelector(".cart-close");
const catRunner = document.querySelector(".cat-runner");
const catCargo = document.querySelector(".cat-cargo");

function saveCart() {
    localStorage.setItem(cartKey, JSON.stringify(cart));
}

function renderCart() {
    if (!cartItems || !cartCount) return;

    cartItems.innerHTML = "";
    cartCount.textContent = cart.length;
    cartEmpty.style.display = cart.length ? "none" : "block";

    cart.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "cart-item";
        row.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div>
                <strong>${item.name}</strong>
                <span>${item.price}</span>
            </div>
            <button class="cart-remove" type="button" aria-label="Quitar ${item.name}" data-index="${index}">x</button>
        `;
        cartItems.appendChild(row);
    });
}

function bumpCart() {
    if (!cartToggle) return;
    cartToggle.classList.add("bump");
    window.setTimeout(() => cartToggle.classList.remove("bump"), 420);
}

function moveCatToCart(button, product) {
    if (!catRunner || !catCargo || !cartToggle) return;

    const start = button.getBoundingClientRect();
    const end = cartToggle.getBoundingClientRect();
    const startX = start.left + start.width / 2 - 58;
    const startY = start.top - 68;
    const endX = end.left + end.width / 2 - 70;
    const endY = end.top - 28;

    catCargo.src = product.image;
    catRunner.classList.remove("running");
    catRunner.style.transition = "none";
    catRunner.style.opacity = "";
    catRunner.style.transform = `translate(${startX}px, ${startY}px)`;

    requestAnimationFrame(() => {
        catRunner.classList.add("running");
        catRunner.style.transition = "";
        catRunner.style.transform = `translate(${endX}px, ${endY}px)`;
    });

    window.setTimeout(() => {
        catRunner.classList.remove("running");
        catRunner.style.opacity = "0";
        bumpCart();
        if (cartPanel) cartPanel.classList.add("open");
    }, 2380);
}

document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
        const product = {
            name: button.dataset.name,
            price: button.dataset.price,
            image: button.dataset.image
        };

        cart.push(product);
        saveCart();
        renderCart();
        moveCatToCart(button, product);
    });
});

if (cartToggle && cartPanel) {
    cartToggle.addEventListener("click", () => cartPanel.classList.toggle("open"));
}

if (cartClose && cartPanel) {
    cartClose.addEventListener("click", () => cartPanel.classList.remove("open"));
}

if (cartItems) {
    cartItems.addEventListener("click", (event) => {
        const removeButton = event.target.closest(".cart-remove");
        if (!removeButton) return;

        cart.splice(Number(removeButton.dataset.index), 1);
        saveCart();
        renderCart();
        bumpCart();
    });
}

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const note = contactForm.querySelector(".form-note");
        note.textContent = "Solicitud lista. Te contactaremos para confirmar disponibilidad.";
        contactForm.reset();
    });
}

renderCart();
