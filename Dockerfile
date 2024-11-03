# FROM oven/bun:latest
# WORKDIR /app
# COPY package*.json ./
# COPY bun.lockb ./
# COPY prisma ./prisma/
# RUN bun install
# COPY . .

# CMD ["/bin/sh", "-c", "\
#     sleep 10 && \
#     bunx prisma generate && \
#     bunx prisma migrate deploy && \
#     bun run src/index.ts \
# "]

# EXPOSE 80