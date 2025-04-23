# Dockerfile
FROM node:18

WORKDIR /app
COPY . .

# Accept build args
ARG STRIPE_SECRET_KEY
ARG NEXT_PUBLIC_APP_URL

# Set them as ENV variables inside the container
ENV STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

RUN npm install --force
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
