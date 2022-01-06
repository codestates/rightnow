server

### PM2 typescript 실행

```
$ npm install -D pm2
$ npx pm2 install typescript
```

#### start

```
authbind --deep pm2 start ts-node -- --project config/tsconfig.json app.ts --watch
```

#### stop

```
authbind --deep pm2 stop ts-node
```
