const http = require('http')
const nodeNet = require('net')
const path = require('path')
const fs = require('fs')

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

let runServer = null

/**
 * Finds a free port on localhost.
 * @returns {Promise<number>}
 */
function getFreePort() {
  return new Promise((resolve) => {
    const server = nodeNet.createServer()
    server.listen(0, 'localhost', () => {
      const port = server.address().port
      server.close(() => {
        resolve(port)
      })
    })
  })
}

/**
 * Starts a simple static HTTP server.
 * @param {string} dir Directory to serve.
 * @param {number} port Port to listen on.
 * @returns {Promise<http.Server>}
 */
function startStaticServer(dir, port) {
  stopStaticServer()

  runServer = http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0]
    let filePath = path.join(dir, urlPath === '/' ? 'index.html' : urlPath)
    
    // Basic security: prevent directory traversal
    const normalizedDir = path.normalize(dir)
    const normalizedFilePath = path.normalize(filePath)
    
    if (!normalizedFilePath.startsWith(normalizedDir)) {
      res.statusCode = 403
      res.end('Forbidden')
      return
    }

    const ext = path.extname(normalizedFilePath).toLowerCase()
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'

    fs.readFile(normalizedFilePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.statusCode = 404
          res.end('Not Found')
        } else {
          res.statusCode = 500
          res.end('Internal Error')
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType })
        res.end(content, 'utf-8')
      }
    })
  })

  return new Promise((resolve, reject) => {
    runServer.listen(port, 'localhost', () => {
      console.log(`[Static Server] Serving ${dir} at http://localhost:${port}`)
      resolve(runServer)
    })
    runServer.on('error', reject)
  })
}

/**
 * Stops the current static server if it's running.
 */
function stopStaticServer() {
  if (runServer) {
    runServer.close()
    runServer = null
  }
}

module.exports = {
  getFreePort,
  startStaticServer,
  stopStaticServer
}
