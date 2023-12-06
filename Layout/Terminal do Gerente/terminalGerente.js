
function exibirPaginaCorreta(pagina) {
    // Ocultar todas as páginas
    var pages = document.getElementsByClassName('conteudo');
    for (var i = 0; i < pages.length; i++) {
      pages[i].classList.remove('visible');
    }
  
    // Exibir a página desejada
    var exibir = document.getElementById(pagina);
    if (exibir) {
      exibir.classList.add('visible');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    let listaRelatorioTbVendasIndividuais = [];
    let listaRelatorioTbVendasKits = [];
    let listaRelatorioUtilizacoes = [];
    let listaRelatorioRecompensas = [];
    let listaRelatorioIndividuaisNaoUsados = [];
    let listaRelatorioKitsNaoUsados = [];

    //DADOS SOBRE VENDAS
    const btnAtualizarVendas = document.getElementById('btnAtualizarVendas');
    btnAtualizarVendas.addEventListener('click', function() {
      buscaInfosTableVendasIndividuais();
      buscaInfosTableVendasKits();
    });
  
    async function buscaInfosTableVendasIndividuais() {
      limparTabela('tableVendas');
      listaRelatorioTbVendasIndividuais = [];
      let url = `http://localhost:3000/relatorioVendasServicos`;
    
      try {

        const response = await axios.get(url);
        if (response.data == null || response.data == '') {
          adicionarLinhaNaListaInviduaisNaoUsados('-','-','-');
          gerarLinhaRelatorioVendasIndividuais();
          return false;
        } else {
        console.log(' response da request : ', response.data);
        const nomeServico = response.data.map(vetor => vetor[0]);
        const qtdServicosIndividuais = response.data.map(vetor => vetor[1]);
        const totalServicosIndividuais = response.data.map(vetor => vetor[2]);
        for (var i = 0; i < nomeServico.length; i++) {
          adicionarLinhaNaListaVendasInviduais(nomeServico[i], qtdServicosIndividuais[i], totalServicosIndividuais[0]);
        }
        console.log('LISTA ', listaRelatorioTbVendasIndividuais);
        gerarLinhaRelatorioVendasIndividuais();
        return true;
      }
      } catch (error) {
        throw error;
      }
    }

    async function buscaInfosTableVendasKits() {
      limparTabela('tableVendas');
      listaRelatorioTbVendasKits = [];
      let url = `http://localhost:3000/relatorioVendasKits`;
    
      try {
        const response = await axios.get(url);
        console.log(' response da request : ', response.data);
        if (response.data == null || response.data == '') {
          adicionarLinhaNaListaVendasKits('-','-','-');
          gerarLinhaRelatorioVendasKits();
          return false;
        } else {
          console.log(response.data);
          const nomeKit = response.data.map(vetor => vetor[0]);
          const qtdKitServicos = response.data.map(vetor => vetor[1]);
          const totalKitServicos = response.data.map(vetor => vetor[2]);
          let resultado = 0;

          for (var i = 0; i < nomeKit.length; i++) {
            resultado = qtdKitServicos[i] / 6;
            adicionarLinhaNaListaVendasKits(nomeKit[i], resultado);            
          }
          gerarLinhaRelatorioVendasKits();
          return true;
        }
      } catch (error) {
        throw error;
      }
    }
  
    function adicionarLinhaNaListaVendasInviduais(nomeServico, qtdServicosIndividuais, totalServicosIndividuais) {
      let linha = { nomeServico: nomeServico, qtdServicosIndividuais: qtdServicosIndividuais, totalServicosIndividuais: totalServicosIndividuais};
      listaRelatorioTbVendasIndividuais.push(linha);
    }

    function adicionarLinhaNaListaVendasKits(nomeKit, qtdKitServicos) {
      let linha = { nomeKit: nomeKit, qtdKitServicos: qtdKitServicos};
      listaRelatorioTbVendasKits.push(linha);
    }
    
    function gerarLinhaRelatorioVendasIndividuais() {
      var tabelaVendasRelatorio = document.getElementById('tableVendas');
      for (var i = 0; i <  listaRelatorioTbVendasIndividuais.length; i++) {
          var novaLinha = tabelaVendasRelatorio.insertRow();
          novaLinha.id = 'novaLinha'+i;
          var cellNomeServico = novaLinha.insertCell(0);
          cellNomeServico.textContent = listaRelatorioTbVendasIndividuais[i].nomeServico;
          
          var cellQtdServicos = novaLinha.insertCell(1);
          cellQtdServicos.textContent = listaRelatorioTbVendasIndividuais[i].qtdServicosIndividuais;
        
      }
      var linhaTotal = tabelaVendasRelatorio.insertRow();
      var cellTotalServicosIndviduais = linhaTotal.insertCell(0);
      cellTotalServicosIndviduais.id = 'totalServicosIndividuais';
      cellTotalServicosIndviduais.textContent = 'Total: ';
      
      var cellQtdTotalServicosIndviduais = linhaTotal.insertCell(1);
      cellQtdTotalServicosIndviduais.id = 'totalServicosIndividuais';
      cellQtdTotalServicosIndviduais.textContent = listaRelatorioTbVendasIndividuais[0].totalServicosIndividuais;
    }

    function gerarLinhaRelatorioVendasKits() {
      var tabelaVendasRelatorio = document.getElementById('tableVendas');
      console.log('Entrou aqui teste');
      let linha;
        for (var i = 0; i < listaRelatorioTbVendasKits.length; i++) { 
          linha = document.getElementById('novaLinha'+i);
          var cellNomeKit = linha.insertCell(2);
          cellNomeKit.textContent = listaRelatorioTbVendasKits[i].nomeKit;
          
          var cellQtdKits = linha.insertCell(3);
          cellQtdKits.textContent = listaRelatorioTbVendasKits[i].qtdKitServicos;
        }
        linha = document.getElementById('novaLinha'+listaRelatorioTbVendasKits.length);
        var cellTotalKitsServicos = linha.insertCell(2);
        cellTotalKitsServicos.id= 'cellTotalKits';
        cellTotalKitsServicos.textContent = 'Total: ';
        let quantidadeKits=0;

        for (var i = 0; i < listaRelatorioTbVendasKits.length; i++) { 
          quantidadeKits += listaRelatorioTbVendasKits[i].qtdKitServicos;
        }
        var celQtdTotalKitsServicos = linha.insertCell(3);
        celQtdTotalKitsServicos.id= 'cellTotalKits';
        celQtdTotalKitsServicos.textContent = quantidadeKits;
      }
    //DADOS SOBRE UTILIZAÇÕES
    const btnAtualizarUtilizacoes = document.getElementById('btnAtualizarUtilizacoes');
    btnAtualizarUtilizacoes.addEventListener('click', function() {
      buscaInfosTableUtilizacoes();
    });

    async function buscaInfosTableUtilizacoes() {
      limparTabela('tableUtilizacoes');
      listaRelatorioUtilizacoes = [];
      let url = `http://localhost:3000/relatorioUsos`;
    
      try {
        const response = await axios.get(url);
        console.log(' response da request : ', response.data);
        if (response.data == null || response.data == '') {
          adicionarLinhaNaListaUtilizacoes('-','-','-');
          gerarLinhaRelatorioUtilizacoes();
          return false;
        } else {
          console.log(response.data);
          const nomeServico = response.data.map(vetor => vetor[0]);
          const qtdServicosUsadosPorServico = response.data.map(vetor => vetor[1]);
          const qtdTotalServicosUsados = response.data.map(vetor => vetor[2]);
          for (var i = 0; i < nomeServico.length; i++) {
            adicionarLinhaNaListaUtilizacoes(nomeServico[i], qtdServicosUsadosPorServico[i], qtdTotalServicosUsados[0]);
          }
          gerarLinhaRelatorioUtilizacoes();
          return true;
        }
      } catch (error) {
        throw error;
      }
    }
  
    function adicionarLinhaNaListaUtilizacoes(nomeServico, qtdServicosUsadosPorServico, qtdTotalServicosUsados) {
      let linha = { nomeServico: nomeServico, qtdServicosUsadosPorServico: qtdServicosUsadosPorServico, qtdTotalServicosUsados: qtdTotalServicosUsados};
      listaRelatorioUtilizacoes.push(linha);
    }
    
    function gerarLinhaRelatorioUtilizacoes() {
      var tabelaUtilizacoes = document.getElementById('tableUtilizacoes');
  
        for (var i = 0; i < listaRelatorioUtilizacoes.length; i++) {
          var novaLinha = tabelaUtilizacoes.insertRow();
    
          var cellNomeServico = novaLinha.insertCell(0);
          cellNomeServico.textContent = listaRelatorioUtilizacoes[i].nomeServico;
          
          var cellQtdServicosUsados = novaLinha.insertCell(1);
          cellQtdServicosUsados.textContent = listaRelatorioUtilizacoes[i].qtdServicosUsadosPorServico;
          
      }
      var linhaTotal = tabelaUtilizacoes.insertRow();
      var cellTotalServicosIndviduais = linhaTotal.insertCell(0);
      cellTotalServicosIndviduais.textContent = 'Total: ';
      cellTotalServicosIndviduais.id='cellTotalServicos';
      
      var cellQtdTotalServicosUsados = linhaTotal.insertCell(1);
      console.log('test', listaRelatorioUtilizacoes[0].qtdTotalServicosUsados);
      cellQtdTotalServicosUsados.id='cellTotalServicos';
      cellQtdTotalServicosUsados.textContent = listaRelatorioUtilizacoes[0].qtdTotalServicosUsados;

    }


    //DADOS SOBRE RECOMPENSAS
    const btnAtualizarRecompensas = document.getElementById('btnAtualizarRecompensas');
    btnAtualizarRecompensas.addEventListener('click', function() {
      buscaInfosTableRecompensas();
    });

    async function buscaInfosTableRecompensas() {
      limparTabela('tableRecompensas');
      listaRelatorioRecompensas = [];
      let url = `http://localhost:3000/relatorioRecompensas`;
    
      try {
        const response = await axios.get(url);
        console.log(' response da request : ', response.data);
        if (response.data == null || response.data == '') {
          adicionarLinhaNaListaRecompensas('-','-','-');
          gerarLinhaRelatorioRecompensas();
          return false;
        } else {
          console.log(response.data);
          const nomeRecompensa = response.data.map(vetor => vetor[0]);
          const qtdRecompensasPorTipo = response.data.map(vetor => vetor[1]);
          const qtdTotalRecompensas = response.data.map(vetor => vetor[2]);
          for (var i = 0; i < nomeRecompensa.length; i++) {
            console.log('recompensa', nomeRecompensa[i]);
            adicionarLinhaNaListaRecompensas(nomeRecompensa[i], qtdRecompensasPorTipo[i], qtdTotalRecompensas[i]);
          }
          console.log('LISTA RELATORIO', listaRelatorioRecompensas);
          gerarLinhaRelatorioRecompensas();
          return true;
        }
      } catch (error) {
        throw error;
      }
    }
  
    function adicionarLinhaNaListaRecompensas(nomeRecompensa, qtdRecompensasPorTipo, qtdTotalRecompensas) {
      let linha = { nomeRecompensa: nomeRecompensa, qtdRecompensasPorTipo: qtdRecompensasPorTipo, qtdTotalRecompensas: qtdTotalRecompensas};
      listaRelatorioRecompensas.push(linha);
    }
    
    function gerarLinhaRelatorioRecompensas() {
      var tabelaRecompensasRelatorio = document.getElementById('tableRecompensas');
  
        for (var i = 0; i < listaRelatorioRecompensas.length; i++) {
          var novaLinha = tabelaRecompensasRelatorio.insertRow();
    
          var cellNomeRecompensa = novaLinha.insertCell(0);
          cellNomeRecompensa.textContent = listaRelatorioRecompensas[i].nomeRecompensa;
          
          var cellQtdRecompensasPorTipo = novaLinha.insertCell(1);
          cellQtdRecompensasPorTipo.textContent = listaRelatorioRecompensas[i].qtdRecompensasPorTipo;
          
      }
      var linhaTotal = tabelaRecompensasRelatorio.insertRow();
      var cellTotalRecompensas = linhaTotal.insertCell(0);
      cellTotalRecompensas.id='cellTotalRecompensas';
      cellTotalRecompensas.textContent = 'Total: ';
      
      var cellQtdTotalRecompensas = linhaTotal.insertCell(1);
      cellQtdTotalRecompensas.id='cellTotalRecompensas';
      cellQtdTotalRecompensas.textContent = listaRelatorioRecompensas[0].qtdTotalRecompensas;      
    }



    //DADOS SOBRE SERVIÇOS NÃO UTILIZADOS
    const btnAtualizarServicosNaoUsados = document.getElementById('btnAtualizarServicosNaoUsados');
    btnAtualizarServicosNaoUsados.addEventListener('click', function() {
      buscaInfosTableIndividuaisNaoUsados();
      buscaInfosTableKitsNaoUsados();
      gerarLinhaRelatorioNaoUsados();
    });
  
    async function buscaInfosTableIndividuaisNaoUsados() {
      limparTabela('tableServicosNaoUsados');
      listaRelatorioTbVendasIndividuais = [];
    //  let url = `http://localhost:3000/`;
    
      try {
        const response = await axios.get(url);
        console.log(' response da request : ', response.data);
        if (response.data == null || response.data == '') {
          divExisteCartao.textContent = 'Sem dados encontrados.';
          return false;
        } else {
          console.log(response.data);
          const nomeServico = response.data.map(vetor => vetor[0]);
          const qtdIndividuaisNaoUsados = response.data.map(vetor => vetor[1]);
          const totalIndividuaisNaoUsados = response.data.map(vetor => vetor[2]);
          for (var i = 0; i < nomeServico.length; i++) {
            console.log('servico', nomeServico[i]);
            adicionarLinhaNaListaInviduaisNaoUsados(nomeServico[i], qtdIndividuaisNaoUsados[i], totalIndividuaisNaoUsados[0]);
          }
          console.log('LISTA RELATORIO', listaRelatorioIndividuaisNaoUsados);
          return true;
        }
      } catch (error) {
        throw error;
      }
    }

    async function buscaInfosTableKitsNaoUsados() {
      limparTabela('tableServicosNaoUsados');
      listaRelatorioKitsNaoUsados = [];
    //  let url = `http://localhost:3000/`;
    
      try {
        const response = await axios.get(url);
        console.log(' response da request : ', response.data);
        if (response.data == null || response.data == '') {
          divExisteCartao.textContent = 'Sem dados encontrados.';
          return false;
        } else {
          console.log(response.data);
          const nomeKit = response.data.map(vetor => vetor[0]);
          const qtdKitsNaoUsados = response.data.map(vetor => vetor[1]);
          const totalKitsNaoUsados = response.data.map(vetor => vetor[2]);
          for (var i = 0; i < nomeKit.length; i++) {
            console.log('nome kit ', nomeKit[i]);
            adicionarLinhaNaListaKitsNaoUsados(nomeKit[i], qtdKitsNaoUsados[i], totalKitsNaoUsados[0]);
          }
          console.log('kits nao usadps', listaRelatorioKitsNaoUsados);
          return true;
        }
      } catch (error) {
        throw error;
      }
    }
  
    function adicionarLinhaNaListaInviduaisNaoUsados(nomeServico, qtdIndividuaisNaoUsados, totalIndividuaisNaoUsados) {
      let linha = { nomeServico: nomeServico, qtdIndividuaisNaoUsados: qtdIndividuaisNaoUsados, totalIndividuaisNaoUsados: totalIndividuaisNaoUsados};
      listaRelatorioIndividuaisNaoUsados.push(linha);
    }

    function adicionarLinhaNaListaKitsNaoUsados(nomeKit, qtdKitServicos, totalKitServicos) {
      let linha = { nomeKit: nomeKit, qtdKitServicos: qtdKitServicos, totalKitServicos: totalKitServicos};
      listaRelatorioKitsNaoUsados.push(linha);
    }
    
    function gerarLinhaRelatorioNaoUsados() {
      var tabelaServicosNaoUsados = document.getElementById('tableServicosNaoUsados');
  
        for (var i = 0; i < listaRelatorioIndividuaisNaoUsados.length; i++) {
          var novaLinha = tabelaServicosNaoUsados.insertRow();
    
          var cellNomeServico = novaLinha.insertCell(0);
          cellNomeServico.textContent = listaRelatorioIndividuaisNaoUsados[i].nomeServico;
          
          var cellQtdIndividuais = novaLinha.insertCell(1);
          cellQtdIndividuais.textContent = listaRelatorioIndividuaisNaoUsados[i].qtdIndividuaisNaoUsados;
        
      }
      for (var i = 0; i < listaRelatorioKitsNaoUsados.length; i++) {  
        var cellNomeKit = novaLinha.insertCell(2);
        cellNomeKit.textContent = listaRelatorioKitsNaoUsados[i].nomeKit;
        
        var cellQtdKits = novaLinha.insertCell(3);
        cellQtdKits.textContent = listaRelatorioKitsNaoUsados[i].qtdKitsNaoUsados;
    }
      var pulaLinha = tabelaServicosNaoUsados.insertRow();

      var linhaTotal = tabelaServicosNaoUsados.insertRow();
      var cellTotalIndviduaisNaoUsados = linhaAdicional.insertCell(0);
      cellTotalIndviduaisNaoUsados.textContent = 'Total: ';
      
      var cellQtdTotalIndviduaisNaoUsados = linhaAdicional.insertCell(1);
      cellQtdTotalIndviduaisNaoUsados.textContent = listaRelatorioIndividuaisNaoUsados[0].totalIndividuaisNaoUsados;

      var cellTotalKitsNaoUsados = linhaAdicional.insertCell(2);
      cellTotalKitsNaoUsados.textContent = 'Total: ';

      var celQtdTotalKitsNaoUsados = linhaAdicional.insertCell(3);
      celQtdTotalKitsNaoUsados.textContent = listaRelatorioKitsNaoUsados[0].totalKitsNaoUsados;
    }


    function limparTabela(idTabela) {
      var tabela = document.getElementById(idTabela); // Substitua 'suaTabela' pelo ID da sua tabela
    
      if (tabela) {
        var rowCount = tabela.rows.length;
        for (var i = rowCount - 1; i > 0; i--) {
          tabela.deleteRow(i);
        }
      } else {
        console.error('Tabela não encontrada.');
      }
    }

  });