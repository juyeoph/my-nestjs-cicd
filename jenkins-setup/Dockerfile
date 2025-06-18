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
    apt-get install -y docker-ce-cli

# ==========================================================
# ===== 이 부분을 최종 코드로 교체합니다 =====
# ==========================================================
# 전달받은 DOCKER_GID로 'docker' 그룹이 존재하도록 보장하는 최종 로직
RUN if [ -n "$DOCKER_GID" ]; then \
        # GID를 사용하는 그룹의 현재 이름을 찾음
        EXISTING_GROUP_WITH_GID=$(getent group ${DOCKER_GID} | cut -d: -f1); \
        # 만약 GID를 사용하는 그룹이 존재한다면
        if [ -n "$EXISTING_GROUP_WITH_GID" ]; then \
            # 그리고 그 그룹 이름이 'docker'가 아니라면, 이름을 'docker'로 변경
            if [ "$EXISTING_GROUP_WITH_GID" != "docker" ]; then \
                groupmod -n docker $EXISTING_GROUP_WITH_GID; \
            fi; \
        # GID를 사용하는 그룹이 아예 없다면, 'docker' 그룹을 새로 생성
        else \
            groupadd -g ${DOCKER_GID} docker; \
        fi; \
        # 'jenkins' 사용자를 'docker' 그룹에 추가
        usermod -aG docker jenkins; \
    fi

# 다시 jenkins 사용자로 전환합니다.
USER jenkins