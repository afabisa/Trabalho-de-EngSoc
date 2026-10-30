# Atelier Marina — Cardápio Digital & Sistema de Encomendas
**Projeto Prático para a Cadeira de Engenharia de Software — UFRJ**

Aplicação web responsiva e *PWA-ready*, projetada com arquitetura limpa e sem dependência de servidores complexos, permitindo execução local instantânea e hospedagem estática direta no **GitHub Pages**.

---

## 📌 1. Visão Geral do Projeto

O sistema digitaliza o cardápio artesanal do **Atelier Marina** (doces e salgados para festas e eventos), reproduzindo a identidade visual clássica em tons de **Azul Marinho (`#172c3c`)**, **Dourado Nobre (`#c99846`)** e **Creme (`#fbf8f2`)**, baseada no material gráfico oficial do ateliê.

Além da simples visualização dos itens, o sistema resolve dores reais de negócio identificadas na operação da confeitaria:
- Cálculo automatizado de porções, centos e gramaturas;
- Aplicação rigorosa das **regras de encomenda** (antecedência mínima e sinal de 50%);
- Geração de mensagens estruturadas para fechamento direto via WhatsApp;
- Painel administrativo intuitivo para manutenção do catálogo sem tocar no código-fonte.

---

## 🎯 2. Engenharia de Requisitos

### Requisitos Funcionais (RF)
- **RF01 - Visualização de Catálogo:** O cliente pode navegar pelos produtos divididos por categorias (*Salgados Artesanais* e *Doces & Sobremesas*).
- **RF02 - Busca Dinâmica:** Pesquisa em tempo real por nome do produto, descrição ou sabores.
- **RF03 - Customização de Itens:** Seleção de variações de porção (ex: *15 unidades*, *Cento Frito*, *Cento Congelado*, *300g*, *1Kg*, *2Kg*) e marcação de sabores desejados.
- **RF04 - Gestão de Carrinho:** Adicionar, incrementar, decrementar e remover itens da encomenda com atualização de totais em tempo real.
- **RF05 - Validação de Data de Entrega:** Bloqueio de datas que violem a regra de antecedência mínima de 3 dias do ateliê.
- **RF06 - Cálculo de Sinal Obrigatório:** Apresentação clara do valor total da encomenda e do valor de reserva de **50% de sinal**.
- **RF07 - Checkout via WhatsApp:** Geração de mensagem formatada com todos os dados da encomenda e abertura automática da conversa com o WhatsApp oficial.
- **RF08 - Painel Administrativo do Lojista:**
  - Autenticação por PIN de segurança (padrão: `1234`).
  - Adição, edição e remoção de produtos e suas variações.
  - Pausa/ativação de itens no cardápio sem excluí-los.
  - Botão de restauração rápida para os dados originais do PDF (*Fail-Safe*).
  - Exportação dos dados em formato JSON.

### Requisitos Não-Funcionais (RNF)
- **RNF01 - Portabilidade & GitHub Pages:** 100% estático (HTML5, CSS3, Vanilla JS), sem necessidade de `npm install`, Node.js ou banco relacional configurado.
- **RNF02 - Persistência Local:** Utilização da API de `LocalStorage` do navegador para manter alterações do catálogo e carrinho do cliente.
- **RNF03 - Responsividade (Mobile-First):** Layout adaptável para smartphones, tablets e desktops.
- **RNF04 - Fidelidade Visual:** Alinhamento estético estrito com o PDF institucional do Atelier Marina.

---

## 📐 3. Regras de Negócio e Domínio Modeladas

| Regra | Descrição no Negócio | Implementação no Código |
| :--- | :--- | :--- |
| **RN01 - Antecedência Mínima** | Encomendas requerem no mínimo 3 dias úteis para planejamento e produção. | `BusinessRules.getMinimumOrderDate()` define `input[type="date"].min = hoje + 3 dias`. Validação impede envio no WhatsApp se a data for inferior. |
| **RN02 - Sinal Obrigatório (50%)** | O pedido só entra na fila de produção mediante 50% de pagamento antecipado. | `BusinessRules.calculateDeposit(total)` extrai 50% e destaca o valor para o cliente antes do fechamento. |
| **RN03 - Modalidade de Entrega** | Retirada no Atelier (grátis) ou Entrega por Uber Moto/Carro (taxa calculada à parte). | Seleção por radio button no checkout; ativa obrigatoriedade do campo de endereço quando Uber é marcado. |
| **RN04 - Variações de Preço e Sabores** | Um mesmo produto possui múltiplos preços por tamanho e combinações de recheios. | Entidade `Product` contém vetor de `variants: [{ name, price }]` e vetor de `flavors: string[]`. |

---

## 🏗️ 4. Arquitetura de Software

O código foi estruturado seguindo o padrão de **Separação de Responsabilidades**:

```text
├── index.html          # Marcação semântica e acessível da vitrine, carrinho e modais
├── styles.css          # Design system com variáveis CSS, tipografia nobre e temas
├── app.js              # Núcleo da aplicação:
│   ├── DEFAULT_CATALOG # Dados pré-carregados fiéis ao cardápio em PDF
│   ├── StorageService  # Camada de abstração de persistência (LocalStorage)
│   ├── BusinessRules   # Regras puras de domínio (sinal, prazos, WhatsApp)
│   ├── AppState        # Estado centralizado reativo
│   └── UI Controllers  # Manipuladores de DOM, modais e eventos
└── assets/
    └── img/            # Imagens reais extraídas diretamente do PDF original
```

---

## 🚀 5. Como Executar e Testar

### Execução Local (Instantânea)
1. Dê um duplo clique no arquivo `index.html` ou abra-o em qualquer navegador (Google Chrome, Firefox, Safari, Edge).
2. Não requer instalação de pacotes ou servidores locais.

### Publicação no GitHub Pages
1. Crie um repositório no GitHub (ex: `atelier-marina-cardapio`).
2. Faça commit e push dos arquivos:
   ```bash
   git init
   git add .
   git commit -m "feat: prototipo cardapio atelier marina"
   git branch -M main
   git remote add origin https://github.com/<seu-usuario>/<seu-repo>.git
   git push -u origin main
   ```
3. No GitHub, vá em **Settings > Pages > Branch: `main` / `root` > Save**.
4. Em poucos segundos, o site estará no ar gratuitamente com HTTPS.

---

## 🔐 6. Acesso ao Painel Lojista
- **Botão:** Localizado no topo direito ("Painel Lojista").
- **PIN Padrão para Avaliação:** `1234`
- **Funcionalidades de Demonstração:**
  - Cadastre um novo produto com variações de preço para verificar a atualização instantânea na vitrine.
  - Utilize o botão **"Restaurar Cardápio Original"** para resetar o catálogo para o estado oficial a qualquer momento.

---

## 💡 7. Sugestões de Extensões Acadêmicas (Trabalhos Futuros)
1. **PWA Completo com Service Worker:** Adicionar manifesto e cache offline via Workbox para abrir o cardápio mesmo sem conexão.
2. **Gateway PIX Automático:** Integrar com webhook do Mercado Pago ou Efí para gerar QR Code dinâmico e confirmar o recebimento do sinal de 50%.
3. **Módulo de Capacidade de Produção:** Limitar o número máximo de encomendas por dia com base nas horas de forno do ateliê.
