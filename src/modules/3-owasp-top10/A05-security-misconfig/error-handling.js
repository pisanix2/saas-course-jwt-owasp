const express = require('express');
const router = express.Router();
const fs = require('fs');

/**
 * ==================================================================================
 * OWASP A05: SECURITY MISCONFIGURATION
 * ==================================================================================
 * 
 * Exemplo focado em tratamento de erros inadequado que expõe stack traces ou detalhes internos.
 */

// ==================================================================================
// 1. ROTA COM ERRO DETALHADO (VULNERÁVEL)
// ==================================================================================
router.get('/error-insecure', (req, res) => {
    try {
        // Simula um erro de leitura de arquivo inexistente
        const data = fs.readFileSync('arquivo_inexistente.txt');
        res.send(data);
    } catch (error) {
        // PERIGO: Retornar o objeto de erro completo ou stack trace para o cliente
        res.status(500).send(`
            <h1>Erro Interno do Servidor</h1>
            <pre>${error.stack}</pre>
        `);
    }
});

// ==================================================================================
// 2. ROTA COM ERRO GENÉRICO (SEGURO)
// ==================================================================================
router.get('/error-secure', (req, res) => {
    try {
        const data = fs.readFileSync('arquivo_inexistente.txt');
        res.send(data);
    } catch (error) {
        // SEGURO: Logar o erro no servidor e retornar mensagem genérica para o usuário
        console.error("Erro detalhado para logs:", error.message); // Em produção, use um logger real (Winston/Pino)

        res.status(500).json({
            error: "Ocorreu um erro interno. Por favor, contate o suporte.",
            requestId: Date.now() // Útil para correlação de logs
        });
    }
});

module.exports = router;
