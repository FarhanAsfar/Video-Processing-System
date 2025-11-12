FROM node:20

WORKDIR /usr/src/app

COPY ./api/package*.json ./
RUN npm install

COPY ./api .  
COPY ./api/prisma ./prisma

RUN npx prisma generate --schema=./prisma/schema.prisma

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]

# CMD ["npm", "start"]

