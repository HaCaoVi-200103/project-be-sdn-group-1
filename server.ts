

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import initApiRoutes from './routes/index';
dotenv.config();
const hostName = process.env.HOST_NAME || 'localhost';
const port = process.env.PORT || "8000";

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

initApiRoutes(app);

app.listen(parseInt(port), hostName, () => {
    console.log(`Example app listening on http://${hostName}:${port}/api/v1`);
});

app.use((next: NextFunction) => {
    next(createError(404));
});
app.use((err: any, req: Request, res: Response) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export default app;
