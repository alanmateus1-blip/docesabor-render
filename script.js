// 1. CONFIGURAÇÃO DO MODO ESCURO (DARK MODE)
const darkModeToggleMobile = document.getElementById("darkModeToggle");
const darkModeToggleDesktop = document.getElementById("darkModeToggleDesktop");

function toggleDarkMode() {
  document.documentElement.classList.toggle("dark");

  // Opcional: Guardar a preferência do utilizador no navegador
  if (document.documentElement.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}

// Ouvir os cliques nos botões de modo escuro (tanto no telemóvel como no computador)
if (darkModeToggleMobile)
  darkModeToggleMobile.addEventListener("click", toggleDarkMode);
if (darkModeToggleDesktop)
  darkModeToggleDesktop.addEventListener("click", toggleDarkMode);

// Verificar se o utilizador já tinha escolhido o modo escuro antes
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
    // Remover a classe 'active' de todos os botões e adicionar ao botão clicado
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const filterValue = button.getAttribute("data-filter");

    // Mostrar ou esconder os produtos com base na categoria
    productCards.forEach((card) => {
      const cardCategory = card.getAttribute("data-category");

      if (filterValue === "all" || cardCategory === filterValue) {
        card.style.display = "flex"; // Mostra o produto
      } else {
        card.style.display = "none"; // Esconde o produto
      }
    });
  });
});

// 3. CARRINHO DE COMPRAS INTEGRADO AO WHATSAPP
let carrinho = [];

const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

addToCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.getAttribute("data-name");
    const price = parseFloat(button.getAttribute("data-price"));

    // Adicionar o produto ao carrinho
    carrinho.push({ name, price });

    // Efeito visual simples no botão para mostrar que foi adicionado
    const originalText = button.innerText;
    button.innerText = "✓";
    button.style.backgroundColor = "#33A19C";
    button.style.color = "#FFFFFF";

    setTimeout(() => {
      button.innerText = originalText;
      button.style.backgroundColor = "";
      button.style.color = "";
    }, 1000);

    // Atualizar o link do WhatsApp com os produtos atuais
    atualizarLinkWhatsApp();
  });
});

function atualizarLinkWhatsApp() {
  const numeroTelefone = "5567992086035"; // O seu número configurado
  let mensagem =
    "Olá Dai! Gostaria de fazer um pedido das seguintes bolachinhas:\n\n";

  if (carrinho.length === 0) {
    mensagem =
      "Olá Dai! Gostaria de saber mais sobre as bolachinhas artesanais.";
  } else {
    // Agrupar produtos repetidos para ficar mais organizado
    const totalProdutos = {};
    let precoTotal = 0;

    carrinho.forEach((item) => {
      totalProdutos[item.name] = (totalProdutos[item.name] || 0) + 1;
      precoTotal += item.price;
    });

    // Montar o texto da lista
    for (const produto in totalProdutos) {
      mensagem += `• ${totalProdutos[produto]}x ${produto}\n`;
    }

    mensagem += `\n*Total estimado:* R$ ${precoTotal.toFixed(2).replace(".", ",")}`;
  }

  // Codificar o texto para formato de URL
  const mensagemFormatada = encodeURIComponent(mensagem);

  // Procurar todos os botões ou links que enviam para o WhatsApp e atualizar o link deles
  const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
  whatsappLinks.forEach((link) => {
    link.href = `https://wa.me/${numeroTelefone}?text=${mensagemFormatada}`;
  });
}

// Iniciar o link com a mensagem padrão caso o cliente não selecione nada
atualizarLinkWhatsApp();
