# Atlas Trip Builder

Projeto desenvolvido durante meus estudos de React para praticar criação de componentes, estados, formulários e consumo de API.

A ideia do Atlas é montar um planejamento simples de viagem em etapas. O usuário escolhe o destino, as datas, com quem vai viajar, interesses e orçamento. No final, o projeto gera uma sugestão de roteiro e uma divisão do orçamento.

## Tecnologias usadas

- React
- JavaScript
- CSS
- Vite
- Open-Meteo API
- localStorage

## O que pratiquei

- Componentes em React
- `useState`
- Eventos e formulários
- Renderização condicional
- Listas com `map()`
- Consumo de API com `fetch` e `async/await`
- Tratamento de erros
- Salvamento de dados no `localStorage`
- Responsividade

## Funcionalidades

- Planejamento de viagem em 5 etapas
- Seleção de destino
- Consulta de clima pela Open-Meteo
- Escolha de datas, companhia e interesses
- Definição de orçamento
- Geração de roteiro de até 7 dias
- Estimativa de gastos
- Dados da viagem salvos no navegador

## Como rodar

```bash
npm install
npm run dev
```

Depois, abra no navegador o endereço mostrado pelo Vite.

## Observação

O roteiro e os valores apresentados são exemplos gerados para fins de estudo. Os dados de clima são consultados na Open-Meteo API.
