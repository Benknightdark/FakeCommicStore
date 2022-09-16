const express = require('express')
const expressip = require('express-ip');
const next = require('next')
const port = process.env.PORT || 3033
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })

const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()
  server.use(expressip().getIpInfoMiddleware);

  server.all('*', (req, res) => {
    console.log(req.ipInfo);
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})