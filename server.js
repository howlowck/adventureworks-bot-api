'use strict'

var port = process.env.PORT || 8000
require('dotenv').config()

var http = require('http')
var express = require('express')
var bodyParser = require('body-parser')
var swaggerize = require('swaggerize-express')
var swaggerUi = require('swaggerize-ui')
var path = require('path')

var app = express()

var server = http.createServer(app)

app.use(bodyParser.json())

app.use(swaggerize({
  api: path.resolve('./config/api.json'),
  handlers: path.resolve('./handlers'),
  docspath: '/swagger/docs/v1'
}))

app.use('/swagger', swaggerUi({
  docs: '/swagger/docs/v1'
}))

server.listen(port, function () {
  app.setHost(undefined)
})
