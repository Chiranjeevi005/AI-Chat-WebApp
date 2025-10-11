// Custom Express server with Socket.IO
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { initSocket } = require('./src/utils/socket-server');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Initialize Socket.IO
  initSocket(server);

  // Use PORT environment variable or default to 3003
  const port = process.env.PORT || 3003;
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});