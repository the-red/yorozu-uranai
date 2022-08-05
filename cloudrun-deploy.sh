PROJECT_ID="yorozu-uranai-$1"
gcloud builds submit --config=cloudbuild-$1.yaml --project $PROJECT_ID
if [ $? = 0 ]; then
  gcloud run deploy $PROJECT_ID --image gcr.io/$PROJECT_ID/webapp --project $PROJECT_ID --region asia-northeast1
fi
