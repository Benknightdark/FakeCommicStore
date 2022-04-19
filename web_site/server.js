const express = require('express')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3033
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.all('*', (req, res) => {

    if(req.url==='/api/auth/csrf'){
      console.log(`DDDDDDDDDDD=>`)
      console.log(req.headers)
      req.url=req.url+"?a=111"
      //res.status(403).send('Fuck You');
    }
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})