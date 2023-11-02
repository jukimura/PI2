
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
  

  function adquirirServico() {
    var campoNumCartao = document.getElementById("campoNumeroCartao");
    if(campoNumCartao.required)
    {
      alert("Preencha o número do cartão antes de comprar um serviço!");
    }
    //inserir aqui o método para adicionar na tabela
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

  //alert("Cartão Gerado com sucesso!");
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