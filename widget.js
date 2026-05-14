(function() {
  // Cria um container isolado
  const container = document.createElement('div');
  container.id = 'meu-botao-widget';
  document.body.appendChild(container);

  // Cria o botão
  const botao = document.createElement('button') 
  botao.style.padding = '10px 20px';
  botao.style.color = '#fff';
  botao.style.border = 'none';
  botao.style.borderRadius = '5px';
  botao.style.cursor = 'pointer';

  // Ação do botão
  botao.onclick = function() {
    alert('Botão do widget acionado!');
  };

  container.appendChild(botao);
})();
