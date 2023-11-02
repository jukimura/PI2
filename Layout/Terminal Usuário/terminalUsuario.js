
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

function evitarEnterLimpar(campoInput) {
  var campo = document.getElementById(campoInput);
  console.log(campo);
  var codigo = campo.value;
  console.log(campo.value);
  console.log(campo.keyCode);
  if (campo.keyCode === 13) {
    campo.value = codigo;
  }
}

function gerarCartao(pagina)
{
   var pages = document.getElementsByClassName('conteudo');
   for (var i = 0; i < pages.length; i++) {
     pages[i].classList.remove('visible');
   }

  //inserir logica de gerar cartao
  var exibir = document.getElementById(pagina);
    if (exibir) {
      exibir.classList.add('visible');
    }

    const charset = '0123456789'; 
    let id = ' ';

    for (let i=0; i<5; i++) 
    { 
        //gera um número aleátorio de até 5 números
        const indiceAleatorio = Math.floor(Math.random() * charset.length);
        id += charset.charAt(indiceAleatorio);
    }
    //select na tabela de cartao, if id existe na tabela, gerar outro id
    var divNumeroCartao = document.getElementById('numeroCartao');
    divNumeroCartao.textContent = id;
    return id;
  }

function buscarCartao(codigoCartao) {
  //let codigo = document.getElementById('campoNumeroCartao').value
	let url = `http://localhost:3000/cartao/${codigoCartao}`

  //verificar se o cartão existe
	axios.get(url)
	.then(response => {
    alert('Seu cartão foi encontrado. Adquira nossos serviços abaixo!')
  })
	.catch(error  =>  {
		if (error.response) {
			const msg = new Comunicado (error.response.data.codigo, 
										error.response.data.mensagem, 
										error.response.data.descricao);
			alert(msg.get());
		}	
	})

	//this.preventDefault()
}

function adquirirServico() {
  var campoNumCartao = document.getElementById("campoNumeroCartao");
  var numeroCartao = document.getElementById("campoNumeroCartao").value;
  if(campoNumCartao.required && numeroCartao == null)
  {
      alert("Preencha o número do cartão antes de comprar um serviço!");
  }
  else{
    let objServico = { codigo: parseInt(numeroCartao)};
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
    })
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