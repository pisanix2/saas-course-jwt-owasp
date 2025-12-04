const express = require('express');
const router = express.Router();
const db = require('../../../db');

/**
 * ==================================================================================
 * OWASP A03: INJECTION (SQL Injection)
 * ==================================================================================
 * 
 * Ocorre quando dados não confiáveis são enviados para um interpretador como parte de um comando ou consulta.
 */

// ==================================================================================
// 1. BUSCA VULNERÁVEL (Concatenação de String)
// ==================================================================================
/**
 * @route GET /owasp/a03/search-insecure
 * @description Busca usuários por nome.
 * @vulnerability SQL Injection. Tente enviar: ' OR '1'='1
 */
router.get('/search-insecure', (req, res) => {
    const query = req.query.q;

    // PERIGO: Concatenação direta da entrada do usuário na query SQL
    const sql = "SELECT * FROM users WHERE username = '" + query + "'";

    console.log("Executando SQL Inseguro:", sql);

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// ==================================================================================
// 2. BUSCA SEGURA (Parameterized Queries)
// ==================================================================================
/**
 * @route GET /owasp/a03/search-secure
 * @description Busca usuários usando Prepared Statements.
 */
router.get('/search-secure', (req, res) => {
    const query = req.query.q;

    // SEGURO: O uso de '?' indica um parâmetro que será tratado pelo driver do banco
    const sql = "SELECT * FROM users WHERE username = ?";

    db.all(sql, [query], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

module.exports = router;
