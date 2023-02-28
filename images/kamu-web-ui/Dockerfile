FROM nginx:1.23.3
ARG KAMU_WEB_UI_VERSION

COPY rootfs/ /

RUN cd /usr/share/nginx/html && \
    rm * && \
    curl \
        --location --silent \
        --output kamu-web-ui-any.tar.gz \
        "https://github.com/kamu-data/kamu-web-ui/releases/download/v${KAMU_WEB_UI_VERSION}/kamu-web-ui-any.tar.gz" && \
    tar -xf kamu-web-ui-any.tar.gz && \
    mv kamu-web-ui-any/* . && \
    rm -r kamu-web-ui-any.tar.gz kamu-web-ui-any

COPY runtime-config.json /usr/share/nginx/html/assets/runtime-config.json
