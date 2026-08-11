const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Permite que o servidor leia arquivos estáticos (como o index.html)
app.use(express.static(path.join(__dirname)));

// Rota principal que abre o seu index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Exemplo de rota de preços (ajuste conforme o seu código atual)
app.get('/prices', (req, res) => {
    res.json({
        items: {
            "itm_blueGrumpkinSeed": { price: 384 },
            "itm_bronzeniteOre": { price: 114 },
            "itm_muckchuckMead": { price: 2730 }
        }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
