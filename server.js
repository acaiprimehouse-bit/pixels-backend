const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

let cotacoesAtivas = {
  "itm_blueGrumpkinSeed": { name: "Blue Grumpkin Seed", price: 384 },
  "itm_bronzeniteOre": { name: "Bronzenite Ore", price: 114 },
  "itm_muckchuckMead": { name: "Muckchuck Mead", price: 2730 }
};

async function atualizarMercadoPixels() {
  try {
    const response = await fetch('https://pixels-server.pixels.xyz/game/market/items', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        data.forEach(item => {
          if (cotacoesAtivas[item.itemId || item.id]) {
            cotacoesAtivas[item.itemId || item.id].price = item.price || item.sellPrice || item.cost;
          }
        });
      }
    }
  } catch (err) {}
}

setInterval(atualizarMercadoPixels, 15000);
atualizarMercadoPixels();

app.get('/prices', (req, res) => {
  res.json({
    status: "online",
    updatedAt: new Date().toISOString(),
    items: cotacoesAtivas
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor ativado na porta ${PORT}`));
