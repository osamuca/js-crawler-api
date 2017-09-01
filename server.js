// const express = require('express'),
//     fs = require('fs'),
//     request = require('request'),
//     cheerio = require('cheerio'),
//     app = express();

// // Passo 1
// app.get('/raspagem', function(req, res) {
//     ...
// })

// app.listen('8081')
// console.log('Executando raspagem de dados na porta 8081...');
// exports = module.exports = app;

// // fazendo requições
// /*
// A requisição externa deve ser realizada dentro do escopo do método app.get() através da função <b>request()</b>. 
// O método request deve receber dois parâmetros: a url e o callback. No parâmetro url colocamos a página do Portal da Transparência 
// e no callback iremos declarar três novos parâmetros: error, response e o html.
// */
// app.get('/raspagem', function(req, res) {
//     // Passo 2
//     url = 'http://www.portaldatransparencia.gov.br/PortalComprasDiretasOEOrgaoSuperior.asp?Ano=2015&Valor=86726995548647&Pagina=1';
//     request(url, function(error, response, html) {
//         ...
//     })
// })

// // Assegurar que não tenha erros para fazer a raspagem de dados com sucesso
// if (!error) {
//     const $ = cheerio.load(html);

//     // Objeto que irá armazenar a tabela
//     const resultado = [];

//     // Passo 3
//     // Manipulando o seletor específico para montar nossa estrutura
//     // Escolhi não selecionar a primeira linha porque faz parte do header da tabela
//     $('#listagem tr:not(:first-child)').each(function(i) {
//         // Obtendo as propriedades da tabela. 
//         // O método .trim() garante que irá remover espaço em branco
//         const codigo = $(this).find('td').eq(0).text().trim(),
//             orgao = $(this).find('td').eq(1).text().trim(),
//             valorTotal = $(this).find('td').eq(2).text().trim();
        
//         // Inserindo os dados obtidos no nosso objeto
//         resultado.push({
//             codigo: codigo,
//             orgao: orgao,
//             total: valorTotal
//         });
//     });
// }

// // Passo 4
// fs.writeFile('resultado.json', JSON.stringify(resultado, null, 4), function(err) {
//     console.log('JSON escrito com sucesso! O arquivo está na raiz do projeto.')
// })

var express = require('express'),
    fs = require('fs'),
    request = require('request'),
    cheerio = require('cheerio'),
    app = express();

// Escolhendo no metodo .get() o caminho para fazer a requisição
// Poderia ser somente a barra, mas para facilitar a compreensão vamos personalizar
app.get('/raspagem', function(req, res) {

    // Url a ser feita a raspagem de dados
    url = 'http://www.portaldatransparencia.gov.br/PortalComprasDiretasOEOrgaoSuperior.asp?Ano=2015&Valor=86726995548647&Pagina=1';

    // Metodo que faz a requisição para tratarmos (raspar) os dados
    request(url, function(error, response, html) {

        if (!error) {
            // Preparando o cheeriojs para ler o DOM ~ le jQuery selector
            var $ = cheerio.load(html);

            // Objeto que ira armazenar a tabela
            var resultado = [];

            // Escolhendo a tabela para fazer a raspagem
            // e percorrendo as linhas 
            $('#listagem tr:not(:first-child)').each(function(i) {
                // Obtendo as propriedades do objeto
                var codigo = $(this).find('td').eq(0).text().trim(),
                    orgao = $(this).find('td').eq(1).text().trim(),
                    valorTotal = $(this).find('td').eq(2).text().trim();
                // Inserindo os dados num array
                resultado.push({
                    codigo: codigo,
                    orgao: orgao,
                    total: valorTotal
                });
            });
        }

        // Escrevendo o arquivo .json com o array 
        fs.writeFile('resultado.json', JSON.stringify(resultado, null, 4), function(err) {
            console.log('JSON escrito com sucesso! O arquivo está na raiz do projeto.')
        })

        res.send('Dados raspados com sucesso! Verifique no seu node console.');
    })
})


// Execução do serviço
app.listen('8081')
console.log('Executando raspagem de dados na porta 8081...');
exports = module.exports = app;
