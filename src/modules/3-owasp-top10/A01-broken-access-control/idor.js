const express = require('express');
const router = express.Router();
const db = require('../../../db');
const { authenticateToken } = require('../../2-authorization/rbac');

/**
 * ==================================================================================
 * OWASP A01: BROKEN ACCESS CONTROL (IDOR - Insecure Direct Object References)
 * ==================================================================================
 * 
 * IDOR ocorre quando uma aplicação fornece acesso direto a objetos baseados na entrada do usuário.
 * Exemplo: Alterar o ID na URL para acessar dados de outro usuário.
 */

// ==================================================================================
// 1. ROTA VULNERÁVEL A IDOR
// ==================================================================================
/**
 * @route GET /owasp/a01/user-insecure/:id
 * @description Retorna dados de um usuário baseado APENAS no ID da URL.
 * @vulnerability Qualquer usuário logado pode ver dados de QUALQUER outro usuário trocando o ID.
 */
router.get('/user-insecure/:id', authenticateToken, (req, res) => {
    const userId = req.params.id;

    // PERIGO: Não verifica se o ID solicitado pertence ao usuário logado (req.user.id)
    db.get("SELECT id, username, sensitive_data FROM users WHERE id = ?", [userId], (err, row) => {
        if (err || !row) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        res.json(row);
    });
});

// ==================================================================================
// 2. ROTA SEGURA (Correção)
// ==================================================================================
/**
 * @route GET /owasp/a01/user-secure/:id
 * @description Retorna dados apenas se o ID solicitado for o mesmo do usuário logado (ou se for admin).
 */
router.get('/user-secure/:id', authenticateToken, (req, res) => {
    const userId = parseInt(req.params.id);
    const loggedUser = req.user;

    // VERIFICAÇÃO DE ACESSO
    if (loggedUser.role !== 'admin' && loggedUser.id !== userId) {
        return res.status(403).json({ error: "Acesso negado. Você não pode ver dados de outro usuário." });
    }

    db.get("SELECT id, username, sensitive_data FROM users WHERE id = ?", [userId], (err, row) => {
        if (err || !row) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        res.json(row);
    });
});

module.exports = router;
