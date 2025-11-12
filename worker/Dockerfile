FROM node:20

WORKDIR /usr/src/app

COPY ./worker/package*.json ./
RUN npm install

COPY ./worker .

# Copy the prisma schema from the api folder into the worker image
COPY ./api/prisma ./prisma

RUN npx prisma generate --schema=./prisma/schema.prisma

CMD ["npm", "start"]
