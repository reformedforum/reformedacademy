FROM python:2.7.11
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y \
    nginx           `# Used with gunicorn as a web server.` \
    netcat          `# Probe for mysql`
RUN pip install --upgrade pip
RUN pip install \
    gunicorn    `# Application server.`

# Install dependencies
RUN mkdir /build
WORKDIR /build
COPY requirements.txt /build/
RUN pip install -r requirements.txt

# Configure nginx
COPY config/nginx.conf /etc/nginx/sites-enabled/default

# Copy app source
COPY . /code/
WORKDIR /code

CMD ./run.sh