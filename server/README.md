server

### PM2 typescript 실행

```
$ npm install -D pm2
$ npx pm2 install typescript
```

#### start

```
npx pm2 start ts-node -- --project config/tsconfig.json app.ts --watch
```

#### stop

```
npx pm2 stop ts-node
```
