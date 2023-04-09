ARG NODE_VERSION=19-alpine3.16

FROM node:${NODE_VERSION}

LABEL author=diego

EXPOSE 3000
RUN apk update && apk add bash

WORKDIR /usr/src

RUN npx create-react-app app

WORKDIR ./app

RUN npm add react-router-dom

CMD ["npm", "start"]