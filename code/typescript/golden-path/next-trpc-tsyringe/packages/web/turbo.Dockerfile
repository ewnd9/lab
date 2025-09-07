FROM node:22-bookworm-slim
WORKDIR /app
ARG DIST_DIR

COPY ${DIST_DIR}/json .

ENV NODE_ENV=production
RUN apt update && \
    apt install -y dumb-init && \
    corepack enable && \
    yarn install

COPY ${DIST_DIR}/full .

EXPOSE 3000

WORKDIR /app/packages/web
CMD ["dumb-init", "node", "../../node_modules/.bin/next", "start"]


