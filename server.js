const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));

let cotacoesAtivas = {
  "itm_blueGrumpkinSeed": { name: "Blue Grumpkin Seed", price: 382 },
  "itm_bronzeniteOre": { name: "Bronzenite Ore", price: 114 },
  "itm_muckchuckMead": { name: "Muckchuck Mead", price: 2730 }
};

async function atualizarMercadoPixels() {
  try {
    const response = await fetch('https://api.pixelore.wiki/api/market-data', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://pixelore.wiki/lookup/profit',
        'Origin': 'https://pixelore.wiki',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data && typeof data === 'object') {
          if (data.grumpkin) cotacoesAtivas["itm_blueGrumpkinSeed"].price = data.grumpkin;
          if (data.bronze) cotacoesAtivas["itm_bronzeniteOre"].price = data.bronze;
          if (data.mead) cotacoesAtivas["itm_muckchuckMead"].price = data.mead;
      }
    }
  } catch (err) {
    console.log("Aguardando atualização...");
  }
}

setInterval(atualizarMercadoPixels, 10000);
atualizarMercadoPixels();

app.get('/prices', (req, res) => {
  res.json({
    updatedAt: new Date().toLocaleTimeString("pt-BR"),
    items: cotacoesAtivas
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT);
