# node-exercise

This exercise is intended to demonstrate a wide range of functionality required to implement a simple RESTful web service  including: modular application structure, configuration, routing, oAuth 2.0 spec token-based authentication and appropriate HTTP response codes.

The application is written using pure Node.js API, ES6 features and babel transpiler.

## Quick Start

Install dependencies

```
$ npm install
```

Run application

```
$ npm start
```

# Features

## Authentication

### Login (obtain access token)
```
curl -d "grant_type=password&username=CLIENT_ONE&password=secret" -X POST "http://127.0.0.1:8090/api/auth/token"
```
Use provided access token to access other resources. Use refresh token to obtain new access token.
```
curl -d "grant_type=refresh_token&refresh_token=REFRESH_TOKEN" -X POST "http://127.0.0.1:8090/api/auth/token"
```

### Validate access token

Check if a given access token is valid.
```
curl -H "Authorization: BEARER ACCESS_TOKEN" -X GET "http://127.0.0.1:8090/api/auth/valid-token"
```
### Logout (invalidate access token)
```
curl -H "Authorization: BEARER ACCESS_TOKEN" -X DELETE "http://127.0.0.1:8090/api/auth/token"
```

## Configurations

### List configurations with sorting and paging

Parameters: [sortBy {name, hostname, port, username}], [order {asc, desc}], [page {1, 2, 3…}] or just follow HATEOAS links.
```
curl -H "Authorization: BEARER ACCESS_TOKEN" -X GET "http://127.0.0.1:8090/api/configurations"
```

### View individual configuration

View a configuration by name.
```
curl -H "Authorization: BEARER ACCESS_TOKEN" -X GET "http://127.0.0.1:8090/api/configurations/{name}"
```

### Create configurations

A configuration must have a unique name, look for new resource URL in Location header.
```
curl -d "{\"name\":\"host1100\",\"hostname\":\"add.example.net\",\"port\":1111,\"username\":\"addexamplecom\"}" -H "Content-Type: application/json" -H "Authorization: BEARER ACCESS_TOKEN" -X POST "http://127.0.0.1:8090/api/configurations"
```
### Modify configuration
```
curl -d "{\"name\":\"host1001\",\"hostname\":\"mod.darlene-red.net\",\"port\":1234,\"username\":\"darlenerednet\"}" -H "Content-Type: application/json" -H "Authorization: BEARER ACCESS_TOKEN" -X PUT "http://127.0.0.1:8090/api/configurations/host1001"
```

### Delete configuration
```
curl -H "Authorization: BEARER ACCESS_TOKEN" -X DELETE "http://127.0.0.1:8090/api/configurations/host1101"
```

## Store

### Store reset
```
curl -H "Authorization: BEARER ACCESS_TOKEN" -X DELETE "http://127.0.0.1:8090/api/store"
```
