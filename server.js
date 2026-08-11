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
    // API pública do mercado do Pixels com fallback
    const res = await fetch('https://pixels-server.pixels.xyz/game/market/items', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json'
      }
    });

    if (res.ok) {
      const data = await res.json();
      const itens = Array.isArray(data) ? data : (data.items || data.data || []);

      itens.forEach(item => {
        const itemId = item.itemId || item.id || item.name;
        
        // Mapeamento de IDs do mercado
        if (itemId) {
          const strId = String(itemId).toLowerCase();
          
          if (strId.includes('grumpkin')) {
            cotacoesAtivas["itm_blueGrumpkinSeed"].price = item.price || item.sellPrice || item.lowestPrice || cotacoesAtivas["itm_blueGrumpkinSeed"].price;
          } else if (strId.includes('bronze')) {
            cotacoesAtivas["itm_bronzeniteOre"].price = item.price || item.sellPrice || item.lowestPrice || cotacoesAtivas["itm_bronzeniteOre"].price;
          } else if (strId.includes('mead')) {
            cotacoesAtivas["itm_muckchuckMead"].price = item.price || item.sellPrice || item.lowestPrice || cotacoesAtivas["itm_muckchuckMead"].price;
          }
        }
      });
    }
  } catch (err) {
    console.log("Erro na busca:", err.message);
  }
}

setInterval(atualizarMercadoPixels, 10000);
atualizarMercadoPixels();

app.get('/prices', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.json({
    status: "online",
    updatedAt: new Date().toISOString(),
    items: cotacoesAtivas
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
