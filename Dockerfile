FROM balenalib/raspberrypi3-node:8-stretch-build-20190215

WORKDIR /usr/src/app

COPY ./package.json ./yarn.lock .npmrc ./

# RUN apk --no-cache add bash curl
RUN curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 1.15.2

RUN yarn install --production=false
  
COPY ./src ./src

# Lint codebase
COPY .eslintrc .eslintignore ./
# todo: enable linter and prettier
# RUN yarn run lint

# Build javascript render codebase
COPY ./webpack.config.js .babelrc ./
RUN yarn run build:prod
# Remove devDependencies
RUN yarn install --production
# Add rpi-gpio, this is done here because it crashes on dev machines
RUN yarn add git+https://github.com/adipascu/rpi-gpio.js.git#590b4ee074b7dcddec47da3627350d3d6c99a843

FROM balenalib/raspberrypi3-node:8-stretch-run-20190215

RUN apt-get update && apt-get install -y \
xorg \
xserver-xorg-video-fbdev \
libgtk-3-0 \
libnss3 \
libasound2 \
&& rm -rf /var/lib/apt/lists/* \
&& rm -rf /tmp/*

# Set Xorg and FLUXBOX preferences
RUN mkdir ~/.fluxbox
RUN echo "xset s off" > ~/.fluxbox/startup && echo "xserver-command=X -s 0 dpms" >> ~/.fluxbox/startup
RUN echo "#!/bin/bash" > /etc/X11/xinit/xserverrc \
  && echo "" >> /etc/X11/xinit/xserverrc \
  && echo 'exec /usr/bin/X -s 0 dpms -nocursor -nolisten tcp "$@"' >> /etc/X11/xinit/xserverrc

# Move to app dir
WORKDIR /usr/src/app

# Add startup scripts
COPY ./package.json ./start.sh ./main.js ./

# Add prebuilt node_modules
COPY --from=0 /usr/src/app/node_modules ./node_modules
# Add prebuilt javascript render codebase
COPY --from=0 /usr/src/app/build ./build

## uncomment if you want systemd
ENV INITSYSTEM on
ENV UDEV 1
ENV TIMEZONE Etc/UTC

# Start app
CMD ["bash", "/usr/src/app/start.sh"]
