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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json',
        'Referer': 'https://pixelore.wiki/'
      }
    });

    if (response.ok) {
      const data = await response.json();
      // Varre a resposta para achar os itens na estrutura da API do Pixelore
      const lista = Array.isArray(data) ? data : (data.items || data.data || data.market || []);

      if (Array.isArray(lista)) {
        lista.forEach(item => {
          const itemId = String(item.itemId || item.id || item.name || '').toLowerCase();
          const valorAtual = item.price || item.sellPrice || item.lowestPrice || item.cost;

          if (valorAtual && valorAtual > 0) {
            if (itemId.includes('grumpkin') || itemId.includes('blue')) {
              cotacoesAtivas["itm_blueGrumpkinSeed"].price = valorAtual;
            } else if (itemId.includes('bronze')) {
              cotacoesAtivas["itm_bronzeniteOre"].price = valorAtual;
            } else if (itemId.includes('mead') || itemId.includes('muckchuck')) {
              cotacoesAtivas["itm_muckchuckMead"].price = valorAtual;
            }
          }
        });
      }
    }
  } catch (err) {
    console.log("Erro ao buscar dados:", err.message);
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
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
