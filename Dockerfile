FROM node:20.h.5



WORKDIR /usr/app

COPY . ,

RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]