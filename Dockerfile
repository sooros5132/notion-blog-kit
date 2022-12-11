FROM node:16.16.0-alpine AS prod 

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install 

RUN npm run build

CMD ["npm", "run", "start"]

EXPOSE 3000
