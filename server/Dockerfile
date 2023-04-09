ARG NODE_VERSION=19-alpine3.16

FROM node:${NODE_VERSION}

LABEL author=diego

EXPOSE 8080
RUN apk update && apk add bash

WORKDIR /usr/src/server
WORKDIR ..

RUN npm add express
RUN npm add body-parser
RUN npm add mysql
RUN npm add cors

WORKDIR ./server

CMD ["/bin/bash"]