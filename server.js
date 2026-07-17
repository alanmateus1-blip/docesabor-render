const express = require("express");
const path = require("path");
const db = require("./database"); // Importa o arquivo de banco que você acabou de criar

const app = express();
const PORT = 3000;

app.use(express.json());

// Serve os arquivos do seu site (HTML, CSS, JS) de forma estática
app.use(express.static(__dirname));

// Rota para a página inicial (se necessário)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 1. ROTA PARA SALVAR O FEEDBACK (POST)
app.post("/api/feedbacks", (req, res) => {
  const { nome, comentario, estrelas } = req.body;

  if (!nome || !comentario || !estrelas) {
    return res.status(400).json({ erro: "Preencha todos os campos!" });
  }

  const query = `INSERT INTO feedbacks (nome, comentario, estrelas) VALUES (?, ?, ?)`;

  db.run(query, [nome, comentario, estrelas], function (err) {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.json({ mensagem: "Feedback salvo com sucesso!", id: this.lastID });
  });
});

// 2. ROTA PARA BUSCAR OS FEEDBACKS (GET)
app.get("/api/feedbacks", (req, res) => {
  const query = `SELECT * FROM feedbacks ORDER BY criado_em DESC`;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.json(rows); // Envia os feedbacks em formato de lista (JSON) para o site ler
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso em http://localhost:${PORT}`);
});
