# Atlas — Interactive Trip Builder

Projeto autoral Front-end reconstruído em React, com integração real à Open-Meteo API.

## Tecnologias

- React
- Vite
- JavaScript
- CSS
- Open-Meteo Geocoding API
- Open-Meteo Forecast API
- localStorage

## O que a API faz

Ao selecionar um destino, o app:
1. Busca a cidade na Geocoding API.
2. Obtém latitude, longitude e fuso horário.
3. Usa essas coordenadas na Forecast API.
4. Exibe temperatura atual e previsão dos próximos dias.

## Funcionalidades

- Aplicação React componentizada
- Fluxo de planejamento em 5 etapas
- Dados meteorológicos reais via API
- Estados controlados com React
- Validação de etapas
- Interesses múltiplos
- Orçamento dinâmico
- Geração de itinerário
- localStorage
- Layout responsivo
- GitHub Actions preparado para deploy do Vite no Pages

## Rodar localmente

```bash
npm install
npm run dev
```

Depois abra o endereço exibido pelo Vite.

## Build

```bash
npm run build
```
