const express = require('express');
const router = express.Router();
const db = require('../../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * ==================================================================================
 * MÓDULO 1.2: JSON WEB TOKENS (JWT)
 * ==================================================================================
 * 
 * JWT é um padrão para transmitir informações de forma segura entre partes como um objeto JSON.
 * É comumente usado para Autenticação Stateless (sem sessão no servidor).
 */

const JWT_SECRET = 'minha_chave_secreta_super_segura_123'; // Em produção, use variáveis de ambiente (.env)

// ==================================================================================
// 1. LOGIN COM GERAÇÃO DE JWT
// ==================================================================================
/**
 * @route POST /auth/jwt/login
 * @description Autentica o usuário e retorna um token JWT assinado.
 */
router.post('/jwt/login', (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }

        // Lógica de verificação de senha (suporta hash ou plain text para a demo)
        let passwordValid = false;
        if (user.password.startsWith('$2')) {
            passwordValid = await bcrypt.compare(password, user.password);
        } else {
            passwordValid = (user.password === password);
        }

        if (!passwordValid) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }

        // GERAÇÃO DO TOKEN
        // Payload: Dados que queremos dentro do token (evite dados sensíveis como senhas!)
        const payload = {
            id: user.id,
            username: user.username,
            role: user.role
        };

        // Assinatura: Payload + Segredo + Opções (Expiração)
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: "Autenticado com sucesso!",
            token: token
        });
    });
});

module.exports = { router, JWT_SECRET };
