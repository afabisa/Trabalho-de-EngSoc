# Handoff: Atelier Marina — Cardápio Digital & Sistema de Encomendas
**Contexto:** Projeto Prático para a Cadeira de Engenharia de Software — UFRJ  
**Data:** 16 de Outubro de 2026  
**Status do Repositório:** Protótipo funcional finalizado e testado, pronto para GitHub Pages.

---

## 1. Visão Geral e Contexto
O projeto atende aos requisitos da disciplina de Engenharia de Software da UFRJ, digitalizando o cardápio em PDF da confeitaria artesanal **Atelier Marina**.
Foi realizada uma sessão inicial de `/grilling` que definiu:
- Foco em regras de negócio reais (sinal de 50%, antecedência mínima de 3 dias, variações de porção/sabor).
- Arquitetura estática pura (HTML5/CSS3/Vanilla JS) para hospedagem direta no GitHub Pages sem atrito de build ou servidor.
- Painel Lojista para administração dinâmica de produtos via `LocalStorage` com PIN de acesso e recuperação de fábrica.

---

## 2. Artefatos e Estrutura de Arquivos
Consulte os arquivos no diretório de trabalho `C:\Users\gpnob\Downloads\f\es`:

- `index.html`: Interface visual responsiva, vitrine de produtos, modal de customização, drawer de carrinho e modal do painel lojista.
- `styles.css`: Design system com a paleta do PDF (Azul Marinho `#172c3c`, Dourado `#c99846`, Creme `#fbf8f2`) e tipografia serifada/cursiva.
- `app.js`: Núcleo da aplicação contendo:
  - `DEFAULT_CATALOG`: Dados fiéis extraídos do PDF original (8 produtos).
  - `BusinessRules`: Lógica de domínio (prazo de 3 dias, cálculo de sinal de 50%, formatação WhatsApp).
  - `StorageService`: Persistência com `LocalStorage`.
  - `AppState`: Gerenciamento de estado e reatividade.
- `assets/img/`: Logotipo e imagens de produtos extraídos do PDF oficial.
- `package.json`: Scripts para execução de testes (`npm test`) e servidor estático (`npm start`).
- `test_domain.js`: Suite automatizada com 5 testes unitários validando as regras de negócio.
- `readme.md`: Especificação acadêmica completa (Requisitos Funcionais, Não-Funcionais, Tabela de Regras de Negócio, Arquitetura e Guia de Publicação).

---

## 3. Estado de Verificação
- **Testes Unitários:** Todos os 5 testes em `test_domain.js` passando com 100% de sucesso via `npm test`.
- **Compatibilidade GitHub Pages:** Verificado que não há caminhos absolutos com barras iniciais (`/`) que possam quebrar em subdiretórios de repositórios do GitHub.
- **Autenticação Admin:** PIN padrão de demonstração definido em `1234` (armazenado em `StorageService.ADMIN_PIN`).

---

## 4. Próximos Passos Sugeridos
1. Configurar o repositório remoto no GitHub do usuário e ativar o GitHub Pages em **Settings > Pages > Branch: main**.
2. Implementar `manifest.json` e `sw.js` (Service Worker) para habilitar instalação nativa como PWA offline.
3. Adicionar integração opcional com API de pagamento para geração de QR Code PIX dinâmico de sinal.

---

## 5. Suggested Skills
As seguintes skills são recomendadas para as próximas sessões de trabalho:

- **`code-review`**: Executar revisão de código contra os padrões e especificações documentados no `readme.md`.
- **`tdd`**: Caso novas regras de domínio sejam adicionadas (ex: cálculo de frete por CEP/distância ou limite de produção diária).
- **`improve-codebase-architecture`**: Identificar oportunidades de modularização adicional ou migração para TypeScript/componentes caso o escopo acadêmico evolua.
