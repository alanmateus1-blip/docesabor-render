// 1. CONFIGURAÇÃO DO MODO ESCURO (DARK MODE)
const darkModeToggleMobile = document.getElementById("darkModeToggle");
const darkModeToggleDesktop = document.getElementById("darkModeToggleDesktop");

function toggleDarkMode() {
  document.documentElement.classList.toggle("dark");

  // Guardar a preferência do utilizador no navegador
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
  let message =
    "Olá Dai! Gostaria de fazer um pedido das seguintes bolachinhas:\n\n";

  if (carrinho.length === 0) {
    message =
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
      message += `• ${totalProdutos[produto]}x ${produto}\n`;
    }

    message += `\n*Total estimado:* R$ ${precoTotal.toFixed(2).replace(".", ",")}`;
  }

  // Codificar o texto para formato de URL
  const mensagemFormatada = encodeURIComponent(message);

  // Procurar todos os botões ou links que enviam para o WhatsApp e atualizar o link deles
  const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
  whatsappLinks.forEach((link) => {
    link.href = `https://wa.me/${numeroTelefone}?text=${mensagemFormatada}`;
  });
}

// Iniciar o link com a mensagem padrão caso o cliente não selecione nada
atualizarLinkWhatsApp();

// 4. ENVIO DE FEEDBACK INTEGRADO AO BANCO E WHATSAPP (CORRIGIDO)
async function enviarFeedback(event) {
  event.preventDefault(); // Impede a página de recarregar

  // Captura os dados digitados no formulário do HTML
  const nome = document.getElementById("nome").value;
  const sabor = document.getElementById("sabor").value || "Não informado";
  const estrelasTexto = document.getElementById("nota").value;
  const mensagem = document.getElementById("mensagem").value;

  // Converter as estrelas em formato de texto (⭐⭐⭐) para número para salvar no SQLite
  const estrelasMap = {
    "⭐⭐⭐⭐⭐": 5,
    "⭐⭐⭐⭐": 4,
    "⭐⭐⭐": 3,
  };
  const estrelasNumero = estrelasMap[estrelasTexto] || 5;

  // Se o cliente informou o sabor, juntamos na mensagem
  const comentarioCompleto =
    sabor !== "Não informado" ? `[Sabor: ${sabor}] - ${mensagem}` : mensagem;

  const dadosParaBanco = {
    nome: nome,
    comentario: comentarioCompleto,
    estrelas: estrelasNumero,
  };

  try {
    // Envia os dados para salvar no seu banco SQLite (server.js)
    const resposta = await fetch("/api/feedbacks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosParaBanco),
    });

    if (resposta.ok) {
      // MONTAGEM DO TEXTO EM ARRAY PARA EVITAR QUEBRAS DE LINHA FÍSICAS QUE ESTRAGAM A URL[cite: 6]
      const linhasTexto = [
        `*Novo depoimento enviado pelo site!* 😍`,
        ``,
        `👤 *Nome:* ${nome}`,
        `🍰 *Sabor comprado:* ${sabor}`,
        `⭐ *Avaliação:* ${estrelasTexto}`,
        ``,
        `💬 *Comentário:* "${mensagem}"`,
      ];

      const textoWhats = linhasTexto.join("\n");
      const numeroDai = "5567992086035"; // número real dela[cite: 6]

      // Codifica perfeitamente todos os caracteres, acentos e emojis[cite: 5, 6]
      const textoCodificado = encodeURIComponent(textoWhats);

      // Usando api.whatsapp.com que é universal e aceita bem parâmetros codificados[cite: 6]
      const urlWhats = `https://api.whatsapp.com/send?phone=${numeroDai}&text=${textoCodificado}`;

      // Abre o WhatsApp limpo e formatado[cite: 6]
      window.open(urlWhats, "_blank");

      alert("Feedback registrado com sucesso e enviado para o WhatsApp!");

      // Limpa o formulário do HTML[cite: 6]
      document.getElementById("feedbackForm").reset();

      // Atualiza a lista de feedbacks na tela[cite: 6]
      if (typeof carregarFeedbacksDoSite === "function") {
        carregarFeedbacksDoSite();
      }
    } else {
      alert("Erro ao salvar o feedback no banco de dados do site.");
    }
  } catch (erro) {
    console.error("Erro ao enviar feedback:", erro);
    alert("Não foi possível conectar ao servidor para salvar seu feedback.");
  }
}

// 5. CARREGAR FEEDBACKS NA TELA
async function carregarFeedbacksDoSite() {
  const container = document.getElementById("lista-feedbacks"); // Busca o lugar no HTML[cite: 6]
  if (!container) return; // Se não estiver na página de feedback, não faz nada (evita erros)[cite: 6]

  try {
    const resposta = await fetch("/api/feedbacks");
    const feedbacks = await resposta.json();

    container.innerHTML = ""; // Limpa os depoimentos antigos antes de carregar os novos[cite: 6]

    if (feedbacks.length === 0) {
      container.innerHTML =
        "<p class='text-center text-gray-500 dark:text-gray-400'>Ainda não há feedbacks cadastrados. Seja o primeiro!</p>";
      return;
    }

    // Renderiza cada feedback que veio do banco de dados na tela[cite: 6]
    feedbacks.forEach((f) => {
      const estrelasDesign = "⭐".repeat(f.stars || f.estrelas); // Garante compatibilidade[cite: 6]
      container.innerHTML += `
                <div class="p-4 rounded-2xl border border-delicate-pink/20 bg-white dark:bg-neutral-800 shadow-sm mb-4">
                    <div class="flex justify-between items-center mb-2">
                        <strong class="text-dark-text dark:text-white">${f.nome}</strong>
                        <span class="text-yellow-500">${estrelasDesign}</span>
                    </div>
                    <p class="text-gray-600 dark:text-gray-300 text-sm">"${f.comentario}"</p>
                </div>
            `;
    });
  } catch (erro) {
    console.error("Erro ao carregar feedbacks:", erro);
  }
}

// Executa automaticamente assim que a página carregar[cite: 6]
document.addEventListener("DOMContentLoaded", carregarFeedbacksDoSite);
