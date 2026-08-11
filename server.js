const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));

let cotacoesAtivas = {
  "itm_blueGrumpkinSeed": { name: "Blue Grumpkin Seed", price: 383 },
  "itm_bronzeniteOre": { name: "Bronzenite Ore", price: 114 },
  "itm_muckchuckMead": { name: "Muckchuck Mead", price: 2730 }
};

async function atualizarMercadoPixels() {
  try {
    const response = await fetch('https://pixels-server.pixels.xyz/game/market/items', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, *',
        'Referer': 'https://play.pixels.xyz/'
      }
    });

    if (response.ok) {
      const data = await response.json();
      const lista = Array.isArray(data) ? data : (data.items || data.data || []);

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
  } catch (err) {
    console.log("Aguardando sincronização do Pixels...");
  }
}

// Atualiza os preços em segundo plano a cada 3 segundos
setInterval(atualizarMercadoPixels, 3000);
atualizarMercadoPixels();

// Rota padrão do servidor para fornecer os dados atualizados
app.get('/prices', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const agora = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

  res.json({
    status: "online",
    updatedAt: agora,
    items: cotacoesAtivas
  });
});

// Se alguém abrir o site principal (raiz), entregamos a página web com atualização automática embutida
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Pixels Live Market Hub</title>
        <style>
            body { background-color: #0b0f19; color: #fff; font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
            .container { background: #131b2e; padding: 30px; border-radius: 12px; width: 450px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
            h2 { color: #a855f7; margin-bottom: 5px; }
            .timer { font-size: 12px; background: #065f46; color: #34d399; padding: 4px 8px; border-radius: 6px; float: right; }
            table { width: 100%; margin-top: 20px; border-collapse: collapse; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #1e293b; }
            th { color: #94a3b8; font-size: 14px; }
            .preco { color: #fbbf24; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <span class="timer" id="hora-atualizacao">Carregando...</span>
            <h2>Pixels Live Market Hub</h2>
            <table>
                <tr><th>Item</th><th>Preço de Mercado</th></tr>
                <tr><td>Blue Grumpkin Seed</td><td class="preco" id="preco-grumpkin">Carregando...</td></tr>
                <tr><td>Bronzenite Ore</td><td class="preco" id="preco-bronze">Carregando...</td></tr>
                <tr><td>Muckchuck Mead</td><td class="preco" id="preco-mead">Carregando...</td></tr>
            </table>
        </div>

        <script>
            async function buscarPrecos() {
                try {
                    const res = await fetch('/prices');
                    const dados = await res.json();
                    
                    document.getElementById('preco-grumpkin').innerText = dados.items.itm_blueGrumpkinSeed.price + " Coins";
                    document.getElementById('preco-bronze').innerText = dados.items.itm_bronzeniteOre.price + " Coins";
                    document.getElementById('preco-mead').innerText = dados.items.itm_muckchuckMead.price + " Coins";
                    document.getElementById('hora-atualizacao').innerText = "Atualizado às " + dados.updatedAt;
                } catch (e) {
                    console.log("Erro ao buscar preços");
                }
            }

            // Atualiza sozinho na tela a cada 3 segundos sem precisar de F5!
            setInterval(buscarPrecos, 3000);
            buscarPrecos();
        </script>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
