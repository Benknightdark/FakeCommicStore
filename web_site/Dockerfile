FROM node:alpine AS builder
WORKDIR /app
COPY . .
RUN npm i 
RUN npm run build
CMD ["npm", "start"]
# FROM node:alpine AS deps
# RUN apk add git
# WORKDIR /app
# COPY package.json  ./  
# RUN npm i 

# FROM node:16 AS builder
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .
# RUN npm run build 

# FROM node:16-alpine AS runner
# WORKDIR /app
# ENV NODE_ENV production
# RUN addgroup --system --gid 1001 webgroup
# RUN adduser --system --uid 1001 webuser
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder --chown=webuser:webgroup /app/.next/standalone ./
# COPY --from=builder --chown=webuser:webgroup /app/.next/static ./.next/static
# USER webuser
# EXPOSE 3000
# CMD ["npm", "start"]