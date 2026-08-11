async function atualizarMercadoPixels() {
  try {
    const response = await fetch('https://api.pixels.xyz/v1/market/items', {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      const lista = Array.isArray(data) ? data : (data.items || data.data || []);

      lista.forEach(item => {
        const id = String(item.itemId || item.id || '').toLowerCase();
        const preco = item.price || item.sellPrice || item.lowestPrice;

        if (preco && preco > 0) {
          if (id.includes('grumpkin')) cotacoesAtivas["itm_blueGrumpkinSeed"].price = preco;
          if (id.includes('bronze')) cotacoesAtivas["itm_bronzeniteOre"].price = preco;
          if (id.includes('mead')) cotacoesAtivas["itm_muckchuckMead"].price = preco;
        }
      });
    }
  } catch (err) {
    console.log("Erro:", err.message);
  }
}
