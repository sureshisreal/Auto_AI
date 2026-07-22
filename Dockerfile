FROM mcr.microsoft.com/playwright:v1.59.1-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx playwright install --with-deps

CMD ["npm", "test"]
