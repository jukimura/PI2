
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
        await inserirServicoNoBanco(listaDeServicos[i], numeroCartao);
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
});