const express = require('express');
const router = express.Router();
const db = require('../../db');
const bcrypt = require('bcryptjs');

/**
 * ==================================================================================
 * MÓDULO 1: AUTENTICAÇÃO BÁSICA (SENHAS)
 * ==================================================================================
 * 
 * Este arquivo demonstra a diferença crucial entre armazenar senhas em texto plano
 * (VULNERÁVEL) e armazenar hashes de senha (SEGURO).
 */

// ==================================================================================
// 1. REGISTRO VULNERÁVEL (Plain Text)
// ==================================================================================
/**
 * @route POST /auth/basic/register-insecure
 * @description Registra um usuário salvando a senha como texto plano.
 * @vulnerability A02:2021 - Cryptographic Failures (Armazenamento inseguro de senhas)
 */
router.post('/basic/register-insecure', (req, res) => {
    const { username, password } = req.body;

    // PERIGO: Salvando a senha exatamente como veio do usuário
    const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    stmt.run(username, password, function (err) {
        if (err) {
            return res.status(400).json({ error: "Erro ao registrar usuário (pode já existir)" });
        }
        res.json({ message: "Usuário registrado (INSEGURO)", id: this.lastID });
    });
    stmt.finalize();
});

// ==================================================================================
// 2. REGISTRO SEGURO (Hashing com Bcrypt)
// ==================================================================================
/**
 * @route POST /auth/basic/register-secure
 * @description Registra um usuário salvando o HASH da senha.
 * @security Usa bcrypt para hashing com salt automático.
 */
router.post('/basic/register-secure', async (req, res) => {
    const { username, password } = req.body;

    try {
        // SEGURO: Gerando um salt e hash da senha
        // O número 10 representa o "custo" do processamento (work factor)
        const hashedPassword = await bcrypt.hash(password, 10);

        const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        stmt.run(username, hashedPassword, function (err) {
            if (err) {
                return res.status(400).json({ error: "Erro ao registrar usuário" });
            }
            res.json({ message: "Usuário registrado com segurança (HASH)", id: this.lastID });
        });
        stmt.finalize();
    } catch (error) {
        res.status(500).json({ error: "Erro interno no servidor" });
    }
});

// ==================================================================================
// 3. LOGIN (Verificação)
// ==================================================================================
/**
 * @route POST /auth/basic/login
 * @description Tenta fazer login verificando hash ou texto plano (para fins didáticos).
 */
router.post('/basic/login', (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }

        // Verifica se a senha no banco é um hash bcrypt (começa com $2a$ ou $2b$)
        if (user.password.startsWith('$2')) {
            // Comparação Segura
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                return res.json({ message: "Login realizado com sucesso (Via Hash Bcrypt)!" });
            }
        } else {
            // Comparação Insegura (Texto Plano) - APENAS PARA DEMONSTRAÇÃO
            if (user.password === password) {
                return res.json({ message: "Login realizado com sucesso (Via Texto Plano - PERIGO)!" });
            }
        }

        res.status(401).json({ error: "Credenciais inválidas" });
    });
});

module.exports = router;
