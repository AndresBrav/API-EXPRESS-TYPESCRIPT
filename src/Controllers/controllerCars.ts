import { obtenerCarros } from "../Services/servicesCars";
import verifyToken, { AuthenticatedRequest } from "../Middlewares/verifyToken"; 
import { Request, Response } from "express";

const Cobtenercarros = async (req: AuthenticatedRequest, res: Response) => {

    /*const listaCarros = await Carro.findAll();*/
    const listaCarros = await obtenerCarros(req)

    res.send(listaCarros);
};

export {Cobtenercarros}