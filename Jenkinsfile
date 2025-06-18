// Jenkinsfile
pipeline {
    agent any
    environment {
        DOCKER_IMAGE_NAME = "my-nestjs-app-from-jenkins"
    }
    stages {
        stage('Checkout Source') { /* ... 이전과 동일 ... */ }
        stage('Build Docker Image') { /* ... 이전과 동일 ... */ }
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    def dockerImageTag = "${env.DOCKER_IMAGE_NAME}:${env.BUILD_NUMBER}"

                    // sed 명령어가 점점 더 복잡하고 길어집니다...
                    sh "sed -i.bak 's|__IMAGE_TO_REPLACE__|${dockerImageTag}|g' k8s/deployment.yaml"

                    // 브랜치 이름에 따라 다른 설정을 적용
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