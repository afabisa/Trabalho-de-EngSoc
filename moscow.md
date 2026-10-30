# Atelier Marina — Desejos das Partes Interessadas e Classificação MoSCoW

## 1. Os 5 Desejos das Partes Interessadas

1. **Cliente:** Ver fotos e preços no celular pra escolher sem precisar pedir PDF no zap.
2. **Confeiteira (Marina):** Travar pedidos com menos de 3 dias pra dar tempo de comprar ingrediente e assar tudo.
3. **Confeiteira & Financeiro:** Cobrar 50% de sinal no PIX antes de produzir pra não tomar calote.
4. **Cliente & Confeiteira:** Mandar o pedido pronto pro WhatsApp sem ter que redigitar tudo na conversa.
5. **Confeiteira & Admin:** Mudar preço e esconder produto que acabou usando uma senha simples (PIN 1234).

---

## 2. Priorização dos Requisitos pelo Método MoSCoW

| O que o sistema faz | Quem usa | MoSCoW | Por quê? |
| :--- | :--- | :---: | :--- |
| **Cardápio com foto e preço** | Cliente | **Must** | Sem isso nem tem site. |
| **Escolher tamanho e sabores** | Cliente | **Must** | Precisa saber quanto e do que o cliente quer. |
| **Carrinho somando o total** | Cliente | **Must** | Pro cliente saber quanto tá dando a conta. |
| **Trava de antecedência (mínimo 3 dias)** | Confeiteira | **Must** | Pra ninguém pedir cento de salgado pra amanhã. |
| **Cálculo de 50% de sinal na tela** | Confeiteira / Financeiro | **Must** | Pra garantir o pagamento antes de gastar insumo. |
| **Botão de mandar pedido pronto pro zap** | Cliente / Confeiteira | **Must** | É onde a venda realmente fecha. |
| **Buscar produto por nome** | Cliente | **Should** | Ajuda a achar rápido, mas dá pra rolar a tela. |
| **Escolher retirar no local ou entrega Uber** | Cliente | **Should** | Facilita a entrega, mas dá pra combinar no zap. |
| **Painel com PIN pra mudar preço e pausar item** | Confeiteira | **Should** | Quebra um galho, mas o cardápio padrão já funciona. |
| **Botão de resetar pro cardápio original** | Confeiteira | **Should** | Bom pra corrigir se fizer besteira no painel. |
| **Exportar produtos em JSON** | Admin | **Could** | Perfumaria de backup. |
| **PIX automático com QR Code dinâmico** | Cliente / Financeiro | **Could** | Seria legal, mas mandar a chave no zap já resolve. |
| **Servidor backend e banco de dados SQL** | Desenvolvedor | **Won't** | Não vamos fazer, o site roda grátis no GitHub Pages. |
| **Aplicativo pra baixar na Play Store** | Cliente | **Won't** | Desnecessário, o site já abre certinho no celular. |
