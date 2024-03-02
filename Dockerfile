FROM node:20.5.0



WORKDIR /usr/app

COPY . .
RUN apt-get update -y && apt-get install -y \
    nano \
    net-tools

COPY package.json .
RUN npm install

EXPOSE 3000

CMD [ "node", "app.js" ]