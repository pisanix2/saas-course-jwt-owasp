const express = require('express');
const router = express.Router();

/**
 * ==================================================================================
 * OWASP A09: SECURITY LOGGING AND MONITORING FAILURES
 * ==================================================================================
 * 
 * Falha em registrar eventos críticos de segurança (login, falhas de acesso, erros).
 */

// ==================================================================================
// 1. AÇÃO CRÍTICA SEM LOG (VULNERÁVEL)
// ==================================================================================
router.post('/delete-item-no-log', (req, res) => {
    // Ação crítica realizada
    // ... lógica de deletar ...

    // Ninguém saberá quem deletou, quando ou de onde.
    res.json({ message: "Item deletado (Sem rastro)" });
});

// ==================================================================================
// 2. AÇÃO CRÍTICA COM LOG DE AUDITORIA (SEGURO)
// ==================================================================================
router.post('/delete-item-logged', (req, res) => {
    const user = req.body.user || "anônimo"; // Em app real, viria do token JWT
    const ip = req.ip;
    const timestamp = new Date().toISOString();

    // REGISTRO DE AUDITORIA
    // Deve incluir: QUEM, O QUE, QUANDO, ONDE e STATUS
    console.log(`[AUDIT] [DELETE] User: ${user} | IP: ${ip} | Time: ${timestamp} | Resource: Item 123 | Status: SUCCESS`);

    res.json({ message: "Item deletado (Evento registrado)" });
});

module.exports = router;
