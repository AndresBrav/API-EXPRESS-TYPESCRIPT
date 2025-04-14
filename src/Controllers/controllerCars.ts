import { obtenerCarros, obtenerUnCarro, existeCarro, eliminarUnCarro, aniadirCarro, ActualizarCarro } from "../Services/servicesCars";
import verifyToken, { AuthenticatedRequest } from "../Middlewares/verifyToken";
import { Request, Response } from "express";
import User from "../Models/modelUser";
import Car from "../Models/modelCar";

const Cobtenercarros = async (req: AuthenticatedRequest, res: Response) => {

    /*const listaCarros = await Carro.findAll();*/
    const listaCarros = await obtenerCarros(req)

    res.send(listaCarros);
};

const Cobteneruncarro = async (req: AuthenticatedRequest, res: Response) => {
    // const data = req.body
    const { id } = req.params

    const carro = await obtenerUnCarro(id);

    const existe = await existeCarro(id)
    console.log(`el carro existe ? ${existe}`);
    try {
        if (existe) {
            res.json(carro);
        }
        else {
            res.json(
                { msg: `el carro con id:${id} no existe` }
            )
        }
    }
    catch (error) {
        res.send(error)
        //res.end();
    }

};

const CeliminarCarro = async (req: AuthenticatedRequest, res: Response) => {
    const loginUsuario = req.DatosToken?.u
    const { id } = req.params
    const resultado: boolean = await eliminarUnCarro(loginUsuario, id)

    if (resultado) {
        res.json({
            msg: `Se eliminó el carro con ID ${id}`
        });
    }
    else {
        res.json({
            msg: `El carro con ${id} no pertenece al usuario`
        });
    }
};

const CaniadirCarro = async (req: AuthenticatedRequest, res: Response) => {
    const { nombre, descripcion, precio, stock } = req.body
    //console.log("recuperado de usrt ", req.usrT.u);
    const loginusuario = req.DatosToken?.u  //con el que inicio sesion

    const resultado = await aniadirCarro(nombre, descripcion, precio, stock, loginusuario)
    // console.log(resultado)
    res.json({
        msg: "auto añadido exitosamente",
        auto: resultado
    })
};

const CactualizarCarro = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { body } = req;
    const login = req.DatosToken?.u
    try {

        const resultado = await ActualizarCarro(id, body, login)

        res.json({
            msg: "carro actualizado",
            autoActualizado: resultado
        })
    }
    catch (error) {
        if (error instanceof Error) {
            res.json({msg: "An error occurred:",
                msgerror: error.message});
        } else {
            console.error('An unknown error occurred:', error);
        }
    }

};




export { Cobtenercarros, Cobteneruncarro, CeliminarCarro, CaniadirCarro, CactualizarCarro }