const express = require('express');
const router = express.Router();
const { RateLimiterMemory } = require('rate-limiter-flexible');

/**
 * ==================================================================================
 * OWASP A07: IDENTIFICATION AND AUTHENTICATION FAILURES
 * ==================================================================================
 * 
 * Falta de proteção contra ataques de força bruta (Brute Force).
 */

// Configuração do Rate Limiter (Memória)
// Permite 5 tentativas a cada 1 minuto por IP
const rateLimiter = new RateLimiterMemory({
    points: 5,
    duration: 60,
});

// Middleware de Rate Limit
const rateLimiterMiddleware = (req, res, next) => {
    rateLimiter.consume(req.ip)
        .then(() => {
            next();
        })
        .catch(() => {
            res.status(429).json({ error: "Muitas tentativas de login. Tente novamente em 1 minuto." });
        });
};

// ==================================================================================
// 1. LOGIN SEM PROTEÇÃO (VULNERÁVEL A BRUTE FORCE)
// ==================================================================================
router.post('/login-no-rate-limit', (req, res) => {
    const { password } = req.body;
    // Simulação simples
    if (password === 'senha123') {
        res.json({ message: "Login Sucesso!" });
    } else {
        res.status(401).json({ error: "Senha incorreta" });
    }
});

// ==================================================================================
// 2. LOGIN COM RATE LIMIT (SEGURO)
// ==================================================================================
router.post('/login-rate-limit', rateLimiterMiddleware, (req, res) => {
    const { password } = req.body;
    if (password === 'senha123') {
        res.json({ message: "Login Sucesso!" });
    } else {
        res.status(401).json({ error: "Senha incorreta" });
    }
});

module.exports = router;
