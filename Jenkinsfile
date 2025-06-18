pipeline {
    agent any // 파이프라인을 실행할 에이전트(노드)를 아무거나 사용

    environment {
        // Docker 이미지 이름을 환경 변수로 지정
        DOCKER_IMAGE_NAME = "my-nestjs-app-from-jenkins"
    }

    stages {
        stage('Checkout Source') {
            steps {
                // GitHub 저장소에서 코드를 가져옴
                git branch: 'main', url: 'https://github.com/juyeoph/my-nestjs-cicd'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // 빌드 번호를 태그로 사용하여 유니크한 이미지 생성
                    def dockerImageTag = "${env.DOCKER_IMAGE_NAME}:${env.BUILD_NUMBER}"

                    // 'docker build' 명령 실행
                    sh "docker build -t ${dockerImageTag} ."

                    echo "Successfully built Docker image: ${dockerImageTag}"
                }
            }
        }

        // Deploy 단계는 다음 학습을 위해 주석 처리
        /*
        stage('Deploy to Kubernetes') {
            steps {
                echo 'Deploying to Kubernetes...'
                // 여기에 나중에 kubectl apply 명령어가 들어갑니다.
            }
        }
        */
        // ==========================================================
        // ===== 마지막 배포 단계 추가! =====
        // ==========================================================
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    def dockerImageTag = "${env.DOCKER_IMAGE_NAME}:${env.BUILD_NUMBER}"

                    // 1. deployment.yaml 파일의 이미지 자리 표시자를 실제 이미지 태그로 교체
                    //    (macOS의 sed 명령어 호환성을 위해 -i 뒤에 .bak을 붙임)
                    sh "sed -i.bak 's|__IMAGE_TO_REPLACE__|${dockerImageTag}|g' k8s/deployment.yaml"

                    // 2. 수정된 YAML 파일들을 쿠버네티스 클러스터에 적용
                    echo "Applying Kubernetes manifests..."
                    sh "kubectl apply -f k8s/"

                    echo "Deployment successful!"
                }
            }
        }

    }
}