const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../1-authentication/jwt');

/**
 * ==================================================================================
 * MÓDULO 2: AUTORIZAÇÃO (RBAC - Role Based Access Control)
 * ==================================================================================
 */

// Middleware para verificar se o token é válido
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Formato esperado: "Bearer <TOKEN>"
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Acesso negado. Token não fornecido." });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Token inválido ou expirado." });
        }
        // Anexa os dados do usuário (payload do token) ao objeto da requisição
        req.user = user;
        next();
    });
};

// Middleware para verificar permissão baseada em Cargo (Role)
const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        // req.user foi populado pelo authenticateToken
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: "Acesso proibido. Você não tem permissão para acessar este recurso."
            });
        }
        next();
    };
};

module.exports = { authenticateToken, authorizeRole };
