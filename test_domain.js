/**
 * Testes Unitários de Regras de Domínio (Engenharia de Software - UFRJ)
 * Executado via Node.js
 */

const assert = require("assert");

// Simulação de ambiente DOM para carregar o módulo
global.document = {
  addEventListener: () => {},
  getElementById: () => null,
  querySelectorAll: () => []
};
global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};
global.window = {};

const { BusinessRules, DEFAULT_CATALOG } = require("./app.js");

console.log("=== INICIANDO TESTES DE REGRAS DE NEGÓCIO ===");

// Teste 1: Regra de Antecedência Mínima (3 dias)
const minDateStr = BusinessRules.getMinimumOrderDate();
const today = new Date();
const minDate = new Date(minDateStr + "T00:00:00");
const diffDays = Math.round((minDate - today) / (1000 * 60 * 60 * 24));
assert(diffDays >= 2 && diffDays <= 4, `Data mínima deveria ser ~3 dias no futuro. Recebido: ${diffDays} dias`);
console.log("✔ Teste 1 Passou: Prazo mínimo de 3 dias de antecedência validado com sucesso.");

// Teste 2: Validação de Data
assert.strictEqual(BusinessRules.isValidOrderDate(minDateStr), true, "Data mínima deve ser válida");
assert.strictEqual(BusinessRules.isValidOrderDate("2020-01-01"), false, "Data no passado deve ser inválida");
console.log("✔ Teste 2 Passou: Validador de data de entrega validado.");

// Teste 3: Sinal Obrigatório de 50%
const totalOrder = 240.00;
const signal = BusinessRules.calculateDeposit(totalOrder);
assert.strictEqual(signal, 120.00, "Sinal deve ser exatamente 50% do total");
console.log("✔ Teste 3 Passou: Cálculo de 50% de sinal de reserva validado.");

// Teste 4: Catálogo Padrão
assert.strictEqual(DEFAULT_CATALOG.length, 8, "Devem existir 8 produtos padrão do PDF");
const salgados = DEFAULT_CATALOG.filter(p => p.category === "salgados");
const doces = DEFAULT_CATALOG.filter(p => p.category === "doces");
assert.strictEqual(salgados.length, 4, "Devem existir 4 tipos de salgados");
assert.strictEqual(doces.length, 4, "Devem existir 4 tipos de doces");
console.log("✔ Teste 4 Passou: Catálogo padrão do Atelier Marina carregado corretamente.");

// Teste 5: Geração de Mensagem do WhatsApp
const sampleOrder = {
  items: [
    {
      productName: "Salgados Assados",
      variantName: "Cento",
      quantity: 1,
      unitPrice: 60.0,
      total: 60.0,
      flavors: ["Queijo e Presunto", "Frango com Catupiry"],
      notes: "Bem assados"
    }
  ],
  customer: { name: "Maria Silva", phone: "(21) 98888-7777" },
  delivery: {
    type: "Retirada no Atelier",
    date: minDateStr,
    time: "Tarde (13:00 às 17:00)",
    address: ""
  },
  payment: "PIX",
  subtotal: 60.0,
  deposit: 30.0,
  remaining: 30.0
};
const encoded = BusinessRules.buildWhatsAppMessage(sampleOrder);
const decoded = decodeURIComponent(encoded);
assert(decoded.includes("Maria Silva"), "Mensagem deve conter o nome do cliente");
assert(decoded.includes("Salgados Assados"), "Mensagem deve conter o nome do produto");
assert(decoded.includes("Sinal para Reserva (50%):"), "Mensagem deve conter o valor do sinal");
assert(decoded.includes("R$ 30,00"), "Mensagem deve exibir R$ 30,00 de sinal");
console.log("✔ Teste 5 Passou: Geração de mensagem formatada para WhatsApp validada.");

console.log("=== TODOS OS 5 TESTES PASSARAM COM SUCESSO! ===");
