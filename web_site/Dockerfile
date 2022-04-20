FROM node:alpine AS builder
WORKDIR /app
COPY . .
RUN npm i 
RUN npm run build
# ENV NODE_ENV production
CMD ["npm", "start"]
# # Production image, copy all the files and run next
# FROM node:16.13 AS runner
# WORKDIR /app

# # ENV NODE_ENV production

# # RUN addgroup -g 1001 -S nodejs
# # RUN adduser -S nextjs -u 1001

# # You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
# COPY --from=builder /app/public ./public
# # COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
# COPY --from=builder  /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/environments ./environments
# COPY --from=builder /app/server.js ./server.js

# # USER nextjs

# EXPOSE 3000

# # Next.js collects completely anonymous telemetry data about general usage.
# # Learn more here: https://nextjs.org/telemetry
# # Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1
# CMD ["npm", "start"]