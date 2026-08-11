const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));

let cotacoesAtivas = {
  "itm_blueGrumpkinSeed": { name: "Blue Grumpkin Seed", price: 384 },
  "itm_bronzeniteOre": { name: "Bronzenite Ore", price: 114 },
  "itm_muckchuckMead": { name: "Muckchuck Mead", price: 2730 }
};

async function atualizarMercadoPixels() {
  try {
    const response = await fetch('https://pixels-server.pixels.xyz/game/market/items', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      const lista = Array.isArray(data) ? data : (data.items || data.data || []);

      lista.forEach(item => {
        const id = String(item.itemId || item.id || item.name || '').toLowerCase();
        const preco = item.price || item.sellPrice || item.lowestPrice || item.cost;

        if (preco && preco > 0) {
          if (id.includes('grumpkin') || id.includes('blue')) {
            cotacoesAtivas["itm_blueGrumpkinSeed"].price = preco;
          } else if (id.includes('bronze')) {
            cotacoesAtivas["itm_bronzeniteOre"].price = preco;
          } else if (id.includes('mead') || id.includes('muckchuck')) {
            cotacoesAtivas["itm_muckchuckMead"].price = preco;
          }
        }
      });
    }
  } catch (err) {
    console.log("Aguardando dados do Pixels...", err.message);
  }
}

// Atualiza a cada 3 segundos
setInterval(atualizarMercadoPixels, 3000);
atualizarMercadoPixels();

app.get('/prices', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const agora = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

  res.json({
    status: "online",
    updatedAt: agora,
    items: cotacoesAtivas
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor ativado na porta ${PORT}`));
