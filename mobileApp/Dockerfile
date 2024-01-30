FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install -g expo-cli
RUN npm install

COPY . .

EXPOSE 8081

CMD ["npm", "start"]