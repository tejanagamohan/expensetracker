FROM node:22.6-alpine3.19

WORKDIR /app

COPY . .

EXPOSE 8600

RUN npm i

ENV APP_ENDPOINT="http://localhost:8600/"

CMD ["npm", "start"]
