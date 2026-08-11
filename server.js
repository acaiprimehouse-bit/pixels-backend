const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));

// Tabela de itens monitorados
let cotacoesAtivas = {
  "itm_blueGrumpkinSeed": { name: "Blue Grumpkin Seed", price: 380 },
  "itm_bronzeniteOre": { name: "Bronzenite Ore", price: 114 },
  "itm_muckchuckMead": { name: "Muckchuck Mead", price: 2730 }
};

// Rota para o seu site consultar os preços
app.get('/prices', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const agora = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

  res.json({
    status: "online",
    updatedAt: agora,
    items: cotacoesAtivas
  });
});

// NOVA ROTA: Permite atualizar o preço instantaneamente via link ou requisição
// Exemplo de uso no navegador: https://seu-backend.onrender.com/update?item=grumpkin&price=385
app.get('/update', (req, res) => {
  const { item, price } = req.query;
  const novoPreco = Number(price);

  if (!item || !novoPreco) {
    return res.status(400).json({ erro: "Use o formato: /update?item=grumpkin&price=385" });
  }

  const chave = item.toLowerCase();
  if (chave.includes('grumpkin')) {
    cotacoesAtivas["itm_blueGrumpkinSeed"].price = novoPreco;
  } else if (chave.includes('bronze')) {
    cotacoesAtivas["itm_bronzeniteOre"].price = novoPreco;
  } else if (chave.includes('mead') || chave.includes('muckchuck')) {
    cotacoesAtivas["itm_muckchuckMead"].price = novoPreco;
  }

  res.json({ sucesso: true, itensAtualizados: cotacoesAtivas });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor ativado na porta ${PORT}`));
