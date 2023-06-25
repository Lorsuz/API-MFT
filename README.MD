# Paths
# mecanicas
- este projeto usa o padrao de arquitetura MVC
- ec6
cd .\public\
sass -w sass/:styleSheets/
nodemailer


home
perfil(contribuiçoes e favoritos)
criar perfil
editar perfil
registro das noticias verificadas
editar noticia
noticias n verificadas
desenvolvedores creditos e direitos(apoie-nos em algum lugar)
apoie-nos(chave aleatoria, email, telefone, qrcode ao lado)
suporte

documentaçao



estou em um projeto express, em uma pagina ejs tem uma lista de usuarios carregados de um banco sqlite, como faço com que sempre que eu apertar em um deles apareça um pop-up com as informaçoes de que eu apertei


$('#like-button').on('click', function() {
  $.ajax({
    url: '/like', // Rota no servidor para lidar com a ação de curtir
    method: 'POST',
    success: function(response) {
      // Ação de sucesso, como atualizar a interface do usuário
      console.log('Curtido com sucesso!');
    },
    error: function(error) {
      // Tratar erros, se houver
      console.error('Erro ao curtir:', error);
    }
  });
});

$('#like-button').on('click', function() {
$.ajax({
url: '/like',
method: 'POST',
success: function(response) {
console.log('Curtido com sucesso!');
},
error: function(error) {
console.error('Erro ao curtir:', error);
}
});
});

app.post('/like', (req, res) => {
  // Realizar a alteração no banco de dados aqui
  db.run('UPDATE videos SET likes = likes + 1 WHERE id = ?', [videoId], function(error) {
    if (error) {
      console.error('Erro ao curtir:', error);
      res.status(500).send('Erro ao curtir o vídeo.');
    } else {
      // Responder com sucesso
      res.send('Vídeo curtido com sucesso!');
    }
  });
});

// Exemplo de código no lado do cliente (JavaScript)

// Função para enviar uma requisição assíncrona para o servidor
function enviarAvaliacao(idVideo, avaliacao) {
  fetch('/api/avaliacoes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ idVideo, avaliacao })
  })
  .then(response => {
    if (response.ok) {
      console.log('Avaliação enviada com sucesso!');
    } else {
      console.log('Erro ao enviar a avaliação.');
    }
  })
  .catch(error => {
    console.log('Ocorreu um erro na requisição:', error);
  });
}
// Exemplo de código no lado do servidor (Node.js com Express e SQLite)

const express = require('express');
const app = express();

// Rota para receber a requisição de avaliação
app.post('/api/avaliacoes', (req, res) => {
  const { idVideo, avaliacao } = req.body;

  // Aqui você pode realizar a lógica para atualizar o banco de dados com a avaliação recebida
  // Usando SQLite ou qualquer outra biblioteca ou ORM que esteja utilizando

  // Retorne uma resposta para o cliente
  res.sendStatus(200);
});

// Resto das configurações e rotas do seu projeto...

app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});
