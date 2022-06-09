FROM node:14.17.6-alpine
WORKDIR /app
COPY ./app/package.json ./app/yarn.lock /app/
RUN yarn install
