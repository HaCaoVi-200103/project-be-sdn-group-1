import express, { Express } from 'express';
import { getCakesByType, getFirstCakeTypes, viewCakeDetail } from '../controllers/viewCakeManage.controllers';

const route = express.Router();
const viewCakeManageRoute = (app: Express) => {
    route.get("/catalog", getCakesByType);
    route.get("/first-types", getFirstCakeTypes);
    route.get("/details/:id", viewCakeDetail)
    return app.use("/api/v1/cakes", route);
  };

export default viewCakeManageRoute;
