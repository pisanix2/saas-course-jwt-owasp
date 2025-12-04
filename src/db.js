const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Criação do banco de dados em memória para facilitar a demonstração
// Em produção, use um arquivo persistente ou um banco de dados robusto (PostgreSQL, MySQL)
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(':memory:'); // Usando memória para resetar a cada restart

db.serialize(() => {
    // Criação da tabela de usuários
    db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'user',
        sensitive_data TEXT
    )`);

    // Seed inicial (Dados de exemplo)
    const stmt = db.prepare("INSERT INTO users (username, password, role, sensitive_data) VALUES (?, ?, ?, ?)");

    // Usuário Admin (Senha: admin123)
    // Nota: Em um cenário real, NUNCA insira senhas em texto plano assim se for usar bcrypt depois.
    // Aqui estamos inserindo para demonstrar o cenário "Vulnerável" primeiro.
    stmt.run("admin", "admin123", "admin", "Dados super secretos do admin");

    // Usuário Comum (Senha: user123)
    stmt.run("user", "user123", "user", "Dados pessoais do usuário");

    stmt.finalize();

    console.log("Banco de dados SQLite inicializado e populado.");
});

module.exports = db;
