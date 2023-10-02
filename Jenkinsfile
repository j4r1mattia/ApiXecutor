pipeline {
    agent any
    tools {
        nodejs 'NodeJs'
    }
    options {
        buildDiscarder(logRotator(numToKeepStr: '30', artifactNumToKeepStr: '5'))
    }
    parameters {
        choice choices: ['preprod', 'devpromoted', 'devint', 'special00', 'special01', 'special02', 'special03'], description: 'Choose the environment where the Policy Center you want to test resides', name: 'environment'
        booleanParam description: 'Run more collections in parallel (max 3)', name: 'parallel'
    }
    stages {
        stage('Clear Old Workspace') {
            steps {
                script {
                    deleteDir()
                    cleanWs()
                }
            }
         }
        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM',
                    branches: [[name: '*/main']],
                    doGenerateSubmoduleConfigurations: false,
                    extensions: [[$class: 'RelativeTargetDirectory',
                    relativeTargetDir: '']],
                    submoduleCfg: [],
                    userRemoteConfigs: [[credentialsId: 'ac58d1aa-cb72-45f1-ac4c-74e45751c5d4',
                    url: 'git@gitlab-ssh.ct.shared.base.aeu.grp:testautomation/testautomationapi.git']]])
            }
        }
        stage('Install dependencies') {
            steps {  
                sh "npm i && npm link"
            }
        }
        stage('Run Test') {
            steps {
                script {
                    if(params.parallel) {
                        parallel = '--parallel'
                    } else {
                        parallel = ''
                    }
                }
                sh "apix run ./collections/ -e ./environments/${params.environment}.json ${parallel}"
            }
        }
    }
    post {
		success {
		    junit "**/reports/junit/*.xml"
			publishHTML([allowMissing: true, alwaysLinkToLastBuild: false, keepAll: true, reportDir: 'reports/html/', reportFiles: 'result.html', reportName: 'HTML Report', reportTitles: ''])
			}
		failure {
		    junit "**/reports/junit/*.xml"
			publishHTML([allowMissing: true, alwaysLinkToLastBuild: false, keepAll: true, reportDir: 'reports/html/', reportFiles: 'result.html', reportName: 'HTML Report', reportTitles: ''])
			}
	}
}
