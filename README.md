# node-exercise

This exercise is intended to demonstrate a wide range of functionality required to implement a SPA with simple RESTful web service support including: modular application structure, configuration, routing, oAuth 2.0 spec token-based authentication and appropriate HTTP response codes.

The application is written using:
 
- Client: AngularJS, Bootstrap.
- Server: pure Node.js API, ES6 features and babel transpiler.

## Quick Start

Clone the repo
```
git clone https://github.com/appmux/node-exercise.git
```
Switch to project firectory
```
cd node-exercise
```
Checkout client branch
```
git checkout -b client origin/client
```
Install dependencies
```
$ npm install
```
Run application
```
$ npm start
```
Generate database entries
```
curl -X DELETE "http://127.0.0.1:8090/api/store"
```
## Client-side application

### Visit in the browser

http://127.0.0.1:8090

