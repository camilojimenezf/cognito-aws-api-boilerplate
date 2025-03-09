# Deployment

For deployment we use CloudFront and S3.
You can find the CloudFront distribution ID and S3 bucket in the AWS console.
Also you need a profile in your AWS credentials file to deploy the frontend with the right permissions.

## 1. Create `.deploy.<environment>.env` file from `.deploy.template.env` and set the variables

```bash
cp .deploy.template.env .deploy.staging.env
```

```bash
cp .deploy.template.env .deploy.development.env
```

```bash
cp .deploy.template.env .deploy.production.env
```

## 2. Deploy command

```bash
./deploy.sh staging
```

## Development

```bash
./deploy.sh development
```

## Production

```bash
./deploy.sh production
```
