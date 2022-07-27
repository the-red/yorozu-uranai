FROM node:16.15.1

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH
ARG NEXT_PUBLIC_ENV

COPY . .
RUN yarn install && yarn build

# start app
CMD [ "yarn", "start" ]
