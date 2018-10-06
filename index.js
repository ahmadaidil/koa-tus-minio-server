const http = require('http');
const url = require('url');
const Koa = require('koa')
const tus = require('tus-node-server');
const tusServer = new tus.Server();

require('dotenv').config();

const app = new Koa();
const appCallback = app.callback();
const host = '127.0.0.1';
const port = process.env.SERVER_PORT || 3000;

tusServer.datastore = new tus.S3Store({
  path: process.env.MINIO_PATH,
  bucket: process.env.MINIO_BUCKET,
  accessKeyId: process.env.MINIO_ACCESS_KEY_ID,
  secretAccessKey: process.env.MINIO_SECRET_ACCESS_KEY,
  endpoint: process.env.MINIO_ENDPOINT,
  s3ForcePathStyle: true,
  signatureVersion: process.env.SIGNATURE_VERSION || 'v2', // use v4 if endpoint is https
  partSize: 8 * 1024 * 1024
});

const server = http.createServer((req, res) => {
    const urlPath = url.parse(req.url).pathname;

    // handle any requests with the `/files/*` pattern
    if (/^\/files\/.+/.test(urlPath.toLowerCase())) {
        return tusServer.handle(req, res);
    }

    appCallback(req, res);
});

server.listen(port, () => {
  console.log(`[${new Date().toLocaleTimeString()}] 🌎 ==> listening at http://${host}:${port}`);
});
