import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export const getServices = async (req, res) => {
    try {
        const services = await prisma.service.findMany();
        res.json({
            ok: true,
            services
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido completar la petición'
        });
    }
};