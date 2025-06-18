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
                    def valuesFile = "" // 사용할 values 파일 경로를 담을 변수

                    // 브랜치 이름에 따라 사용할 설정 파일만 선택
                    if (env.BRANCH_NAME == 'main') {
                        echo "Production values will be used."
                        valuesFile = "./my-app-chart/environments/values-prod.yaml"
                    } else {
                        echo "Development values will be used."
                        valuesFile = "./my-app-chart/environments/values-dev.yaml"
                    }

                    // Helm 명령어로 배포! if/else와 sed가 모두 사라졌습니다.
                    sh """
                        helm upgrade --install my-nestjs-release ./my-app-chart \
                            -f ${valuesFile} \
                            --set image.repository=${env.DOCKER_IMAGE_NAME} \
                            --set image.tag=${env.BUILD_NUMBER}
                    """
                }
            }
        }

    }
}