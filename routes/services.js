import express from "express";
import { JSWValidator } from "../middlewares/jwt-validator.js";
import { getServices } from "../controllers/services.js";

const servicesRouter = express.Router();


servicesRouter.get('/', 
    [
        JSWValidator
    ], 
    getServices
);


export default servicesRouter;