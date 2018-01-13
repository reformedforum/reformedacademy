FROM alpine:3.7

RUN apk update
RUN apk add nginx \
            python3 \
            uwsgi \
            uwsgi-python3 \
            # mysql tools to build python connector
            python3-dev \
            mariadb-dev \
            mariadb-client-libs \
            g++ \
            # libraries used by pillow
            jpeg-dev \
            zlib-dev

ENV LIBRARY_PATH=/lib:/usr/lib

# pip
ADD requirements.txt /tmp/requirements.txt
WORKDIR /tmp
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

# nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN mkdir -p /run/nginx

# code
RUN mkdir -p /code
WORKDIR /code
ADD . /code

EXPOSE 80

CMD ["./startup.sh"]