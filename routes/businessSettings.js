import express from "express";
import { JSWValidator } from "../middlewares/jwt-validator.js";
import { isAdmin } from "../middlewares/is-admin.js";
import { getBusinessSettings, addDateToServiceAvailability, deleteDateFromServiceAvailability, addServiceToServiceAvailability, removeServiceFromServiceAvailability, getServiceDates } from "../controllers/businessSettings.js";

const businessSettingsRouter = express.Router();

businessSettingsRouter.get('/', 
    [
        JSWValidator
    ], 
    getBusinessSettings
);

businessSettingsRouter.get('/service/:serviceId/dates', 
    [
        JSWValidator
    ],
    getServiceDates
);

businessSettingsRouter.put('/service', 
    [
        JSWValidator
    ], 
    addServiceToServiceAvailability
);

businessSettingsRouter.delete('/service', 
    [
        JSWValidator
    ], 
    removeServiceFromServiceAvailability
);

businessSettingsRouter.put('/dates', 
    [
        JSWValidator, isAdmin
    ], 
    addDateToServiceAvailability
);

businessSettingsRouter.delete('/dates', 
    [
        JSWValidator, isAdmin
    ], 
    deleteDateFromServiceAvailability
);

export default businessSettingsRouter;