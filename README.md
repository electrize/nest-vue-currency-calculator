<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


## Description

 Currency Calclulator made with Nest, Vue and [SWOP](https://swop.cx) API.
 Using CSRF, CSP, CORS.

## Setup Vue client

```bash
$ cd client
```

```sh
npm install
```

```sh
npm run build
```

Check /client/README.md for more details

## Setup Nest Server

```bash
$ cd ..
```

```bash
$ npm install
```

## Configuration

Rename .env.example to .env and add:
- SWOP API key
- Session secret random string (by default is 'mysecret')

## Compile and run Nest Server

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests in Nest

Note: no tests are implemented yet

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API routes

- [GET] /api/csrf-token
- [GET] /api/currencies/list
- [POST] /api/currencies/convert
```bash
# Example of body requset (JSON):
{
    "source": "EUR",
    "target": "GBP",
    "amount": 1,
    "locale": "gb-GB" (optional)
}
```
```bash
# Example of JSON response:
{
    "source": "EUR",
    "target": "GBP",
    "amount": 1,
    "quote": 0.843137,
    "localeQuote": "£0.84"
}
```
(Note: currently with swop developer account cannot use currency different than EUR)

## How to work with the API

1. Get token from /api/csrf-token
2. Add the token as requst header for the other api endpoints
```bash
# Example of header:
{
  "key": "_csrf",
  "value": "cd0e7d031bf6c84e6221100..."
}
```

## Docker

```bash
docker build -t currency-calculator .
```

```bash
docker run -p3000:3000 -e SWOP_API_KEY='b4e866aaad08598d6...' currency-calculator
```
