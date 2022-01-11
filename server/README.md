# server

## PM2 typescript 실행

```
$ npm install -D pm2
$ npx pm2 install typescript
```

### start

```
authbind --deep pm2 start ts-node -- --project config/tsconfig.json app.ts --watch
```

### stop

```
authbind --deep pm2 stop ts-node
```

## Sequelize Migration

### db 동기화

```
npx sequelize-cli db:migrate
```

### db 초기화

```
npx sequelize-cli db:migrate:undo:all
```

### seed 추가

```
npx sequelize db:seed:all
```
