FROM node:18-buster AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --verbose
COPY . .
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/src/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
