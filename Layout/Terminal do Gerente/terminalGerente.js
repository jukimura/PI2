
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
          const qtdServicosIndividuais = response.data.map(vetor => vetor[1]);
          const totalServicosIndividuais = response.data.map(vetor => vetor[2]);
          for (var i = 0; i < nomeServico.length; i++) {
            console.log('servico', nomeServico[i]);
            adicionarLinhaNaListaVendasInviduais(nomeServico[i], qtdServicosIndividuais[i], totalServicosIndividuais[0]);
          }
          console.log('LISTA RELATORIO', listaRelatorioTb1);
          gerarLinhaRelatorioVendas();
          return true;
        }
      } catch (error) {
        throw error;
      }
    }

    async function buscaInfosTableVendasKits() {
      limparTabela('tableVendas');
      listaRelatorioTbVendasKits = [];
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
          const qtdKitServicos = response.data.map(vetor => vetor[1]);
          const totalKitServicos = response.data.map(vetor => vetor[2]);
          for (var i = 0; i < nomeServico.length; i++) {
            console.log('servico', nomeServico[i]);
            adicionarLinhaNaListaVendasKits(nomeKit[i], qtdKitServicos[i], totalKitServicos[0]);
          }
          console.log('LISTA RELATORIO', listaRelatorioTb1);
          gerarLinhaRelatorioVendas();
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

    function adicionarLinhaNaListaVendasKits(nomeKit, qtdKitServicos, totalKitServicos) {
      let linha = { nomeKit: nomeKit, qtdKitServicos: qtdKitServicos, totalKitServicos: totalKitServicos};
      listaRelatorioTbVendasKits.push(linha);
    }
    
    function gerarLinhaRelatorioVendas() {
      var tabelaVendasRelatorio = document.getElementById('tableVendas');
  
        for (var i = 0; i < listaRelatorioTbVendasIndividuais.length; i++) {
          var novaLinha = tabelaVendasRelatorio.insertRow();
    
          var cellNomeServico = novaLinha.insertCell(0);
          cellNomeServico.textContent = listaRelatorioTbVendasIndividuais[i].nomeServico;
          
          var cellQtdServicos = novaLinha.insertCell(1);
          cellQtdServicos.textContent = listaRelatorioTbVendasIndividuais[i].qtdServicosIndividuais;
        
      }
      for (var i = 0; i < listaRelatorioTbVendasKits.length; i++) {  
        var cellNomeKit = novaLinha.insertCell(2);
        cellNomeKit.textContent = listaRelatorioTbVendasKits[i].nomeKit;
        
        var cellQtdKits = novaLinha.insertCell(3);
        cellQtdKits.textContent = listaRelatorioTbVendasKits[i].qtdKitServicos;
    }
      var pulaLinha = tabelaVendasRelatorio.insertRow();

      var linhaTotal = tabelaVendasRelatorio.insertRow();
      var cellTotalServicosIndviduais = linhaAdicional.insertCell(0);
      cellTotalServicosIndviduais.textContent = 'Total: ';
      
      var cellQtdTotalServicosIndviduais = linhaAdicional.insertCell(1);
      cellQtdTotalServicosIndviduais.textContent = listaRelatorioTbVendasIndividuais[0].totalServicosIndividuais;

      var cellTotalKitsServicos = linhaAdicional.insertCell(2);
      cellTotalKitsServicos.textContent = 'Total: ';

      var celQtdTotalKitsServicos = linhaAdicional.insertCell(3);
      celQtdTotalKitsServicos.textContent = listaRelatorioTbVendasKits[0].totalKitServicos;
    }


    //DADOS SOBRE UTILIZAÇÕES
    const btnAtualizarUtilizacoes = document.getElementById('btnAtualizarUtilizacoes');
    btnAtualizarUtilizacoes.addEventListener('click', function() {
      buscaInfosTableUtilizacoes();
    });

    async function buscaInfosTableUtilizacoes() {
      limparTabela('tableUtilizacoes');
      listaRelatorioUtilizacoes = [];
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
          const qtdServicosUsadosPorServico = response.data.map(vetor => vetor[1]);
          const qtdTotalServicosUsados = response.data.map(vetor => vetor[2]);
          for (var i = 0; i < nomeServico.length; i++) {
            adicionarLinhaNaListaUtilizacoes(nomeServico[i], qtdServicosUsadosPorServico[i], qtdTotalServicosUsados[0]);
          }
          console.log('LISTA RELATORIO', listaRelatorioUtilizacoes);
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
      var cellTotalServicosIndviduais = linhaAdicional.insertCell(0);
      cellTotalServicosIndviduais.textContent = 'Total: ';
      
      var cellQtdTotalServicosUsados = novaLinha.insertCell(1);
      cellQtdTotalServicosUsados.textContent = listaRelatorioUtilizacoes[i].qtdTotalServicosUsados;

    }


    //DADOS SOBRE RECOMPENSAS
    const btnAtualizarRecompensas = document.getElementById('btnAtualizarRecompensas');
    btnAtualizarRecompensas.addEventListener('click', function() {
      buscaInfosTableRecompensas();
    });

    async function buscaInfosTableRecompensas() {
      limparTabela('tableRecompensas');
      listaRelatorioRecompensas = [];
    //  let url = `http://localhost:3000/`;
    
      try {
        const response = await axios.get(url);
        console.log(' response da request : ', response.data);
        if (response.data == null || response.data == '') {
          divExisteCartao.textContent = 'Sem dados encontrados.';
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
          console.log('LISTA RELATORIO', listaRelatorioTb1);
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
      var cellTotalRecompensas = linhaAdicional.insertCell(0);
      cellTotalRecompensas.textContent = 'Total: ';
      
      var cellQtdTotalRecompensas = linhaAdicional.insertCell(1);
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