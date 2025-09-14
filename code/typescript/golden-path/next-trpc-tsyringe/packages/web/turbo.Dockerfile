FROM node:22-bookworm-slim
WORKDIR /app
ARG DIST_DIR

RUN apt-get update && \
    apt-get install -y --no-install-recommends dumb-init && \
    rm -rf /var/lib/apt/lists/* && \
    corepack enable

COPY ${DIST_DIR}/json .

ENV NODE_ENV=production
RUN yarn install && \
    rm -rf /root/.yarn

COPY ${DIST_DIR}/full .

EXPOSE 3000

WORKDIR /app/packages/web
CMD ["dumb-init", "node", "../../node_modules/.bin/next", "start"]


