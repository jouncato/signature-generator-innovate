FROM node:18-alpine

WORKDIR /app

COPY index.html .
COPY assets ./assets
COPY src ./src

RUN npm install -g http-server

# Railway inyecta la variable PORT; fallback a 8090 para uso local
ENV PORT=8090
EXPOSE 8090

# Shell form para que $PORT se expanda en runtime
CMD http-server . -p ${PORT} -a 0.0.0.0 -c-1
