const express = require("express");
const path = require("path");
const db = require("./database");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/api/feedbacks", async (req, res) => {
  const { nome, comentario, estrelas } = req.body;

  if (!nome || !comentario || !estrelas) {
    return res.status(400).json({ erro: "Preencha todos os campos!" });
  }

  try {
    const { data, error } = await db
      .from("feedbacks")
      .insert([{ nome, comentario, estrelas }])
      .select();

    if (error) {
      return res.status(500).json({ erro: error.message });
    }

    res.json({ mensagem: "Feedback salvo com sucesso!", feedback: data[0] });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get("/api/feedbacks", async (req, res) => {
  try {
    const { data, error } = await db
      .from("feedbacks")
      .select("*")
      .order("id", { ascending: false })
      .limit(10);

    if (error) {
      return res.status(500).json({ erro: error.message });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso em http://localhost:${PORT}`);
});

// Atualizado com sucesso
