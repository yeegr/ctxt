'use strict'

let http = require('http'),
  url = require('url'),
  request = require('request'),
  port = 10002

var server = http.createServer((req, res) => {
  const link = url.parse(req.url, true)

  let char = link.query.s,
    py = ''

  if (char) {
    let path = 'https://hanyu.baidu.com/s?from=zici&wd=' + encodeURI(char)

    request({
      followAllRedirects: true,
      url: path,
      timeout: 300000
    }, (error, response, body) => {
      if (!error) {
        let tmp = body.substring(body.indexOf('id="pinyin"'))
        tmp = tmp.substring(tmp.indexOf('<b>[') + 4),
        tmp = tmp.substring(0, tmp.indexOf(']</b>'))

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify([char, tmp]))
      } else {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({msg: error}))
      }
    })
  } else {
    res.statusCode = 406
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({msg: 'query term required!'}))
  }

})

server.listen(port)

console.log('server listening on port ' + port)