FROM node:24

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY . .
RUN yarn install && yarn build

# start app
CMD [ "yarn", "start" ]
