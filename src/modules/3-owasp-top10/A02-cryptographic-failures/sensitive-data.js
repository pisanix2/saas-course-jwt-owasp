const express = require('express');
const router = express.Router();
const crypto = require('crypto');

/**
 * ==================================================================================
 * OWASP A02: CRYPTOGRAPHIC FAILURES
 * ==================================================================================
 * 
 * Falhas relacionadas à proteção de dados sensíveis (em trânsito ou repouso).
 * Exemplo: Armazenar dados sensíveis (como CPF, Cartão de Crédito) sem criptografia.
 */

// Simulação de banco de dados simples
const mockDB = [];

// Chave de criptografia (DEVE estar em variáveis de ambiente em produção)
const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = crypto.scryptSync('senha_super_secreta', 'salt', 32);
const IV = crypto.randomBytes(16);

// ==================================================================================
// 1. ARMAZENAMENTO INSEGURO
// ==================================================================================
router.post('/store-insecure', (req, res) => {
    const { creditCard } = req.body;

    // VULNERABILIDADE: Salvando dado sensível em texto plano
    mockDB.push({ type: 'insecure', data: creditCard });

    res.json({ message: "Cartão salvo (INSEGURO)", stored: creditCard });
});

// ==================================================================================
// 2. ARMAZENAMENTO SEGURO (Criptografia Simétrica)
// ==================================================================================
router.post('/store-secure', (req, res) => {
    const { creditCard } = req.body;

    // Criptografando
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, IV);
    let encrypted = cipher.update(creditCard, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const storedData = {
        iv: IV.toString('hex'),
        content: encrypted
    };

    mockDB.push({ type: 'secure', data: storedData });

    res.json({ message: "Cartão salvo com criptografia", stored: storedData });
});

module.exports = router;
