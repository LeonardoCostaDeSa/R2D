FROM python:3.12-alpine

RUN apk add --no-cache docker-cli docker-compose git bash

WORKDIR /app
COPY webhook.py .
COPY deploy.sh /usr/local/bin/deploy.sh
RUN chmod +x /usr/local/bin/deploy.sh

EXPOSE 9000

CMD ["python", "webhook.py"]
