FROM oven/bun:1
WORKDIR /app

RUN apt update && \
  apt install -y dumb-init

COPY package.json .

ENV NODE_ENV=production
RUN bun install

COPY . .

EXPOSE 3000
CMD ["dumb-init", "bun", "./index.js"]
