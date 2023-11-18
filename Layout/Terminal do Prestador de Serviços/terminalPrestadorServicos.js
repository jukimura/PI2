
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

  let listaServicosAdquiridos = [];
  let listaNomesServicosAdquiridos = [];
  let listaServicosAUsar = [];
  let listaComprasAUsar = [];
  let listaCompras = [];


  function inserirServicoNaLista(idServico) {
    listaServicosAUsar.push(idServico);
  }

  function inserirCompraNaLista(idServico) {
    listaComprasAUsar.push(idServico);
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
    let url = `http://localhost:3000/getComprasNaoUsadasById/${idCartao}`;
  
    try {
      const response = await axios.get(url);
      console.log(' response da request : ', response.data);
      if (response.data == null || response.data == '') {
        divExisteCartao.textContent = 'Sem dados de compras encontrados.';
        return false;
      } else {
        console.log('tamanho lista' + listaComprasAUsar.length);
        const comprasId = response.data.map(vetor => vetor[0]);
        for (var i = 0; i < comprasId.length; i++) {
          listaCompras.push(comprasId[i]);
        }
        const servicosId = response.data.map(vetor => vetor[5]);
        // Limpa a lista antes de adicionar novos valores
        listaServicosAdquiridos = [];
        listaServicosAUsar = [];
        for (var i = 0; i < servicosId.length; i++) {
          listaServicosAdquiridos.push(servicosId[i]);
        }
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
        if (response.data == null || response.data == '') {
          return false;
        } else {
          listaNomesServicosAdquiridos.push(response.data);
          return true;
        }
      } catch (error) {
        // Não use alert aqui, apenas lance o erro para ser tratado fora desta função
        throw error;
      }
  }


  function configurarOnClickBtnUtilizar(idCompra, btnUtilizar, idServico) {
    return function() {
      console.log('Botão clicado para o serviço com ID:', idServico);
      console.log('Botão clicado para a compra com ID: ', idCompra);
      inserirServicoNaLista(idServico);
      console.log('Tamanho lista servicos: ', listaServicosAdquiridos);
      inserirCompraNaLista(idCompra);
      console.log('Tamanho lista compras', listaComprasAUsar);
      alert('Serviço pronto para utilização!');
      btnUtilizar.disabled = true;
    };
  }

 async function configurarFinalizar() {
    var campoNumeroCartao = document.getElementById("campoNumeroCartao");
    console.log('Botão "Finalizar" clicado');
    if(listaComprasAUsar == '' )
    {
      alert('Você não selecionou nenhum serviço!');
    }
    else
    {
      if(listaComprasAUsar.length == 3)
      {
        //logica de inserir na tabela bonificacao a recompensa onde qtd usos = 3
        for(let i = 0; i < listaComprasAUsar.length; i++)
        {
          console.log('servico sendo editado', listaComprasAUsar[i]);
          await registrarUso(listaComprasAUsar[i], campoNumeroCartao.value);
        }
        alert('Funcionou');
        encontrarCompras();

      }else if(listaComprasAUsar.length == 4)
      {
        //logica de inserir na tabela bonificacao a recompensa onde qtd usos = 4
        alert('4');
      }else if(listaComprasAUsar.length >= 5)
      {
        //logica de inserir na tabela bonificacao a recompensa onde qtd usos = 4

        for(let i = 0; i < listaComprasAUsar.length; i++)
        {
          console.log('servico sendo editado', listaComprasAUsar[i]);
          await registrarUso(listaComprasAUsar[i], campoNumeroCartao.value);
        }
        alert('Funcionou');
        encontrarCompras();
      }
      else{
        for(let i = 0; i < listaComprasAUsar.length; i++)
        {
          console.log('servico sendo editado', listaComprasAUsar[i]);
          await registrarUso(listaComprasAUsar[i], campoNumeroCartao.value);
        }
        alert('Funcionou');
        encontrarCompras();
      }
    }
  }

  async function registrarUso(idCompra, numeroCartao) {

    let objCompra = { idCompra: idCompra};
    console.log(objCompra);
    let url = `http://localhost:3000/registrarUso/${numeroCartao}` //post

    let res = axios.patch(url, objCompra)
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
  }
  
  async function gerarDivServicoAdquirido() {
    // Limpa o conteúdo anterior
    var campoNumeroCartao = document.getElementById("campoNumeroCartao");
    var idCartao = campoNumeroCartao.value;
    var divContainer = document.getElementById('divContainer');
    divContainer.innerHTML = '';
    listaNomesServicosAdquiridos=[];

    var divTextoServicos = document.createElement('div');
    divTextoServicos.textContent = 'Serviços';
    divTextoServicos.className = 'textoServicosERecompensas';
    divContainer.appendChild(divTextoServicos);

    // Gera uma div para cada valor na lista de serviços adquiridos
    for (var i = 0; i < listaServicosAdquiridos.length; i++) {
      console.log('testeeee', listaComprasAUsar.length);
      await getServicosName(listaServicosAdquiridos[i]);
      var divServico = document.createElement('div');
      divServico.className = 'servicoComprado';
      divServico.textContent = listaNomesServicosAdquiridos[i];
      divServico.id = listaCompras[i];
    
      var divBtnUtilizar = document.createElement('div');
      divBtnUtilizar.className = 'divBtnUtilizar';
      
      var btnUtilizar = document.createElement('button');
      btnUtilizar.id = 'btnUtilizar';
      btnUtilizar.textContent = 'Utilizar';
    
      // Configurar o evento onclick para o botão
      console.debug('id da compra', divServico.id)
      btnUtilizar.onclick = configurarOnClickBtnUtilizar(divServico.id, btnUtilizar, listaNomesServicosAdquiridos[i]);
    
      divBtnUtilizar.appendChild(btnUtilizar);
    
      divServico.appendChild(divBtnUtilizar);
      divContainer.appendChild(divServico);
    }
    var divBtnFinalizar = document.createElement('div');
    divBtnFinalizar.className = 'btnFinalizar';

    var btnFinalizar = document.createElement('button');
    btnFinalizar.id = 'btnFinalizarUso';
    btnFinalizar.className = 'btnFinalizarUso';
    btnFinalizar.textContent = 'Finalizar escolhas!';

    // Configurar o evento onclick para o botão "Finalizar"
    btnFinalizar.onclick = configurarFinalizar;

    divBtnFinalizar.appendChild(btnFinalizar);

    // Adicionar o botão "Finalizar" ao contêiner
    divContainer.appendChild(divBtnFinalizar);
  }

  function limparContainer() {
    var divContainer = document.getElementById('divContainer');
    // Define o conteúdo do container como uma string vazia para remover todas as divs
    divContainer.innerHTML = '';
    // ou
    // divContainer.textContent = '';
  }
  
});
