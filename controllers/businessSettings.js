import { PrismaClient } from "@prisma/client";
import config from "../config.js";

const prisma = new PrismaClient();

export const getBusinessSettings = async (req, res) => {
    try {
        const settings = await prisma.businessSettings.findUnique({
            where: { id: config.BUSINESS_SETTINGS_ID }
        });
        // Parsear serviceAvailability
        settings.serviceAvailability = JSON.parse(settings.serviceAvailability);
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener configuraciones" });
    }
};

export const getServiceDates = async (req, res) => {
    const { serviceId } = req.params;
    try {
        const settings = await prisma.businessSettings.findUnique({
            where: { id: config.BUSINESS_SETTINGS_ID }
        });

        // Parsear serviceAvailability
        const serviceAvailability = JSON.parse(settings.serviceAvailability);

        const service = serviceAvailability.find(s => s.serviceId === serviceId);
        if (!service) {
            return res.status(404).json({ error: "Servicio no encontrado" });
        }

        res.json({ dates: service.dates });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las fechas del servicio" });
    }
};

export const addServiceToServiceAvailability = async (req, res) => {
    const { serviceId } = req.body;
    if (!serviceId) return res.status(400).json({ error: "Falta serviceId" });

    try {
        const settings = await prisma.businessSettings.findUnique({
            where: { id: config.BUSINESS_SETTINGS_ID }
        });

        // Parsear serviceAvailability
        let serviceAvailability = JSON.parse(settings.serviceAvailability);

        serviceAvailability.push({ serviceId, dates: [] });

        // Convertir nuevamente a string antes de actualizar en la DB
        await prisma.businessSettings.update({
            where: { id: config.BUSINESS_SETTINGS_ID },
            data: {
                serviceAvailability: JSON.stringify(serviceAvailability)
            }
        });

        res.json({ message: "Servicio añadido" });
    } catch (error) {
        res.status(500).json({ error: "Error al añadir servicio" });
    }
};

export const removeServiceFromServiceAvailability = async (req, res) => {
    const { serviceId } = req.body;
    if (!serviceId) return res.status(400).json({ error: "Falta serviceId" });

    try {
        const settings = await prisma.businessSettings.findUnique({
            where: { id: config.BUSINESS_SETTINGS_ID }
        });

        // Parsear serviceAvailability
        let serviceAvailability = JSON.parse(settings.serviceAvailability);

        // Filtrar el servicio a eliminar
        const updatedAvailability = serviceAvailability.filter(s => s.serviceId !== serviceId);

        // Convertir nuevamente a string antes de actualizar en la DB
        await prisma.businessSettings.update({
            where: { id: config.BUSINESS_SETTINGS_ID },
            data: { serviceAvailability: JSON.stringify(updatedAvailability) }
        });

        res.json({ message: "Servicio eliminado" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar servicio" });
    }
};

export const addDateToServiceAvailability = async (req, res) => {
    const { serviceId, date } = req.body;
    if (!serviceId || !date) return res.status(400).json({ error: "Faltan datos" });

    try {
        const settings = await prisma.businessSettings.findUnique({
            where: { id: config.BUSINESS_SETTINGS_ID }
        });

        // Parsear serviceAvailability
        let serviceAvailability = JSON.parse(settings.serviceAvailability);

        // Actualizar las fechas del servicio correspondiente
        const updatedAvailability = serviceAvailability.map(s =>
            s.serviceId === serviceId
                ? { ...s, dates: [...s.dates, date] }
                : s
        );

        // Convertir nuevamente a string antes de actualizar en la DB
        await prisma.businessSettings.update({
            where: { id: config.BUSINESS_SETTINGS_ID },
            data: { serviceAvailability: JSON.stringify(updatedAvailability) }
        });

        res.json({ message: "Fecha añadida" });
    } catch (error) {
        res.status(500).json({ error: "Error al añadir fecha" });
    }
};

export const deleteDateFromServiceAvailability = async (req, res) => {
    const { serviceId, date } = req.body;
    if (!serviceId || !date) return res.status(400).json({ error: "Faltan datos" });

    try {
        const settings = await prisma.businessSettings.findUnique({
            where: { id: config.BUSINESS_SETTINGS_ID }
        });

        // Parsear serviceAvailability
        let serviceAvailability = JSON.parse(settings.serviceAvailability);

        // Actualizar las fechas del servicio correspondiente
        const updatedAvailability = serviceAvailability.map(s =>
            s.serviceId === serviceId
                ? { ...s, dates: s.dates.filter(d => d !== date) }
                : s
        );

        // Convertir nuevamente a string antes de actualizar en la DB
        await prisma.businessSettings.update({
            where: { id: config.BUSINESS_SETTINGS_ID },
            data: { serviceAvailability: JSON.stringify(updatedAvailability) }
        });

        res.json({ message: "Fecha eliminada" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar fecha" });
    }
};
