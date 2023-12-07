
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

  let listaComprasByCartao = [];
  let listaComprasSelecionadas = [];
  let listaRecompensasByCartao = [];
  let listaRecompensasSelecionadas = [];

  //SERVICOS

  const btnBusca = document.getElementById('btnBusca');
  btnBusca.addEventListener('click', function () {
    encontrarCompras();
    encontrarRecompensas();
  });

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

  async function buscaComprasByCartao(idCartao) {
    listaComprasSelecionadas = [];
    listaComprasByCartao = [];
    var divExisteCartao = document.getElementById('cartaoExiste');
    let url = `http://localhost:3000/getComprasNaoUsadasById/${idCartao}`;
  
    try {
      const response = await axios.get(url);
      console.log(' response da request : ', response.data);
      if (response.data == null || response.data == '') {
        divExisteCartao.textContent = 'Sem dados de compras encontrados.';
        return false;
      } else {
        console.log(response.data);
        const comprasId = response.data.map(vetor => vetor[0]);
        const dataCompras = response.data.map(vetor => vetor[1]);
        const idServicos = response.data.map(vetor => vetor[5]);
        for (var i = 0; i < comprasId.length; i++) {
          console.log('id servico', idServicos[i]);
          let nomeServicos = await getServicosName(idServicos[i]);
          adicionarCompra(comprasId[i], nomeServicos, dataCompras[i],idServicos[i]);
        }
        console.log('LISTA COMPRAS', listaComprasByCartao);
        gerarDivServicoAdquirido();
        return true;
      }
    } catch (error) {
      throw error;
    }
  }

  function adicionarCompra(idCompra, nomeServico, dataCompra, idServico) {
    let compra = { idCompra: idCompra, nomeServico: nomeServico, dataCompra: dataCompra ,idServico: idServico };
    listaComprasByCartao.push(compra);
  }

  async function getServicosName(idServico) {
    let url = `http://localhost:3000/getServicoById/${idServico}`;
  
    try {
      const response = await axios.get(url);
      if (response.data == null || response.data == '') {
        return null; // Retorna null se o serviço não for encontrado
      } else {
        return response.data; // Retorna o nome do serviço
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

    var divTextoServicos = document.createElement('div');
    divTextoServicos.textContent = 'Serviços';
    divTextoServicos.className = 'textoServicosERecompensas';
    divContainer.appendChild(divTextoServicos);

    // Gera uma div para cada valor na lista de serviços adquiridos
    for (var i = 0; i < listaComprasByCartao.length; i++) {
      var divServico = document.createElement('div');
      divServico.className = 'servicoComprado';
      divServico.textContent = listaComprasByCartao[i].nomeServico;
      divServico.id = listaComprasByCartao[i].idCompra;
    
      var divBtnUtilizar = document.createElement('div');
      divBtnUtilizar.className = 'divBtnUtilizar';
      
      var btnUtilizar = document.createElement('button');
      btnUtilizar.id = 'btnUtilizar';
      btnUtilizar.textContent = 'Utilizar';
    
      // Configurar o evento onclick para o botão
      console.debug('id da compra', divServico.id)
      btnUtilizar.onclick = configurarOnClickBtnUtilizar(listaComprasByCartao[i].idCompra, btnUtilizar, listaComprasByCartao[i].dataCompra, listaComprasByCartao[i].idServico);
    
      divBtnUtilizar.appendChild(btnUtilizar);
    
      divServico.appendChild(divBtnUtilizar);
      divContainer.appendChild(divServico);
    }

    var saldoRestante = document.createElement('div');
    saldoRestante.textContent = 'Saldo total restante: ' + listaComprasByCartao.length;
    saldoRestante.id='saldoRestante';
    divContainer.appendChild(saldoRestante);


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


  
  function configurarOnClickBtnUtilizar(idCompra, btnUtilizar, dataCompra, idServico) {
    return function() {
      inserirCompraNaLista(idCompra, dataCompra, idServico);
      console.log('Tamanho lista servicos: ', listaComprasSelecionadas);
      alert('Serviço pronto para utilização!');
      btnUtilizar.disabled = true;
    };
  }
  
  function inserirCompraNaLista(idCompra, dataCompra, idServico) {
      let compra = { idCompra: idCompra, dataCompra: dataCompra, idServico: idServico};
      listaComprasSelecionadas.push(compra);
    } 

  async function configurarFinalizar() {
    console.log('entrou finalizar');
    var campoNumeroCartao = document.getElementById("campoNumeroCartao");
    if(listaComprasSelecionadas == '')
    {
      alert('Você não selecionou nenhum serviço!');
    }
    else
    {
      if(listaComprasSelecionadas.length == 3)
      {
        let qtd_usos = await getRecompensaByQtd(3);
        const idRecompensa = qtd_usos[0][0];
        await inserirRecompensaNoBanco(campoNumeroCartao.value, idRecompensa);
        for(let i = 0; i < listaComprasSelecionadas.length; i++)
        {
          console.log('servico sendo editado', listaComprasSelecionadas[i]);
          await registrarUso(listaComprasSelecionadas[i].idCompra, campoNumeroCartao.value);
        }
        listaComprasSelecionadas = [];
        listaComprasByCartao = [];
        alert('Recompensa recebida!!');
        encontrarCompras();
        encontrarRecompensas();
      }else if(listaComprasSelecionadas.length == 4)
      {
        qtd_usos = await getRecompensaByQtd(4);
        const idRecompensa = qtd_usos[0][0];
        await inserirRecompensaNoBanco(campoNumeroCartao.value, idRecompensa);
        for(let i = 0; i < listaComprasSelecionadas.length; i++)
        {
          console.log('servico sendo editado', listaComprasSelecionadas[i]);
          await registrarUso(listaComprasSelecionadas[i].idCompra, campoNumeroCartao.value);
        }
        listaComprasSelecionadas = [];
        listaComprasByCartao = [];
        alert('Recompensa recebida!!');
        encontrarCompras();
        encontrarRecompensas();
      }else if(listaComprasSelecionadas.length >= 5)
      {
        qtd_usos = await getRecompensaByQtd(5);
        const idRecompensa = qtd_usos[0][0];
        await inserirRecompensaNoBanco(campoNumeroCartao.value, idRecompensa);
        for(let i = 0; i < listaComprasSelecionadas.length; i++)
        {
          console.log('servico sendo editado', listaComprasSelecionadas[i]);
          await registrarUso(listaComprasSelecionadas[i].idCompra, campoNumeroCartao.value);
        }
        listaComprasSelecionadas = [];
        listaComprasByCartao = [];
        alert('Recompensa recebida!!');
        encontrarCompras();
        encontrarRecompensas();
      }
      else{
        for(let i = 0; i < listaComprasSelecionadas.length; i++)
        {
          console.log('servico sendo editado', listaComprasSelecionadas[i].idCompra);
          await registrarUso(listaComprasSelecionadas[i].idCompra, campoNumeroCartao.value);
        }
        listaComprasSelecionadas = [];
        listaComprasByCartao = [];
        alert('Utilização finalizada!');
        encontrarCompras();
      }
    }
  }

  async function getRecompensaByQtd(Qtd_minima_usos) {
    let url = `http://localhost:3000/getRecompensaByQtd/${Qtd_minima_usos}`;
  
    try {
      const response = await axios.get(url);
      console.log(' response da request : ', response.data);
      if (response.data == null || response.data == '') {
        return false;
      } else {
        return response.data;
      }
    } catch (error) {
      // Não use alert aqui, apenas lance o erro para ser tratado fora desta função
      throw error;
    }
  }

  async function inserirRecompensaNoBanco(numeroCartao, idRecompensa) {

    console.log('ENTROU aqui no inserir');
    let objBonificacao = { idRecompensa: idRecompensa};
    let url = `http://localhost:3000/registroRecompensa/${numeroCartao}` //post

    let res = axios.post(url, objBonificacao)
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
    console.log('Inserindo bonificação no banco de dados:', objBonificacao);
  }


  async function registrarUso(idCompra, numeroCartao) {

    console.log('Id compra', idCompra);
    console.log('id cartao', numeroCartao);
    let objCompra = { idCompra: idCompra};
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

  async function encontrarRecompensas() {
    limparContainerRecompensas();
    var campoNumeroCartao = document.getElementById("campoNumeroCartao");
    var divExisteCartao = document.getElementById('cartaoExiste');
    try {

      if (campoNumeroCartao.required && (campoNumeroCartao.value == null || campoNumeroCartao.value == '')) {
        alert("Preencha o número do cartão antes de comprar um serviço!");
      } else {
        await buscarCartao();
        if (divExisteCartao.textContent == 'Esses são os serviços que você adquiriu.') {
          buscaRecompensasByCartao(campoNumeroCartao.value);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function buscaRecompensasByCartao(idCartao) {
    var divExisteCartao = document.getElementById('cartaoExiste');
    let url = `http://localhost:3000/getRecompensasDisponiveis/${idCartao}`;
  
    try {
      const response = await axios.get(url);
      console.log(' response da request : ', response.data);
      if (response.data == null || response.data == '') {
        return false;
      } else {
        const idBonificacao = response.data.map(vetor => vetor[0]);
        const dataAquisicao = response.data.map(vetor => vetor[3]);
        const nomeRecompensa = response.data.map(vetor => vetor[7]);
        const idRecompensa = response.data.map(vetor => vetor[8]);

        listaRecompensasByCartao = [];
        for (var i = 0; i < idBonificacao.length; i++) {
          adicionarRecompensa(idBonificacao[i], nomeRecompensa[i], dataAquisicao[i], idRecompensa[i]);
        }
        gerarDivRecompensasAdquiridas();
        return true;
      }
    } catch (error) {
      throw error;
    }
  }

  function adicionarRecompensa(idBonificacao, nomeRecompensa, dataAquisicao, idRecompensa) {
    let recompensa = { idBonificacao: idBonificacao, nomeRecompensa: nomeRecompensa, dataAquisicao: dataAquisicao, idRecompensa: idRecompensa};
    listaRecompensasByCartao.push(recompensa);
  }

  async function gerarDivRecompensasAdquiridas() {
    // Limpa o conteúdo anterior
    var campoNumeroCartao = document.getElementById("campoNumeroCartao");
    var idCartao = campoNumeroCartao.value;
    var divContainerRecompensas = document.getElementById('divContainerRecompensas');
    divContainerRecompensas.innerHTML = '';

    var divTextoRecompensas = document.createElement('div');
    divTextoRecompensas.textContent = 'Recompensas';
    divTextoRecompensas.className = 'textoServicosERecompensas';
    divContainerRecompensas.appendChild(divTextoRecompensas);

    // Gera uma div para cada valor na lista de serviços adquiridos
    for (var i = 0; i < listaRecompensasByCartao.length; i++) {
      var divRecompensa = document.createElement('div');
      divRecompensa.className = 'recompensaAdquirida';
      divRecompensa.textContent = listaRecompensasByCartao[i].nomeRecompensa;
      divRecompensa.id = listaRecompensasByCartao[i].idBonificacao;
    
      var divBtnUtilizarRecompensa = document.createElement('div');
      divBtnUtilizarRecompensa.className = 'divBtnUtilizar';
      
      var btnUtilizarRecompensa = document.createElement('button');
      btnUtilizarRecompensa.className = 'btnUtilizar';
      btnUtilizarRecompensa.id = 'btnUtilizarRecompensa';
      btnUtilizarRecompensa.textContent = 'Utilizar';
    
      console.debug('id da Recompensa', divRecompensa.id);
      console.debug('lista recompensas adquiridas [i]', listaRecompensasSelecionadas[i]);
      btnUtilizarRecompensa.onclick = configurarOnClickBtnUtilizarRecompensa(listaRecompensasByCartao[i].idBonificacao, btnUtilizarRecompensa, listaRecompensasByCartao[i].dataAquisicao, listaRecompensasByCartao[i].idRecompensa);
    
      divBtnUtilizarRecompensa.appendChild(btnUtilizarRecompensa);
    
      divRecompensa.appendChild(divBtnUtilizarRecompensa);
      divContainerRecompensas.appendChild(divRecompensa);
    }

    var saldoRestante = document.createElement('div');
    saldoRestante.textContent = 'Saldo total restante: ' + listaRecompensasByCartao.length;
    saldoRestante.id='saldoRestanteRecompensas';
    divContainerRecompensas.appendChild(saldoRestante);

    var divBtnFinalizarRecompensa = document.createElement('div');
    divBtnFinalizarRecompensa.className = 'btnFinalizar';

    var btnFinalizarRecompensa = document.createElement('button');
    btnFinalizarRecompensa.id = 'btnFinalizarUso';
    btnFinalizarRecompensa.className = 'btnFinalizarUso';
    btnFinalizarRecompensa.textContent = 'Finalizar escolhas!';

    btnFinalizarRecompensa.onclick = configurarFinalizarRecompensa;

    divBtnFinalizarRecompensa.appendChild(btnFinalizarRecompensa);

    divContainerRecompensas.appendChild(divBtnFinalizarRecompensa);
  }

  function configurarOnClickBtnUtilizarRecompensa(idBonificacao, btnUtilizarRecompensa, dataAquisicao, idRecompensa) {
    return function() {

      const hoje = new Date();
      const data_Aquisicao = new Date(dataAquisicao);

      if(
      data_Aquisicao.getDate() === hoje.getDate() &&
      data_Aquisicao.getMonth() === hoje.getMonth() &&
      data_Aquisicao.getFullYear() === hoje.getFullYear())
      {
        alert('Não é possível utilizar essa recompensa hoje! Utilize-a no próximo retorno :)');
        btnUtilizarRecompensa.disabled = true;
      }
      else{
        inserirRecompensaNaLista(idBonificacao, dataAquisicao, idRecompensa);
        console.log('Lista recompensas: ', listaRecompensasSelecionadas);
        alert('Recompensa pronta para uso. Quando terminar sua escolha de recompensas para uso, finalize a utilização');
        btnUtilizarRecompensa.disabled = true;
      }
    };
  }

  function inserirRecompensaNaLista(idBonificacao, dataAquisicao, idRecompensa) {
    let recompensa = { idBonificacao: idBonificacao, dataAquisicao: dataAquisicao, idRecompensa: idRecompensa};
    listaRecompensasSelecionadas.push(recompensa);
  } 

  async function configurarFinalizarRecompensa() {
    var campoNumeroCartao = document.getElementById("campoNumeroCartao");
    if(listaRecompensasSelecionadas == '')
    {
      alert('Você não selecionou nenhuma recompensa!');
    }
    else{
      for(let i = 0; i < listaRecompensasSelecionadas.length; i++)
      {
        console.log('Recompensa sendo editada', listaRecompensasSelecionadas[i].idBonificacao);
        await registrarUsoRecompensa(listaRecompensasSelecionadas[i].idBonificacao, campoNumeroCartao.value);
      }
      listaRecompensasSelecionadas = [];
      listaRecompensasByCartao = [];
      alert('Utilização finalizada!');
      encontrarRecompensas();
    }
    
  }

  async function registrarUsoRecompensa(idBonificacao, numeroCartao) {

    let objBonificacao = { idBonificacao: idBonificacao};
    let url = `http://localhost:3000/registrarUsoRecompensa/${numeroCartao}` //post

    let res = axios.patch(url, objBonificacao)
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



  function limparContainer() {
    var divContainer = document.getElementById('divContainer');
    divContainer.innerHTML = '';
  }

  function limparContainerRecompensas() {
    var divContainer = document.getElementById('divContainerRecompensas');
    // Define o conteúdo do container como uma string vazia para remover todas as divs
    divContainer.innerHTML = '';
    // ou
    // divContainer.textContent = '';
  }
  
});


