FROM node:18-alpine

WORKDIR /app

COPY index.html .
COPY assets ./assets
COPY src ./src

RUN npm install -g http-server

EXPOSE 8090

CMD ["http-server", ".", "-p", "8090", "-c-1"]
