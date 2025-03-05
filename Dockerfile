# Run as a non-privileged user
FROM node:22
EXPOSE 8081

RUN useradd -ms /bin/sh -u 1001 app
USER app

WORKDIR /app

# Copy source files
COPY --chown=app:app . /app

# Install dependencies
RUN npm install

ENTRYPOINT ["npm", "start"]
