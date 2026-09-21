FROM httpd:alpine
COPY index.html /usr/local/apache2/htdocs/

# Rahti runs containers as an arbitrary non-root UID by default (see the box below) —
# that UID can't bind to port 80, so move Apache to a non-privileged port instead.
RUN sed -i 's/^Listen 80$/Listen 8080/' /usr/local/apache2/conf/httpd.conf && \
    chgrp -R 0 /usr/local/apache2/logs && \
    chmod -R g=u /usr/local/apache2/logs

# Enable Apache Proxy modules required for reverse proxying
RUN sed -i 's/#LoadModule proxy_module/LoadModule proxy_module/' /usr/local/apache2/conf/httpd.conf && \
    sed -i 's/#LoadModule proxy_http_module/LoadModule proxy_http_module/' /usr/local/apache2/conf/httpd.conf

# Append the Reverse Proxy rules to the end of httpd.conf
# Same for Nginx thing.
RUN echo "ProxyPass /api http://backend:8000" >> /usr/local/apache2/conf/httpd.conf && \
    echo "ProxyPassReverse /api http://backend:8000" >> /usr/local/apache2/conf/httpd.conf

EXPOSE 8080