# Deployment

For deployment we use ECS service and ECR repository.

In infrastructure repository we have a script that creates all the necessary resources (ECS cluster, task definition, service, repository, etc.) and
this repository (created with terraform) give us the variables that we need to set to deploy the app.

## 1. Create `.deploy.<environment>.env` file from `.deploy.template.env` and set the variables

_App Environment variables are configured in ECS Task Definition not here, here we only use env variables for deployment_

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
