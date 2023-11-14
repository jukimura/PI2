
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

  async function buscarCartao() {
    var numeroCartao = document.getElementById('campoNumeroCartao').value;
    var divExisteCartao = document.getElementById('cartaoExiste');
    let exibirTextoOK = false;
    console.log(numeroCartao);
  
    try {
      if (numeroCartao == null || numeroCartao == '') {
        alert("Preencha o número do cartão antes de comprar um serviço!");
      }
      else{
            const existe = await existeCartaoNoBanco(numeroCartao);
            console.log('Existe' + existe);
              if (existe) {
                exibirTextoOK = true;
              } else {
                // Desabilita o botão específico dentro da coleção
                exibirTextoOK = false;
              }
          if(exibirTextoOK)
          {
            divExisteCartao.textContent = 'Esses são os serviços que você adquiriu.';
          }else{
            divExisteCartao.textContent = 'Este cartão não existe! Gere um na página de gerar cartão.';
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
  let listaServicosAdquiridos = [];
  let listaNomesServicosAdquiridos = [];

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

  async function encontrarCompras() {
    limparContainer();
    var campoNumeroCartao = document.getElementById("campoNumeroCartao");
    var divExisteCartao = document.getElementById('cartaoExiste');
    try {

      if (campoNumeroCartao.required && (campoNumeroCartao.value == null || campoNumeroCartao.value == '')) {
        alert("Preencha o número do cartão antes de comprar um serviço!");
      } else {
        await buscarCartao();
        if (divExisteCartao.textContent == 'Esses são os serviços que você adquiriu.') { 
          buscaComprasByCartao(campoNumeroCartao.value);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  const btnBusca = document.getElementById('btnBusca');
  btnBusca.addEventListener('click', function () {
    encontrarCompras();
  });
  
  async function buscaComprasByCartao(idCartao) {
    var divExisteCartao = document.getElementById('cartaoExiste');
    console.log(idCartao);
    let url = `http://localhost:3000/getComprasById/${idCartao}`;
  
    try {
      const response = await axios.get(url);
      console.log(' response da request : ', response.data);
      if (response.data == null || response.data == '') {
        divExisteCartao.textContent = 'Sem dados de compras encontrados.';
        return false;
      } else {
        const terceirosValores = response.data.map(vetor => vetor[2]);
        console.log('Terceiros valores:', terceirosValores);
        // Limpa a lista antes de adicionar novos valores
        listaServicosAdquiridos = [];
        for (var i = 0; i < terceirosValores.length; i++) {
          listaServicosAdquiridos.push(terceirosValores[i]);
        }
        console.log('Lista :', listaServicosAdquiridos);
        gerarDivServicoAdquirido();
        return true;
      }
    } catch (error) {
      // Não use alert aqui, apenas lance o erro para ser tratado fora desta função
      throw error;
    }
  }

  async function getServicosName(idServico) {

      let url = `http://localhost:3000/getServicoById/${idServico}`;
  
      try {
        const response = await axios.get(url);
        console.log(' response da request get servico by id: ', response.data);
        if (response.data == null || response.data == '') {
          return false;
        } else {
          listaNomesServicosAdquiridos.push(response.data);
          console.log('Lista :', listaNomesServicosAdquiridos);
          return true;
        }
      } catch (error) {
        // Não use alert aqui, apenas lance o erro para ser tratado fora desta função
        throw error;
      }
  }


  
  async function gerarDivServicoAdquirido() {
    // Limpa o conteúdo anterior
    var campoNumeroCartao = document.getElementById("campoNumeroCartao");
    var idCartao = campoNumeroCartao.value;
    var divContainer = document.getElementById('divContainer');
    divContainer.innerHTML = '';
    listaNomesServicosAdquiridos=[];

    // Gera uma div para cada valor na lista de serviços adquiridos
    for (var i = 0; i < listaServicosAdquiridos.length; i++) {
      await getServicosName(listaServicosAdquiridos[i]);
      var novaDiv = document.createElement('div');
      novaDiv.className = 'servicoComprado'
      // Adiciona conteúdo à div
      novaDiv.textContent = listaNomesServicosAdquiridos[i];
  
      // Cria uma div para o botão 'utilizar'
      var divBtnUtilizar = document.createElement('div');
      divBtnUtilizar.className = 'divBtnUtilizar';
      divBtnUtilizar.innerHTML = '<button id="btnUtilizar">Utlizar</button>';
  
      // Adiciona a div do botão à div principal
      novaDiv.appendChild(divBtnUtilizar);
  
      // Adiciona a div principal ao contêiner
      divContainer.appendChild(novaDiv);
    }
  }
  function limparContainer() {
    var divContainer = document.getElementById('divContainer');
    // Define o conteúdo do container como uma string vazia para remover todas as divs
    divContainer.innerHTML = '';
    // ou
    // divContainer.textContent = '';
  }
  
});

