// Função para obter a taxa de conversão USD para BRL usando a primeira API
async function getConversionRateFirstAPI() {
  const apiKey = 'WdMier6wBdiYFjw5cYt9EHzqAhfcns';
  const url = `https://www.amdoren.com/api/currency.php?api_key=${apiKey}&from=USD&to=BRL`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.amount) { // Correção: usar data.amount ao invés de data.rate
      return data.amount; // Correção: retornar data.amount ao invés de data.rate
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Função para obter a taxa de conversão USD para BRL usando a segunda API
async function getConversionRateSecondAPI() {
  const apiKey = 'b1d826a2dc81dfbe0081fa94';
  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/USD/BRL`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.conversion_rate) {
      return data.conversion_rate;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Função para obter a taxa de conversão USD para BRL, tentando a segunda API se a primeira falhar
async function getConversionRate() {
  let taxaDeCambio = await getConversionRateFirstAPI();
  if (taxaDeCambio !== null) {
    return taxaDeCambio;
  } else {
    console.log('Primeira API falhou, tentando a segunda API...');
    taxaDeCambio = await getConversionRateSecondAPI();
    if (taxaDeCambio !== null) {
      console.log('Segunda API bem-sucedida.');
      return taxaDeCambio;
    } else {
      console.log('Ambas as APIs falharam.');
      return null;
    }
  }
}

// Função para calcular o valor total da compra com impostos
async function calcularValorTotalCompra() {
  const valorCompraInput = document.getElementById('ValorCompra');
  const resultadoElement = document.getElementById('resultado');
  const icmsElement = document.getElementById('icms');
  const ipiElement = document.getElementById('ipi');
  const markElement = document.getElementById('mark');

  markElement.textContent = 'Aguarde...';

  const taxaDeCambio = await getConversionRate();

  if (taxaDeCambio !== null) {
    markElement.textContent = `R$ ${taxaDeCambio.toFixed(2)}`;
  } else {
    markElement.textContent = 'Não foi possível obter a taxa de câmbio.';
    return;
  }

  const valorCompra = parseFloat(valorCompraInput.value);
  const valorEmDolar = valorCompra / taxaDeCambio;
  let valorTotal;
  let icms;
  let ipi;

  if (valorEmDolar > 50) {
    icms = valorCompra * 0.17;
    valorTotal = valorCompra + icms;
    ipi = valorTotal * 0.60;
    valorTotal += ipi;
  } else {
    icms = valorCompra * 0.17;
    ipi = 0; // Correção: atribuir 0 ao valor do IPI quando valorEmDolar <= 50
    valorTotal = valorCompra + icms;
  }

  resultadoElement.textContent = `O valor total da compra é de R$ ${valorTotal.toFixed(2)}.`;
  icmsElement.textContent = `Valor do ICMS: R$ ${icms.toFixed(2)}.`;
  ipiElement.textContent = `Valor do IPI: R$ ${ipi.toFixed(2)}.`;
}

// Chama a função para calcular o valor total da compra com impostos quando o formulário for enviado
const formulario = document.getElementById('formulario');
formulario.addEventListener('submit', function (event) {
  event.preventDefault(); // Impede o envio do formulário tradicional
  calcularValorTotalCompra();
});

// Atualiza o valor do dólar quando a página é carregada
window.onload = async function () {
  const markElement = document.getElementById('mark');
  markElement.textContent = 'Aguarde...';

  const taxaDeCambio = await getConversionRate();

  if (taxaDeCambio !== null) {
    markElement.textContent = `R$ ${taxaDeCambio.toFixed(2)}`;
  } else {
    markElement.textContent = 'Não foi possível obter a taxa de câmbio.';
  }
};
