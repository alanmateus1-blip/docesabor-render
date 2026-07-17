const sqlite3 = require("sqlite3").verbose();

// Cria o arquivo do banco de dados (banco.db) se ele não existir
const db = new sqlite3.Database("./banco.db", (err) => {
  if (err) {
    console.error("Erro ao conectar no SQLite:", err.message);
  } else {
    console.log("Conectado ao banco SQLite com sucesso!");

    // Cria a tabela onde os feedbacks serão salvos no site
    db.run(`CREATE TABLE IF NOT EXISTS feedbacks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            comentario TEXT NOT NULL,
            estrelas INTEGER NOT NULL,
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
  }
});

module.exports = db;
