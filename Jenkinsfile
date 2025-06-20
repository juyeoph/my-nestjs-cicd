pipeline {
    agent any

    environment {
        // GitHub 레포지토리 이름을 환경 변수로 지정 (옵션)
        DOCKER_IMAGE_NAME = "my-nestjs-app-from-jenkins"
    }

    stages {

        // ==========================================================
        // ===== 'Test' 단계 =====
        // ==========================================================
        stage('Test') {
            steps {
                script {
                    echo "Running tests..."
                    // 'npm ci'는 package-lock.json을 기반으로 의존성을 설치하여
                    // CI 환경에서 더 빠르고 일관된 빌드를 보장합니다.
                    sh 'npm ci'
                    // 'npm run test'를 실행하여 테스트를 수행합니다.
                    sh 'npm run test'
                }
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
                    def valuesFile = "" // 사용할 values 파일 경로를 담을 변수

                    // 브랜치 이름에 따라 사용할 설정 파일만 선택
                    if (env.BRANCH_NAME == 'main') {
                        echo "Production values will be used."
                        valuesFile = "./my-app-chart/environments/values-prod.yaml"
                    } else {
                        echo "Development values will be used."
                        valuesFile = "./my-app-chart/environments/values-dev.yaml"
                    }

                    // Jenkinsfile의 Deploy to Kubernetes 단계
                    sh """
                        helm upgrade --install my-nestjs-release ./my-app-chart \
                            -f ${valuesFile} \
                            --set image.repository=${env.DOCKER_IMAGE_NAME} \
                            --set image.tag=${env.BUILD_NUMBER} \
                            --set buildInfo="Jenkins-Build-${env.BUILD_NUMBER}"
                    """
                }
            }
        }

    }
}