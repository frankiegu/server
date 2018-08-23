const request = require('superagent')

const host = 'localhost:8080'

const signUp = form => 
  request
    .post(`${host}/signup`)
    .ok(res => res.status)
    .send(form)

module.exports = { signUp }

