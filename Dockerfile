FROM  node:5

# Install nodemon
RUN npm install -g nodemon grunt-cli

# Provides cached layer for node_modules
#?? ADD package.json /tmp/package.json
#?? RUN cd /tmp && npm install
#?? RUN mkdir -p /src && cp -a /tmp/node_modules /src/
RUN mkdir -p /apps

# Define working directory
COPY . /apps/
WORKDIR /apps
RUN ["npm", "install"]
# RUN apt-get update \
  # && apt-get dist-upgrade -y

# Overridable Command
ENV DEBUG=lsrs*
ENTRYPOINT ["nodemon", "index"]
