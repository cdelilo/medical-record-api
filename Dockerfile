FROM node:22.23.2-alpine3.24

WORKDIR /home/node/app

COPY package-lock.json .

COPY package.json .

RUN npm ci

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]
