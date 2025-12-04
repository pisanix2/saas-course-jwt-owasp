const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet'); // Ajuda a proteger apps Express configurando vários cabeçalhos HTTP
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middlewares Globais
app.use(helmet()); // Segurança básica de headers
app.use(cors()); // Habilita CORS
app.use(bodyParser.json()); // Parse de JSON no body
app.use(bodyParser.urlencoded({ extended: true }));

// Rota raiz
app.get('/', (req, res) => {
    res.json({
        message: "API de Demonstração: Autenticação, Autorização e OWASP Top 10",
        docs: "Leia os comentários no código para entender cada vulnerabilidade e correção."
    });
});

// Importação dos Módulos
const authRoutes = require('./modules/1-authentication/routes');
app.use('/auth', authRoutes);

const authzRoutes = require('./modules/2-authorization/routes');
app.use('/authz', authzRoutes);

const owaspRoutes = require('./modules/3-owasp-top10/routes');
app.use('/owasp', owaspRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Explore os módulos na pasta src/modules`);
});
