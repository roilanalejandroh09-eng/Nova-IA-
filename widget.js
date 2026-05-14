(function() {
  // Cria apenas o botão/logo da IA
  const botao = document.createElement('button');
  botao.className = 'chatbot-btn';
  botao.style.position = 'fixed';
  botao.style.bottom = '20px';
  botao.style.right = '20px';
  botao.style.width = '60px';
  botao.style.height = '60px';
  botao.style.borderRadius = '50%';
  botao.style.backgroundColor = '#001F7A'; // cor do botão/logo
  botao.style.border = '3px solid #FFD700'; // borda amarela
  botao.style.cursor = 'default'; // sem ação
  botao.style.zIndex = '9999';
  botao.style.boxShadow = 'none'; // sem sombra
  botao.innerHTML = '<span style="color:white;font-size:24px;font-weight:bold;">A</span>'; // logo

  // Remove qualquer interatividade
  botao.onclick = null;

  document.body.appendChild(botao);
})();

