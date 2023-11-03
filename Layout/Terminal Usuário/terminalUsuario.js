
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

function evitarEnterLimpar(campoInput) { //nao esta funcionando
  var campo = document.getElementById(campoInput);
  console.log(campo);
  var codigo = campo.value;
  console.log(campo.value);
  console.log(campo.keyCode);
  if (campo.keyCode === 13) {
    campo.value = codigo;
  }
}

function gerarCartao(pagina) //terminar de testar depois de conectar o banco
{
    let existeId;
    let podeGerar = false;
    const jaExiste = (idGerado) =>{
      return false;
    };

    do{
      var idGerado = geraCodigo();
      if(jaExiste(idGerado))
      {
        existeId = true;
      }
      else{
        podeGerar = true;
        existeId = false;
      }
    }while(existeId == true);

    if(podeGerar == true && existeId == false)
    {
       /* let objCartao = { idCartao: idGerado };
        let url = `http://localhost:3000/cartao/gerarCartao/${idGerado}`;

        let res = axios.post(url, objCartao)
        .then(response => {
          if (response.data) {
            const msg = new Comunicado (response.data.codigo, 
                                        response.data.mensagem, 
                          response.data.descricao);
            alert(msg.get());
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
*/
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

  function geraCodigo(){ //terminar de testar depois de conectar o banco
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

function buscarCartao(campoNumeroCartao)
{
  var codCartao = document.getElementById(campoNumeroCartao).value;
    alert('Numero cartão' + codCartao);
    
  var divCartaoUtilizado = document.getElementById("cartaoUtilizado");
  divCartaoUtilizado.textContent = 'Cartão sendo utilizado: ' + codCartao;
}


function adquirirServico() {
  var campoNumeroCartao = document.getElementById("campoNumeroCartao");
  var numeroCartao = campoNumeroCartao.value;
  if(campoNumeroCartao.required && (numeroCartao == null || numeroCartao == ''))
  {
      alert("Preencha o número do cartão antes de comprar um serviço!");
  }
  else{
    /*
    let objServico = { codigo: numeroCartao};
    let url = `http://localhost:3000/compra/${numeroCartao}` //post

    let res = axios.post(url, objServico)
    .then(response => {
      if (response.data) {
        const msg = new Comunicado (response.data.codigo, 
                                    response.data.mensagem, 
                      response.data.descricao);
        alert(msg.get());
      }
    })
    .catch(error  =>  {
      
      if (error.response) {
        const msg = new Comunicado (error.response.data.codigo, 
                                    error.response.data.mensagem, 
                      error.response.data.descricao);
        alert(msg.get());
      }
    })*/
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
