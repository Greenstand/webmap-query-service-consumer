FROM node:16-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.build.json ./
COPY tsconfig.base.json ./
RUN npm ci --silent
RUN npm run build
COPY . ./
CMD [ "npm", "start" ]
