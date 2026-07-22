// 1. CONFIGURAÇÃO DO MODO ESCURO (DARK MODE)
const darkModeToggleMobile = document.getElementById("darkModeToggle");
const darkModeToggleDesktop = document.getElementById("darkModeToggleDesktop");

function toggleDarkMode() {
  document.documentElement.classList.toggle("dark");

  if (document.documentElement.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}

if (darkModeToggleMobile)
  darkModeToggleMobile.addEventListener("click", toggleDarkMode);
if (darkModeToggleDesktop)
  darkModeToggleDesktop.addEventListener("click", toggleDarkMode);

if (
  localStorage.getItem("theme") === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

// 2. SISTEMA DE FILTRO DO CARDÁPIO
const filterButtons = document.querySelectorAll(".btn-filter");
const productCards = document.querySelectorAll(".product-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const filterValue = button.getAttribute("data-filter");

    productCards.forEach((card) => {
      const cardCategory = card.getAttribute("data-category");

      if (filterValue === "all" || cardCategory === filterValue) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// 3. CARRINHO DE COMPRAS INTEGRADO AO WHATSAPP
let carrinho = [];

const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

addToCartButtons.forEach((button) => {
  button.buttonClickListener = true;
  button.addEventListener("click", () => {
    const name = button.getAttribute("data-name");
    const price = parseFloat(button.getAttribute("data-price"));

    carrinho.push({ name, price });

    const originalText = button.innerText;
    button.innerText = "✓";
    button.style.backgroundColor = "#33A19C";
    button.style.color = "#FFFFFF";

    setTimeout(() => {
      button.innerText = originalText;
      button.style.backgroundColor = "";
      button.style.color = "";
    }, 1000);

    atualizarLinkWhatsApp();
  });
});

function atualizarLinkWhatsApp() {
  const numeroTelefone = "5567992086035"; // Seu número configurado
  let message =
    "Olá Dai! Gostaria de fazer um pedido das seguintes bolachinhas:\n\n";

  if (carrinho.length === 0) {
    message =
      "Olá Dai! Gostaria de saber mais sobre as bolachinhas artesanais.";
  } else {
    const totalProdutos = {};
    let precoTotal = 0;

    carrinho.forEach((item) => {
      totalProdutos[item.name] = (totalProdutos[item.name] || 0) + 1;
      precoTotal += item.price;
    });

    for (const produto in totalProdutos) {
      message += `• ${totalProdutos[produto]}x ${produto}\n`;
    }

    message += `\n*Total estimado:* R$ ${precoTotal.toFixed(2).replace(".", ",")}`;
  }

  const mensagemFormatada = encodeURIComponent(message);
  const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
  whatsappLinks.forEach((link) => {
    link.href = `https://wa.me/${numeroTelefone}?text=${mensagemFormatada}`;
  });
}

// Inicia o link com a mensagem padrão
atualizarLinkWhatsApp();