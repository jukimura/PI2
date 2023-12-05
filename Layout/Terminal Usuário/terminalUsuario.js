
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

function validarNumeros(campo){
  var numeroCartao = campo.value;
  var valoresAceitos =  /^[0-9]+$/;
  if(!valoresAceitos.test(numeroCartao))
  {
      campo.value = numeroCartao.slice(0, -1);
      alert("Digite apenas números");
  }
}


async function gerarCartao(pagina) 
{
    let existeId;
    let podeGerar = false;
    
    do {
      var idGerado = geraCodigo();
      existeId = await existeCartaoNoBanco(idGerado);
      if(existeId == false)
      {
        podeGerar = true;
      }
      else
      {
        podeGerar = false;
      }
    } while (podeGerar != true);


    if(podeGerar == true)
    {
        let objCartao = { idCartao: idGerado };
        let url = `http://localhost:3000/cadastrarCartao/`;

        let res = axios.post(url, objCartao)
        .then(response => {
          if (response.data) {
            const msg = new Comunicado (response.data.codigo, 
                                        response.data.mensagem, 
                          response.data.descricao);
          }
        })
        .catch(error  =>  {
          
          if (error.response) {
            const msg = new Comunicado (error.response.data.codigo, 
                                        error.response.data.mensagem, 
                          error.response.data.descricao);
            alert(msg.get());
          }
        })

      var pages = document.getElementsByClassName('conteudo');
      for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove('visible');
      }

      //inserir logica de gerar cartao
      var exibir = document.getElementById(pagina);
        if (exibir) {
          exibir.classList.add('visible');
        }

      var divNumeroCartao = document.getElementById('numeroCartao');
      divNumeroCartao.textContent = idGerado;
    }
  }
  
  function geraCodigo(){ 
    const charset = '0123456789'; 
    let id = ' ';

    for (let i=0; i<5; i++) 
    { 
        //gera um número aleátorio de até 5 números
        const indiceAleatorio = Math.floor(Math.random() * charset.length);
        id += charset.charAt(indiceAleatorio);
    }
    return id;
  }


  async function existeCartaoNoBanco(idCartao) {
    console.log(idCartao);
    let url = `http://localhost:3000/getCartao/${idCartao}`;
  
    try {
      const response = await axios.get(url);
      console.log(' response da request : ', response.data);
      if (response.data == null || response.data == '') {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      // Não use alert aqui, apenas lance o erro para ser tratado fora desta função
      throw error;
    }
  }

  async function buscarCartao(idPagina) {
    console.log('idPagina' + idPagina);
    var numeroCartao = document.getElementById(idPagina).value;
    var divExisteCartao = document.getElementById('cartaoExiste');
    var btnAdquirirServico = document.getElementsByClassName('buttonScreenAdqServ');
    var btnFinalizar = document.getElementById('btnFinalizar');
    let exibirTextoOK = false;
    console.log(numeroCartao);
  
    try {
      if (numeroCartao == null || numeroCartao == '') {
        alert("Preencha o número do cartão antes de comprar um serviço!");
      }
      else{
            const existe = await existeCartaoNoBanco(numeroCartao);
            console.log('Existe' + existe);
            for (var i = 0; i < btnAdquirirServico.length; i++) {
              if (existe) {
                btnAdquirirServico[i].disabled = false;
                exibirTextoOK = true;
              } else {
                // Desabilita o botão específico dentro da coleção
                btnAdquirirServico[i].disabled = true;
                exibirTextoOK = false;
              }
          }
          if(exibirTextoOK)
          {
            divExisteCartao.textContent = 'OK! Boas compras!';
            btnFinalizar.disabled = false;
          }else{
            btnFinalizar.disabled = true;
            divExisteCartao.textContent = 'Este cartão não existe! Gere um na página de gerar cartão.';
          }
        }
      } catch (error) {
      console.error(error);
    }
  }
  

  async function adquirirServico(idDoBotao) {
    var campoNumeroCartao = document.getElementById("campoNumeroCartao");
    var divExisteCartao = document.getElementById('cartaoExiste');
    console.log('id botao ' + idDoBotao);
    try {

      if (campoNumeroCartao.required && (campoNumeroCartao.value == null || campoNumeroCartao.value == '')) {
        alert("Preencha o número do cartão antes de comprar um serviço!");
      } else {
        await buscarCartao();
        if (divExisteCartao.textContent == 'OK! Boas compras!') { 
          alert("Serviço adicionado à lista! Não se esqueça de finalizar a compra no final da página.");
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  

function Comunicado (codigo,mensagem,descricao)
{
	this.codigo    = codigo;
	this.mensagem  = mensagem;
	this.descricao = descricao;
	
	this.get = function ()
	{
		return (this.codigo   + " - " + 
		        this.mensagem + " - " +
			    this.descricao);

	}
}


document.addEventListener('DOMContentLoaded', function () {
  let listaDeServicos = []; 
  let listaRelatorioTb1 = [];
  let listaRelatorioTb2 = [];

  
  document.querySelectorAll('#listaServicos button').forEach(function(button) {
    button.addEventListener('click', function() {
      var campoNumeroCartao = document.getElementById("campoNumeroCartao");
      var numeroCartao = campoNumeroCartao.value;
      if(campoNumeroCartao.required && (numeroCartao == null || numeroCartao == ''))
      {
          alert("Preencha o número do cartão antes de comprar um serviço!");
      }else
      {
        const idServico = button.getAttribute('idDoServico');
        inserirServicoNaLista(idServico);
      }
    });
  });

  function inserirServicoNaLista(idServico) {
    listaDeServicos.push(idServico);
    console.log('Serviços selecionados:', listaDeServicos);
  }
  

  async function finalizarCompra(listaServicos) {

    var numeroCartao = document.getElementById("campoNumeroCartao").value;
    if(listaDeServicos == null || listaDeServicos == '')
    {
        alert('Você não selecionou nenhum serviço!');
    }
    else
    {
      for (let i = 0; i < listaDeServicos.length; i++) {
        if(listaDeServicos[i] == 10)
        {
          for(let j = 0; j < 6; j++)
          {
            await inserirServicoNoBanco(10, numeroCartao);
          }
        }else if(listaDeServicos[i] == 11)
        {
          for(let j = 0; j < 6; j++)
          {
            await inserirServicoNoBanco(11, numeroCartao);
          }
        } else if(listaDeServicos[i] == 12)
        {
          for(let j = 0; j < 6; j++)
          {
            await inserirServicoNoBanco(12, numeroCartao);
          }
        }
        else{
          await inserirServicoNoBanco(listaDeServicos[i], numeroCartao);
        }
      }
      listaDeServicos = [];    
      alert('Compra finalizada com sucesso!');
    }
  }
  
  async function inserirServicoNoBanco(servico, numeroCartao) {

    console.log('servico ' + servico);
    console.log('numeroCartao' + numeroCartao);
    
    let objCompra = { idServico: servico};
    let url = `http://localhost:3000/compraServico/${numeroCartao}` //post

    let res = axios.post(url, objCompra)
    .then(response => {
      if (response.data) {
        const msg = new Comunicado (response.data.codigo, 
                                    response.data.mensagem, 
                      response.data.descricao);
      }
    })
    .catch(error  =>  {
      
      if (error.response) {
        const msg = new Comunicado (error.response.data.codigo, 
                                    error.response.data.mensagem, 
                      error.response.data.descricao);
        alert(msg.get());
      }
    })
    console.log('Inserindo serviço no banco de dados:', servico);
  }

  const btnFinalizar = document.getElementById('btnFinalizar');
  btnFinalizar.addEventListener('click', function() {
    finalizarCompra(listaDeServicos);
  });

  const btnBuscaCartaoRelatorio = document.getElementById('btnBuscaPagRelatorio');
  btnBuscaCartaoRelatorio.addEventListener('click', function() {
    buscarCartaoRelatorio('campoNumeroCartaoRelatorio');
  });

  async function buscarCartaoRelatorio(idCampo) {
    limparTabela('table1');
    limparTabela('table2');
    var numeroCartao = document.getElementById(idCampo).value;
    var divExisteCartao = document.getElementById('cartaoExisteRelatorio');
  
    try {
      if (numeroCartao == null || numeroCartao == '') {
        alert("Preencha o número do cartão para exibir as informações relacionadas a ele!");
      }
      else{
            const existe = await existeCartaoNoBanco(numeroCartao);
            console.log('Existe ' + existe);
              if (existe) {
                divExisteCartao.textContent = 'Ok! Este é o relatório de serviços desse cliente.';
                buscaInfosTable1ByCartao(numeroCartao);
                buscaInfosTable2ByCartao(numeroCartao);
              } else {
                divExisteCartao.textContent = 'Este cartão não existe! Gere um na página de gerar cartão.';
  
              }
          }
      } catch (error) {
      console.error(error);
    }
  }

  async function buscaInfosTable1ByCartao(idCartao) {
    limparTabela('table1');
    listaRelatorioTb1 = [];
    var divExisteCartao = document.getElementById('cartaoExisteRelatorio');
    let url = `http://localhost:3000/getInfosRelatorio1/${idCartao}`;
  
    try {
      const response = await axios.get(url);
      console.log(' response da request : ', response.data);
      if (response.data == null || response.data == '') {
        divExisteCartao.textContent = 'Sem dados encontrados.';
        return false;
      } else {
        console.log(response.data);
        const nomeServico = response.data.map(vetor => vetor[0]);
        const dataCompra = response.data.map(vetor => vetor[1]);
        const dataUso = response.data.map(vetor => vetor[2]);
        const status = response.data.map(vetor => vetor[3]);
        for (var i = 0; i < nomeServico.length; i++) {
          console.log('id servico', nomeServico[i]);
          adicionarLinhaNaLista(nomeServico[i], dataCompra[i], dataUso[i], status[i]);
        }
        console.log('LISTA RELATORIO', listaRelatorioTb1);
        gerarLinhaRelatorio1Cliente();
        return true;
      }
    } catch (error) {
      throw error;
    }
  }

  async function buscaInfosTable2ByCartao(idCartao) {
    limparTabela('table2');
    listaRelatorioTb2 = [];
    var divExisteCartao = document.getElementById('cartaoExisteRelatorio');
    let url = `http://localhost:3000/getInfosRelatorio2/${idCartao}`;
  
    try {
      const response = await axios.get(url);
      console.log(' response da request : ', response.data);
      console.log(response.data);
      const nomeRecompensa = response.data.map(vetor => vetor[0]);
      const dataAquisicao = response.data.map(vetor => vetor[1]);
      const dataUso = response.data.map(vetor => vetor[2]);
      const status = response.data.map(vetor => vetor[3]);
      for (var i = 0; i < nomeRecompensa.length; i++) {
        console.log('id servico', nomeRecompensa[i]);
        adicionarLinhaNaLista2(nomeRecompensa[i], dataAquisicao[i], dataUso[i], status[i]);
      }
      console.log('LISTA RELATORIO', listaRelatorioTb2);
      gerarLinhaRelatorio2Cliente();
      return true;
    } catch (error) {
      throw error;
    }
  }

  function adicionarLinhaNaLista(nomeServico, dataCompra, dataUso, status) {
    let linha = { nomeServico: nomeServico, dataCompra: dataCompra, dataUso: dataUso, status: status};
    listaRelatorioTb1.push(linha);
  }

  function adicionarLinhaNaLista2(nomeRecompensa, dataAquisicao, dataUso, status) {
    let linha = { nomeRecompensa: nomeRecompensa, dataAquisicao: dataAquisicao, dataUso: dataUso, status: status};
    listaRelatorioTb2.push(linha);
  }

  
  function gerarLinhaRelatorio1Cliente() {
    var campoNumeroCartao = document.getElementById('campoNumeroCartaoRelatorio');
    var idCartao = campoNumeroCartao.value;
    var tabelaRelatorio1 = document.getElementById('table1');

    for (var i = 0; i < listaRelatorioTb1.length; i++) {
      var novaLinha = tabelaRelatorio1.insertRow();

      var cellNomeServico = novaLinha.insertCell(0);
      cellNomeServico.textContent = listaRelatorioTb1[i].nomeServico;

      var cellDataCompra = novaLinha.insertCell(1);
      var dataCompra = new Date(listaRelatorioTb1[i].dataCompra);
      var dia = dataCompra.getDate();
      var mes = dataCompra.getMonth() + 1;
      var ano = dataCompra.getFullYear().toString().slice(-2);

      dia = dia < 10 ? '0' + dia : dia;
      mes = mes < 10 ? '0' + mes : mes;

      var dataFormatada = dia + '/' + mes + '/' + ano;

      cellDataCompra.textContent = dataFormatada;

      var cellDataUso = novaLinha.insertCell(2);
      if(listaRelatorioTb1[i].dataUso != null)
      {
        var dataUso = new Date(listaRelatorioTb1[i].dataUso);
        var dia2 = dataUso.getDate();
        var mes2 = dataUso.getMonth() + 1;
        var ano2 = dataUso.getFullYear().toString().slice(-2);
  
        dia2 = dia2 < 10 ? '0' + dia2 : dia2;
        mes2 = mes2 < 10 ? '0' + mes2 : mes2;
  
        var dataFormatada2 = dia2 + '/' + mes2 + '/' + ano2;
  
        cellDataUso.textContent = dataFormatada2;
      }
      else{
        cellDataUso.textContent = "-";
      }
      

      var cellSaldoRestante = novaLinha.insertCell(3);
      if(listaRelatorioTb1[i].status == 'Usado')
      {
          cellSaldoRestante.textContent = 0;
      }
      else if(listaRelatorioTb1[i].status == 'Disponível')
      {
        cellSaldoRestante.textContent = 1;
      }
      }
  }

    
  function gerarLinhaRelatorio2Cliente() {
    var campoNumeroCartao = document.getElementById('campoNumeroCartaoRelatorio');
    var idCartao = campoNumeroCartao.value;
    var tabelaRelatorio2 = document.getElementById('table2');

    for (var i = 0; i < listaRelatorioTb2.length; i++) {
      var novaLinha = tabelaRelatorio2.insertRow();

      var cellNomeRecompensa = novaLinha.insertCell(0);
      cellNomeRecompensa.textContent = listaRelatorioTb2[i].nomeRecompensa;

      var cellDataAquisicao = novaLinha.insertCell(1);
      var dataAquisicao = new Date(listaRelatorioTb2[i].dataAquisicao);
      var dia = dataAquisicao.getDate();
      var mes = dataAquisicao.getMonth() + 1;
      var ano = dataAquisicao.getFullYear().toString().slice(-2);

      dia = dia < 10 ? '0' + dia : dia;
      mes = mes < 10 ? '0' + mes : mes;

      var dataFormatada = dia + '/' + mes + '/' + ano;

      cellDataAquisicao.textContent = dataFormatada;

      var cellDataUso = novaLinha.insertCell(2);
      if(listaRelatorioTb2[i].dataUso != null)
      {
        var dataUso = new Date(listaRelatorioTb2[i].dataUso);
        var dia2 = dataUso.getDate();
        var mes2 = dataUso.getMonth() + 1;
        var ano2 = dataUso.getFullYear().toString().slice(-2);
  
        dia2 = dia2 < 10 ? '0' + dia2 : dia2;
        mes2 = mes2 < 10 ? '0' + mes2 : mes2;
  
        var dataFormatada2 = dia2 + '/' + mes2 + '/' + ano2;
  
        cellDataUso.textContent = dataFormatada2;
  
      }
      else{
        cellDataUso.textContent = "-";
      }
      
      var cellSaldoRestante = novaLinha.insertCell(3);
      if(listaRelatorioTb2[i].status == 'Usado')
      {
          cellSaldoRestante.textContent = 0;
      }
      else if(listaRelatorioTb2[i].status == 'Disponível')
      {
        cellSaldoRestante.textContent = 1;
      }
      }
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


