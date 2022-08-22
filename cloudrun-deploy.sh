PROJECT_ID="yorozu-uranai-$1"

# NOTE: 環境変数は .env.production.local の内容が自動的にデプロイされるので、
# 開発デプロイ・本番デプロイで環境変数を切り替えるために、ファイルをcpしたりrmしたりする
cp .env.$1.deploy .env.production.local
gcloud builds submit --config=cloudbuild.yaml --project $PROJECT_ID
rm .env.production.local

if [ $? = 0 ]; then
  gcloud run deploy $PROJECT_ID --image gcr.io/$PROJECT_ID/webapp --project $PROJECT_ID --region asia-northeast1
fi
