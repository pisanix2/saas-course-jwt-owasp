const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('./rbac');

/**
 * ==================================================================================
 * ROTAS PROTEGIDAS POR RBAC
 * ==================================================================================
 */

// Rota Pública (Sem proteção)
router.get('/public', (req, res) => {
    res.json({ message: "Esta rota é pública. Qualquer um pode ver." });
});

// Rota Protegida (Qualquer usuário autenticado)
router.get('/profile', authenticateToken, (req, res) => {
    res.json({
        message: `Olá, ${req.user.username}. Este é seu perfil.`,
        yourData: req.user
    });
});

// Rota de Administrador (Apenas role 'admin')
router.get('/admin-only', authenticateToken, authorizeRole(['admin']), (req, res) => {
    res.json({
        message: "Bem-vindo à área administrativa!",
        secret: "A senha do cofre é 123456"
    });
});

module.exports = router;
