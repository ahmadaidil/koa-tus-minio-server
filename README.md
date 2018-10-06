# Upload file server with koa, tus and minio store

before running the server:
* rename .env-template file to .env
* fill it (.env) variable with your configuration. eg:
```env
SERVER_PORT="3000"
MINIO_BUCKET="node-s3"
MINIO_ACCESS_KEY_ID="CLQ9PV3UJ3BXWGXA2EX4"
MINIO_SECRET_ACCESS_KEY="OS4AN6zry9xid2L68mN7NkBn/JmVlWcI5F9Ja1Zf"
MINIO_ENDPOINT="http://127.0.0.1:9000"
SIGNATURE_VERSION="v2"
```
* install dependencies:
```cmd
$ npm i
```

or optional but recommended, use
```cmd
$ yarn
```

---
running the server
```cmd
$ npm start
```

or running the server with the hot reload module
```cmd
$ npm run start:hot
```
---
with yarn
```cmd
$ yarn start
$ yarn start:hot
```

---

&copy; 2018 Ahmad Aidil