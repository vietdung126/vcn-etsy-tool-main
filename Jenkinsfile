def DOCKER_REPO="registry.gitlab.famtechvn.net/blockchain/lik/be/api"
def FT_REGISTRY="https://registry.gitlab.famtechvn.net"
def DOCKER_IMAGE_NAME="lik-be-api"
def GIT_COMMIT_DESC=''

def NODE_ENV_STG="staging"
def PORT_STG="10601"
def CREDENTIAL_STG="lik-be-api-stg.env"
def DOCKER_SUFFIX_STG="stg"

def NODE_ENV_SANDBOX="sandbox"
def PORT_SANDBOX="10621"
def CREDENTIAL_SANDBOX="lik-be-api-sandbox.env"
def DOCKER_SUFFIX_SANDBOX="sandbox"

def NODE_ENV_PREPROD="preprod"
def PORT_PREPROD="10631"
def CREDENTIAL_PREPROD="lik-be-api-preprod.env"
def DOCKER_SUFFIX_PREPROD="preprod"


// Define notification build function
def notifyBuild(String buildStatus = 'STARTED', String GIT_COMMIT_DESC) {
    def colorCode = '#FF0000'
    def duration = "after ${currentBuild.durationString.replace(' and counting', '')}"
    def subject = "${env.JOB_NAME} - #${env.BUILD_NUMBER}"

    // Override default values based on build status
    if (buildStatus == 'STARTED') {
        colorCode = 'gray'
        duration = "Started <${env.BUILD_URL}console|:construction:>"
    } else if (buildStatus == 'SUCCESSFUL') {
        colorCode = 'good'
        duration = "Success ${duration} <${env.BUILD_URL}console|:confetti_ball:>"
    } else {
        colorCode = 'danger'
        duration = "Failed ${duration} <${env.BUILD_URL}console|:shit:>"
    }
    
    def summary = "${subject} ${duration} ${GIT_COMMIT_DESC == '' ? '' : '\n'}${GIT_COMMIT_DESC == '' ? '' : GIT_COMMIT_DESC}"
    
    // Send notifications
    slackSend (color: colorCode, message: summary)
}

notifyBuild('STARTED')

pipeline {
    agent any
    stages {
    	stage ('Deploy Staging') {
            when {
                anyOf {
                    environment name: 'GIT_BRANCH', value: 'develop';
                    environment name: 'GIT_BRANCH', value: 'origin/develop'
                }
            }

            environment {
                ENV_NODE_ENV="$NODE_ENV_STG"
                ENV_PORT="$PORT_STG"
                ENV_DOCKER_SUFFIX="$DOCKER_SUFFIX_STG"

                ENV_FILE = credentials("$CREDENTIAL_STG")
            }
            steps {
                script {
                    GIT_COMMIT_DESC = sh(script: 'git log --format=oneline -n 1', returnStdout: true).trim()
                }

                echo "START - deploy to ${ENV_NODE_ENV} environment"
                sh "docker build -t ${DOCKER_IMAGE_NAME}:${ENV_DOCKER_SUFFIX} ."
                sh "docker stop ${DOCKER_IMAGE_NAME}-${ENV_DOCKER_SUFFIX} || true && docker rm ${DOCKER_IMAGE_NAME}-${ENV_DOCKER_SUFFIX} || true"
                sh """
                    docker run \
                    -d -p 127.0.0.1:${ENV_PORT}:3000 \
                    --network="staging-share" \
                    --env NODE_ENV=${ENV_NODE_ENV} \
                    --env-file ${ENV_FILE} \
                    --restart always \
                    --link logger-stg:logger \
                    --name ${DOCKER_IMAGE_NAME}-${ENV_DOCKER_SUFFIX} ${DOCKER_IMAGE_NAME}:${ENV_DOCKER_SUFFIX}
                    """

                echo "FINISHED - deploy to ${ENV_NODE_ENV} environment"
            }
        }
    	stage ('Deploy Sandbox') {
            when {
                anyOf {
                    environment name: 'GIT_BRANCH', value: 'sandbox';
                    environment name: 'GIT_BRANCH', value: 'origin/sandbox'
                }
            }
            environment {
                ENV_NODE_ENV="$NODE_ENV_SANDBOX"
                ENV_PORT="$PORT_SANDBOX"
                ENV_DOCKER_SUFFIX="$DOCKER_SUFFIX_SANDBOX"

                ENV_FILE = credentials("$CREDENTIAL_SANDBOX")
            }
            steps {
                script {
                    GIT_COMMIT_DESC = sh(script: 'git log --format=oneline -n 1', returnStdout: true).trim()
                }

                echo "START - deploy to ${ENV_NODE_ENV} environment"
                sh "docker build -t ${DOCKER_IMAGE_NAME}:${ENV_DOCKER_SUFFIX} ."
                sh "docker stop ${DOCKER_IMAGE_NAME}-${ENV_DOCKER_SUFFIX} || true && docker rm ${DOCKER_IMAGE_NAME}-${ENV_DOCKER_SUFFIX} || true"
                sh """
                    docker run \
                    -d -p 127.0.0.1:${ENV_PORT}:3000 \
                    --network="staging-share" \
                    --env NODE_ENV=${ENV_NODE_ENV} \
                    --env-file ${ENV_FILE} \
                    --restart always \
                    --link logger-stg:logger \
                    --name ${DOCKER_IMAGE_NAME}-${ENV_DOCKER_SUFFIX} ${DOCKER_IMAGE_NAME}:${ENV_DOCKER_SUFFIX}
                    """

                echo "FINISHED - deploy to ${ENV_NODE_ENV} environment"
            }
        }
    	stage ('Deploy Preprod') {
            when {
                anyOf {
                    environment name: 'GIT_BRANCH', value: 'preprod';
                    environment name: 'GIT_BRANCH', value: 'origin/preprod'
                }
            }
            environment {
                ENV_NODE_ENV="$NODE_ENV_PREPROD"
                ENV_PORT="$PORT_PREPROD"
                ENV_DOCKER_SUFFIX="$DOCKER_SUFFIX_PREPROD"

                ENV_FILE = credentials("$CREDENTIAL_PREPROD")
            }
            steps {
                script {
                    GIT_COMMIT_DESC = sh(script: 'git log --format=oneline -n 1', returnStdout: true).trim()
                }

                echo "START - deploy to ${ENV_NODE_ENV} environment"
                sh "docker build -t ${DOCKER_IMAGE_NAME}:${ENV_DOCKER_SUFFIX} ."
                sh "docker stop ${DOCKER_IMAGE_NAME}-${ENV_DOCKER_SUFFIX} || true && docker rm ${DOCKER_IMAGE_NAME}-${ENV_DOCKER_SUFFIX} || true"
                sh """
                    docker run \
                    -d -p 127.0.0.1:${ENV_PORT}:3000 \
                    --network="staging-share" \
                    --env NODE_ENV=${ENV_NODE_ENV} \
                    --env-file ${ENV_FILE} \
                    --restart always \
                    --link logger-stg:logger \
                    --name ${DOCKER_IMAGE_NAME}-${ENV_DOCKER_SUFFIX} ${DOCKER_IMAGE_NAME}:${ENV_DOCKER_SUFFIX}
                    """

                echo "FINISHED - deploy to ${ENV_NODE_ENV} environment"
            }
        }
    }
    post {
        success {
            notifyBuild('SUCCESSFUL', GIT_COMMIT_DESC)
        }
        failure {
            notifyBuild('FAILED', GIT_COMMIT_DESC)
        }
    }
}
