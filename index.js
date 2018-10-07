const http = require('http');
const url = require('url');
const Koa = require('koa');
const cors = require('@koa/cors');
const tus = require('tus-node-server');
const tusServer = new tus.Server();
const tusEvent = tus.EVENTS;
const util = require('./util');

require('dotenv').config();

const app = new Koa();
const appCallback = app.callback();
const host = '127.0.0.1';
const port = process.env.SERVER_PORT || 3000;

app.use(cors());

tusServer.datastore = new tus.S3Store({
  path: '/files',
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
  if (/\/files/.test(urlPath.toLowerCase())) {
    return tusServer.handle(req, res);
  }
  appCallback(req, res);
});

tusServer.on(tusEvent.EVENT_UPLOAD_COMPLETE, (ev) => {
  if(ev.file && ev.file.id) {
    console.log('event when upload complete ==>', JSON.stringify(ev.file));
    const fileInfo = util.getFileInfo(ev.file);
    console.info(fileInfo);
  }
});

tusServer.on(tusEvent.EVENT_FILE_CREATED, (ev) => {
  if(ev.file && ev.file.id) {
    console.log('event when file created ==>', JSON.stringify(ev.file));
  }
});

tusServer.on(tusEvent.EVENT_ENDPOINT_CREATED, (ev) => {
  if(ev.url) {
    console.log('event when ep created ==>', JSON.stringify(ev));
  }
});

server.listen(port, () => {
  console.log(`[${new Date().toLocaleTimeString()}] 🌎 ==> listening at http://${host}:${port}`);
});
