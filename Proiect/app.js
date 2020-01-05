  
const http = require('http');
const url = require('url');
const bodyParser = require('body-parser');


const PORT = 3000;
const IP = '127.0.0.1';

const server = http.createServer(function (request, response) {
    let routeHandler = routes[url.parse(request.url).pathname];
  
    if (routeHandler) {
      routeHandler.requestHandler(request, response);
    } else {
      utils.respond(response, { code: 404, message: "Route not found..." }, 404);
    }
  });
  
  // db.getConnection(function (err, connection) {
  //   if (err) {
  //     throw err;
  //   }
  //   console.log('Connected');
  // });
  
  server.listen(PORT, IP);
  