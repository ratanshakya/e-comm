# ─── Stage 1: Install dependencies ───────────────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# ─── Stage 2: Build the app ───────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time env vars (public only; secrets go in runner stage)
ARG NEXT_PUBLIC_STORE_NAME="Shree Kanha Divine"
ARG NEXT_PUBLIC_STORE_TAGLINE="Vrindavan Handcrafted Poshak & Shringar"
ENV NEXT_PUBLIC_STORE_NAME=$NEXT_PUBLIC_STORE_NAME
ENV NEXT_PUBLIC_STORE_TAGLINE=$NEXT_PUBLIC_STORE_TAGLINE

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ─── Stage 3: Production runner ───────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Copy only the standalone output (minimal footprint)
COPY --from=builder /app/public                                    ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone    ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static        ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
