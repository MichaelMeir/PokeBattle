const http = require('http');
const https = require('https');
const fs = require('fs')

const express = require('express')
const bodyParser = require('body-parser');
const helmet = require('helmet')

const app = express();
app.use(helmet())

const routes = require('./routes.js')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Custom Router
app.use((req, res) => {
  for(let i = 0; i < routes.routes.length; i++) {
      if(routes.routes[i].match(req)) {
          routes.routes[i].response(req, res)
          return
      }
  }
  res.statusCode = 404;
  res.end();
})

const server = http.createServer(app);
server.listen(81);

console.log('server started')

// const httpsServer = https.createServer({
//     key: fs.readFileSync('./keys/privkey.pem'),
//     cert: fs.readFileSync('./keys/cert.pem')
// }, app);
// httpsServer.listen(443)