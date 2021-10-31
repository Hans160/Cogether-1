#!/bin/bash
cd /home/ubuntu/Cogether/server

export DATABASE_NAME=$(aws ssm get-parameters --region ap-northeast-2 --names DATABASE_NAME --query Parameters[0].Value | sed 's/"//g')
export DATABASE_PASSWORD=$(aws ssm get-parameters --region ap-northeast-2 --names DATABASE_PASSWORD --query Parameters[0].Value | sed 's/"//g')
export DATABASE_USERNAME=$(aws ssm get-parameters --region ap-northeast-2 --names DATABASE_USERNAME --query Parameters[0].Value | sed 's/"//g')

export JWT_SECRET=1234=$(aws ssm get-parameters --region ap-northeast-2 --names JWT_SECRET --query Parameters[0].Value | sed 's/"//g')

export S3_ACCESS_KEY=$(aws ssm get-parameters --region ap-northeast-2 --names S3_ACCESS_KEY --query Parameters[0].Value | sed 's/"//g')
export S3_SECRET_KEY=$(aws ssm get-parameters --region ap-northeast-2 --names S3_SECRET_KEY --query Parameters[0].Value | sed 's/"//g')
export S3_REGION=$(aws ssm get-parameters --region ap-northeast-2 --names S3_REGION --query Parameters[0].Value | sed 's/"//g')
export S3_BUCKET_NAME=$(aws ssm get-parameters --region ap-northeast-2 --names S3_BUCKET_NAME --query Parameters[0].Value | sed 's/"//g')

authbind --deep pm2 start server.js