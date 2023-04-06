# calculator-tn-api

## Requierements

* Node.js 18
* MongoDB 5 running

### Run mongodb locally
If you don't have mongodb running locally, you can start MongoDB on Docker with the following command

```bash
docker run -d -p 27017:27017 --name calculator-db -v data-vol:/data/db mongo:5
```

## Getting started

### 1st time
> Run the following script to create operations in the database

```bash
node src/scripts/create-operations-script.js
```

### Run the project locally
```bash
npm install
npm run dev
```
Listening on port http://localhost:4000 by default

## Features

* Calculator page with basic calculation and random calculation
* My records page with pagination with per page option, sorting in date field and searching
* Register
* Login
* Logout
* Balance verification
* Session expiration verification
* Bad request verification
* JWT Verification

## Development

Please, run tests with 
```bash
npm install
npm run test
```

### Linters
standardjs and next.js linters

### Postman
You can import the Postman collection to run all the requests.

## Production

This project is running on AWS and uses the following technologies:
* API Gateway (with Lambda Integration and Lambda Authorizer)
* AWS Lambda
* MongoDB on MongoDB Atlas
* AWS CloudWatch Logs
* Node.js

> To deploy the code you can check the deploy.sh file. I committed because this is a test but it should be change to run it in production and ideally create a CI/CD pipeline that run this command.

API DOMAIN [https://i7q8kvf148.execute-api.us-east-1.amazonaws.com/production/](https://i7q8kvf148.execute-api.us-east-1.amazonaws.com/production/)

WEBPAGE: [https://calculator-tn-webapp.vercel.app](https://calculator-tn-webapp.vercel.app)

## Endpoints

* POST /v1/auth (username, password)
* POST /v1/register (username, password)
* POST /v1/calculate/basic (operationType, firstParam, secondParam)
* POST /v1/calculate/random (length)
* GET /v1/records?page&limit&sort&search (page = Number, limit = Number, sort= 'asc_date' or 'desc_date', search='add or multi or ...')
* DELETE /v1/records (recordId)

## System Design

![Calculator System Design](/system-design.png)