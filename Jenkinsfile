pipeline {
    agent any

    environment {
        // GitHub 레포지토리 이름을 환경 변수로 지정 (옵션)
        DOCKER_IMAGE_NAME = "my-nestjs-app-from-jenkins"
    }

    stages {
        stage('Checkout Source') {
            steps {
                // Git 저장소에서 코드를 가져옴
                // credentialsId는 private 저장소일 경우에만 필요합니다. public이면 생략 가능.
                git branch: env.BRANCH_NAME, url: 'https://github.com/juyeoph/my-nestjs-cicd.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // 빌드 번호를 태그로 사용하여 유니크한 이미지 생성
                    def dockerImageTag = "${env.DOCKER_IMAGE_NAME}:${env.BUILD_NUMBER}"
                    sh "docker build -t ${dockerImageTag} ."
                    echo "Successfully built Docker image: ${dockerImageTag}"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    def dockerImageTag = "${env.DOCKER_IMAGE_NAME}:${env.BUILD_NUMBER}"

                    // 1. 이미지 이름 placeholder를 실제 이미지 태그로 교체
                    sh "sed -i.bak 's|__IMAGE_TO_REPLACE__|${dockerImageTag}|g' k8s/deployment.yaml"

                    // 2. 브랜치 이름에 따라 다른 설정을 적용
                    if (env.BRANCH_NAME == 'main') {
                        echo "Deploying to Production Environment"
                        sh "sed -i.bak 's|__REPLICAS__|3|g' k8s/deployment.yaml"
                        sh "sed -i.bak 's|__GREETING__|Hello from Prod!|g' k8s/deployment.yaml"
                    } else {
                        echo "Deploying to Development Environment"
                        sh "sed -i.bak 's|__REPLICAS__|1|g' k8s/deployment.yaml"
                        sh "sed -i.bak 's|__GREETING__|Hello from Dev!|g' k8s/deployment.yaml"
                    }

                    echo "Applying Kubernetes manifests..."
                    sh "kubectl apply -f k8s/"

                    echo "Deployment successful!"
                }
            }
        }
    }
}