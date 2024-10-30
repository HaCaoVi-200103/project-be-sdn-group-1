import express, { Request, NextFunction, Response } from "express";
import path from "path";
import createError from "http-errors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import "dotenv/config";
import initApiRoutes from "./routes/index";
import connectionDB from "./config/database";
import session from "express-session";
// import uploadFileRoute from './routes/uploadFile';
import ratingApiRoutes from "./routes/ratingRoute";
import cakeManagementRoute from "./routes/cakeManagementRoute";
import staffApiRoutes from "./routes/staffRoute";
import cartManagementRoute from "./routes/cartRoute";

const app = express();

//Setup Config
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "!#!@$#%$#%#$%$#@#$@{#@!#!}{!@}{#}",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3 * 24 * 60 * 60 },
  })
);

//Setup Routes
initApiRoutes(app);
// uploadFileRoute(app)
ratingApiRoutes(app);
cakeManagementRoute(app);
staffApiRoutes(app);
cartManagementRoute(app);


app.all("*", (req: Request, res: Response) => {
  return res.status(200).send("API endpoint not found");
});
//Handle Error
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});
app.use((err: any, req: Request, res: Response) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//Connect MongoDB
connectionDB();

export default app;
