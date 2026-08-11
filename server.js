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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      const itens = Array.isArray(data) ? data : (data.items || data.data || []);

      itens.forEach(item => {
        const itemId = String(item.itemId || item.id || item.name || '').toLowerCase();
        
        if (itemId.includes('grumpkin')) {
          cotacoesAtivas["itm_blueGrumpkinSeed"].price = item.price || item.sellPrice || item.lowestPrice || cotacoesAtivas["itm_blueGrumpkinSeed"].price;
        } else if (itemId.includes('bronze')) {
          cotacoesAtivas["itm_bronzeniteOre"].price = item.price || item.sellPrice || item.lowestPrice || cotacoesAtivas["itm_bronzeniteOre"].price;
        } else if (itemId.includes('mead')) {
          cotacoesAtivas["itm_muckchuckMead"].price = item.price || item.sellPrice || item.lowestPrice || cotacoesAtivas["itm_muckchuckMead"].price;
        }
      });
    }
  } catch (err) {
    console.log("Aguardando atualizacao...", err.message);
  }
}

setInterval(atualizarMercadoPixels, 10000);
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
