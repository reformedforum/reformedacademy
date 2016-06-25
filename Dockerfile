FROM mysql

COPY media.sql /docker-entrypoint-initdb.d

CMD ["mysqld"]