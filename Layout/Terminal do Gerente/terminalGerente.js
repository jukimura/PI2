
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
    let listaRelatorioUtilizacoesRecompensas = [];
    let listaRelatorioRecompensas = [];
    let listaRelatorioIndividuaisNaoUsados = [];
    let listaRelatorioKitsNaoUsados = [];
    let listaRecompensasNaoUsadas = [];
    
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
      cellTotalServicosIndviduais.id = 'celulaTotal';
      cellTotalServicosIndviduais.textContent = 'Total: ';
      
      var cellQtdTotalServicosIndviduais = linhaTotal.insertCell(1);
      cellQtdTotalServicosIndviduais.id = 'celulaTotal';
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
      buscaInfosTableUtilizacoesRecompensas();
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
      cellTotalServicosIndviduais.id='celulaTotal';
      
      var cellQtdTotalServicosUsados = linhaTotal.insertCell(1);
      console.log('test', listaRelatorioUtilizacoes[0].qtdTotalServicosUsados);
      cellQtdTotalServicosUsados.id='celulaTotal';
      cellQtdTotalServicosUsados.textContent = listaRelatorioUtilizacoes[0].qtdTotalServicosUsados;

    }

    //dados sobre utilizações de recompensas
    async function buscaInfosTableUtilizacoesRecompensas() {
      limparTabela('tableUtilizacoesRecompensas');
      listaRelatorioUtilizacoesRecompensas = [];
      let url = `http://localhost:3000/relatorioUsosRecompensas`;
    
      try {
        const response = await axios.get(url);
        console.log(' response da request : ', response.data);
        if (response.data == null || response.data == '') {
          adicionarLinhaNaListaUtilizacoesRecompensas('-','-','-');
          gerarLinhaRelatorioUtilizacoesRecompensas();
          return false;
        } else {
          console.log(response.data);
          const nomeRecompensa = response.data.map(vetor => vetor[0]);
          const qtdRecompensasUsadas = response.data.map(vetor => vetor[1]);
          const qtdTotalRecompensasUsadas = response.data.map(vetor => vetor[2]);
          for (var i = 0; i < nomeRecompensa.length; i++) {
            adicionarLinhaNaListaUtilizacoesRecompensas(nomeRecompensa[i], qtdRecompensasUsadas[i], qtdTotalRecompensasUsadas[0]);
          }
          gerarLinhaRelatorioUtilizacoesRecompensas();
          return true;
        }
      } catch (error) {
        throw error;
      }
    }
  
    function adicionarLinhaNaListaUtilizacoesRecompensas(nomeRecompensa, qtdRecompensasUsadas, qtdTotalRecompensasUsadas) {
      let linha = { nomeRecompensa: nomeRecompensa, qtdRecompensasUsadas: qtdRecompensasUsadas, qtdTotalRecompensasUsadas: qtdTotalRecompensasUsadas};
      listaRelatorioUtilizacoesRecompensas.push(linha);
    }
    
    function gerarLinhaRelatorioUtilizacoesRecompensas() {
      var tabelaUtilizacoesRecompensas = document.getElementById('tableUtilizacoesRecompensas');
  
        for (var i = 0; i < listaRelatorioUtilizacoesRecompensas.length; i++) {
          var novaLinha = tabelaUtilizacoesRecompensas.insertRow();
    
          var cellNomeRecompensa = novaLinha.insertCell(0);
          cellNomeRecompensa.textContent = listaRelatorioUtilizacoesRecompensas[i].nomeRecompensa;
          
          var cellQtdServicosUsados = novaLinha.insertCell(1);
          cellQtdServicosUsados.textContent = listaRelatorioUtilizacoesRecompensas[i].qtdRecompensasUsadas;
          
      }
      var linhaTotal = tabelaUtilizacoesRecompensas.insertRow();
      var cellTotalServicosIndviduais = linhaTotal.insertCell(0);
      cellTotalServicosIndviduais.textContent = 'Total: ';
      cellTotalServicosIndviduais.id='celulaTotal';
      
      var cellQtdTotalServicosUsados = linhaTotal.insertCell(1);
      console.log('test', listaRelatorioUtilizacoesRecompensas[0].qtdTotalRecompensasUsadas);
      cellQtdTotalServicosUsados.id='celulaTotal';
      cellQtdTotalServicosUsados.textContent = listaRelatorioUtilizacoesRecompensas[0].qtdTotalRecompensasUsadas;

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
      cellTotalRecompensas.id='celulaTotal';
      cellTotalRecompensas.textContent = 'Total: ';
      
      var cellQtdTotalRecompensas = linhaTotal.insertCell(1);
      cellQtdTotalRecompensas.id='celulaTotal';
      cellQtdTotalRecompensas.textContent = listaRelatorioRecompensas[0].qtdTotalRecompensas;      
    }



    //DADOS SOBRE SERVIÇOS NÃO UTILIZADOS
    const btnAtualizarServicosNaoUsados = document.getElementById('btnAtualizarServicosNaoUsados');
    btnAtualizarServicosNaoUsados.addEventListener('click', function() {
      buscaInfosTableIndividuaisNaoUsados();
      buscaInfosTableKitsNaoUsados();
      buscaInfosTableRecompensasNaoUsadas();
    });
  
    async function buscaInfosTableIndividuaisNaoUsados() {
      limparTabela('tableServicosNaoUsados');
      listaRelatorioIndividuaisNaoUsados = [];
      let url = `http://localhost:3000/relatorioServicosNaoUtilizados`;
    
      try {
        const response = await axios.get(url);
        console.log(' response da request : ', response.data);
        if (response.data == null || response.data == '') {
          adicionarLinhaNaListaInviduaisNaoUsados('-','-','-');
          gerarLinhaRelatorioIndividuaisNaoUsados();
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
          gerarLinhaRelatorioIndividuaisNaoUsados();
          return true;
        }
      } catch (error) {
        throw error;
      }
    }

    async function buscaInfosTableKitsNaoUsados() {
      limparTabela('tableServicosNaoUsados');
      listaRelatorioKitsNaoUsados = [];
      let url = `http://localhost:3000/relatorioKitsNaoUtilizados`;
    
      try {
        const response = await axios.get(url);
        console.log(' response da request : ', response.data);
        if (response.data == null || response.data == '') {
          adicionarLinhaNaListaKitsNaoUsados('-','-','-');
          gerarLinhaRelatorioKitsNaoUsados();
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
          console.log('kits nao usados', listaRelatorioKitsNaoUsados);
          gerarLinhaRelatorioKitsNaoUsados();
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
    
    function gerarLinhaRelatorioIndividuaisNaoUsados() {
      var tabelaRelatorioNaoUsados = document.getElementById('tableServicosNaoUsados');
      for (var i = 0; i <  listaRelatorioIndividuaisNaoUsados.length; i++) {
          var novaLinha = tabelaRelatorioNaoUsados.insertRow();
          novaLinha.id = 'linhaNaoUsados'+i;
          var cellNomeServico = novaLinha.insertCell(0);
          cellNomeServico.textContent = listaRelatorioIndividuaisNaoUsados[i].nomeServico;
          
          var cellQtdServicos = novaLinha.insertCell(1);
          cellQtdServicos.textContent = listaRelatorioIndividuaisNaoUsados[i].qtdIndividuaisNaoUsados;
        
      }
      var linhaTotal = tabelaRelatorioNaoUsados.insertRow();
      var cellTotalIndviduaisNaoUsados = linhaTotal.insertCell(0);
      cellTotalIndviduaisNaoUsados.id = 'celulaTotal';
      cellTotalIndviduaisNaoUsados.textContent = 'Total: ';
      
      var cellQtdTotalIndviduaisNaoUsados = linhaTotal.insertCell(1);
      cellQtdTotalIndviduaisNaoUsados.id = 'celulaTotal';
      cellQtdTotalIndviduaisNaoUsados.textContent = listaRelatorioIndividuaisNaoUsados[0].totalIndividuaisNaoUsados;
    }

    function gerarLinhaRelatorioKitsNaoUsados() {
      var tabelaRelatorioNaoUsados = document.getElementById('tableServicosNaoUsados');
      let linha;
        for (var i = 0; i < listaRelatorioKitsNaoUsados.length; i++) { 
          linha = document.getElementById('linhaNaoUsados'+i);
          var cellNomeKit = linha.insertCell(2);
          cellNomeKit.textContent = listaRelatorioKitsNaoUsados[i].nomeKit;
          
          var cellQtdKits = linha.insertCell(3);
          cellQtdKits.textContent = listaRelatorioKitsNaoUsados[i].qtdKitServicos;
        }
        linha = document.getElementById('linhaNaoUsados'+listaRelatorioKitsNaoUsados.length);
        var celltotalKitsNaoUsados = linha.insertCell(2);
        celltotalKitsNaoUsados.id= 'celulaTotal';
        celltotalKitsNaoUsados.textContent = 'Total: ';
        let quantidadeKits=0;

        for (var i = 0; i < listaRelatorioKitsNaoUsados.length; i++) { 
          quantidadeKits += listaRelatorioKitsNaoUsados[i].qtdKitServicos;
        }
        var celQtdTotalKitsServicosNaoUsados = linha.insertCell(3);
        celQtdTotalKitsServicosNaoUsados.id= 'celulaTotal';
        celQtdTotalKitsServicosNaoUsados.textContent = quantidadeKits;
      }

      //DADOS SOBRE RECOMPENSAS NÃO UTILIZADAS
    
      async function buscaInfosTableRecompensasNaoUsadas() {
        limparTabela('tableRecompensasNaoUsadas');
        listaRecompensasNaoUsadas = [];
        let url = `http://localhost:3000/relatorioRecompensasNaoUsadas`;
      
        try {
          const response = await axios.get(url);
          console.log(' response da request : ', response.data);
          if (response.data == null || response.data == '') {
            adicionarLinhaNaListaRecompensasNaoUsadas('-','-','-');
            gerarLinhaRelatorioRecompensasNaoUsadas();
            return false;
          } else {
            console.log(response.data);
            const nomeRecompensa = response.data.map(vetor => vetor[0]);
            const qtdRecompensasNaoUsadas = response.data.map(vetor => vetor[1]);
            const qtdTotalRecompensasNaoUsadas = response.data.map(vetor => vetor[2]);
            for (var i = 0; i < nomeRecompensa.length; i++) {
              adicionarLinhaNaListaRecompensasNaoUsadas(nomeRecompensa[i], qtdRecompensasNaoUsadas[i], qtdTotalRecompensasNaoUsadas[0]);
            }
            gerarLinhaRelatorioRecompensasNaoUsadas();
            return true;
          }
        } catch (error) {
          throw error;
        }
      }
    
      function adicionarLinhaNaListaRecompensasNaoUsadas(nomeRecompensa, qtdRecompensasNaoUsadas, qtdTotalRecompensasNaoUsadas) {
        let linha = { nomeRecompensa: nomeRecompensa, qtdRecompensasNaoUsadas: qtdRecompensasNaoUsadas, qtdTotalRecompensasNaoUsadas: qtdTotalRecompensasNaoUsadas};
        listaRecompensasNaoUsadas.push(linha);
      }
      
      function gerarLinhaRelatorioRecompensasNaoUsadas() {
        var tableRecompensasNaoUsadas = document.getElementById('tableRecompensasNaoUsadas');
    
          for (var i = 0; i < listaRecompensasNaoUsadas.length; i++) {
            var novaLinha = tableRecompensasNaoUsadas.insertRow();
      
            var cellNomeRecompensa = novaLinha.insertCell(0);
            cellNomeRecompensa.textContent = listaRecompensasNaoUsadas[i].nomeRecompensa;
            
            var cellQtdRecompensasNaoUsadas = novaLinha.insertCell(1);
            cellQtdRecompensasNaoUsadas.textContent = listaRecompensasNaoUsadas[i].qtdRecompensasNaoUsadas;
            
        }
        var linhaTotal = tableRecompensasNaoUsadas.insertRow();
        var cellTotalServicosIndviduais = linhaTotal.insertCell(0);
        cellTotalServicosIndviduais.textContent = 'Total: ';
        cellTotalServicosIndviduais.id='celulaTotal';
        
        var cellQtdTotalServicosUsados = linhaTotal.insertCell(1);
        console.log('test', listaRecompensasNaoUsadas[0].qtdRecompensasNaoUsadas);
        cellQtdTotalServicosUsados.id='celulaTotal';
        cellQtdTotalServicosUsados.textContent = listaRecompensasNaoUsadas[0].qtdTotalRecompensasNaoUsadas;
  
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