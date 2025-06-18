# 공식 Jenkins LTS(장기 지원) 이미지를 기반으로 합니다.
FROM jenkins/jenkins:lts-jdk17

# 빌드 시 GID를 인자로 받기 위한 변수 선언
ARG DOCKER_GID

# root 사용자로 전환하여 패키지를 설치합니다.
USER root

# Docker CLI 설치 (이전과 동일)
RUN apt-get update && \
    apt-get install -y lsb-release && \
    curl -fsSLo /usr/share/keyrings/docker-archive-keyring.asc \
      https://download.docker.com/linux/debian/gpg && \
    echo "deb [arch=$(dpkg --print-architecture) \
      signed-by=/usr/share/keyrings/docker-archive-keyring.asc] \
      https://download.docker.com/linux/debian \
      $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list && \
    apt-get update && \
    apt-get install -y docker-ce-cli && \
    # ==========================================================
    # ===== 이 부분이 kubectl 설치 부분입니다 =====
    # ==========================================================
    # kubectl 최신 안정 버전 설치
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
    install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl && \
    rm kubectl

# 전달받은 DOCKER_GID로 'docker' 그룹이 존재하도록 보장하는 최종 로직
RUN if [ -n "$DOCKER_GID" ]; then \
        EXISTING_GROUP_WITH_GID=$(getent group ${DOCKER_GID} | cut -d: -f1); \
        if [ -n "$EXISTING_GROUP_WITH_GID" ]; then \
            if [ "$EXISTING_GROUP_WITH_GID" != "docker" ]; then \
                groupmod -n docker $EXISTING_GROUP_WITH_GID; \
            fi; \
        else \
            groupadd -g ${DOCKER_GID} docker; \
        fi; \
        usermod -aG docker jenkins; \
    fi


# 다시 jenkins 사용자로 전환합니다.
USER jenkins