FROM node:22-slim as base

WORKDIR /app

COPY . .

RUN npm i

RUN npm run build

FROM python3.10.9-slim as runner

WORKDIR /app

COPY --from=base /app/dist .

EXPOSE 3000

CMD ["python3","-m", "http.server", "3000"]