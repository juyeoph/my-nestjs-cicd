# =================
# 1. Builder Stage
# =================
# Node.js 18 버전을 기반으로 하는 이미지를 사용합니다. 'builder' 라는 별명을 붙여줍니다.
FROM node:18-alpine AS builder

# 작업 디렉토리를 /usr/src/app 으로 설정합니다.
WORKDIR /usr/src/app

# package.json 과 package-lock.json 파일을 복사합니다.
COPY package*.json ./

# 애플리케이션의 모든 의존성 패키지를 설치합니다.
RUN npm install

# 프로젝트의 모든 소스 코드를 복사합니다.
COPY . .

# TypeScript 코드를 JavaScript 코드로 컴파일(빌드)합니다.
RUN npm run build

# 프로덕션용 의존성만 따로 설치하여 node_modules 크기를 줄입니다.
RUN npm prune --production

# =================
# 2. Runner Stage
# =================
# 좀 더 가벼운 Node.js 18 버전을 기반으로 최종 이미지를 만듭니다.
FROM node:18-alpine

# 작업 디렉토리를 /usr/src/app 으로 설정합니다.
WORKDIR /usr/src/app

# builder 스테이지에서 빌드된 파일들만 복사해옵니다.
# --from=builder 옵션을 사용합니다.
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# 애플리케이션이 3000번 포트를 사용한다고 명시합니다.
EXPOSE 3000

# 컨테이너가 시작될 때 실행할 명령어를 지정합니다.
# 빌드된 dist 폴더 안의 main.js 파일을 실행합니다.
CMD [ "node", "dist/main" ]