import router from 'koa-route';
import Koa from 'koa';
export function initServe(win: any) {
    const app = new Koa();
    app.use(
        router.post('/login', (ctx) => {
            win.webContents.send('token', 'token');
            ctx.res.writeHead(200, 'hello world');
        })
    );
    app.use(
        router.post('/user/valid', (ctx) => {
            win.webContents.send('userValid', 'userValid');
            ctx.res.writeHead(200, 'hello world');
        })
    );

    app.listen(9999);
}
