import { Request, Response } from "express";
import jwt from "jsonwebtoken";  // Asegúrate de importar jsonwebtoken
// import cors from "cors";
import verifyToken, { AuthenticatedRequest } from "../Middlewares/verifyToken";  // Importa verifyToken
import User, { UsuariosInstance } from "../Models/modelUser"
import { obtenerUsuarios, obtenerUnUsuario, existeUsuario, eliminarUnUsuario, aniadirUsuario, SactualizarUnUsuario, validarDatos } from "../Services/servicesUsers";
// import { obtenerTodosLosUsuarios, consultarDetalleUsuario, aniadirUsuario, actualizarUsuario, borrarUsuario } from '../Services/usuarioServices'
import bcrypt from 'bcrypt'
import { addUserBD } from '../types/user.types'

import ResError from "../util/resError"; //importar el constructar
import ResSuccess from "../util/resSuccess";



const CobtenerUsuarios = async (req: AuthenticatedRequest, res: Response) => {
    console.log("estamos obteniendo .....")
    const listaUsuarios = await obtenerUsuarios(req)
    // console.log(!listaUsuarios)
    if (listaUsuarios.length === 0) {
        res.send("no tienes permisos para acceder a los usuarios")
    }
    else {
        res.send(listaUsuarios);
    }

}

const CobtenerUnUsuario = async (req: AuthenticatedRequest, res: Response) => {
    // const data = req.body
    const { id } = req.params

    const user: UsuariosInstance = await obtenerUnUsuario(id)

    const existe = await existeUsuario(id)
    console.log(`el usuario existe ? ${existe}`);
    try {
        if (existe) {
            res.json(user);
        }
        else {
            res.json(
                { msg: `el usuario con id:${id} no existe` }
            )
        }
    }
    catch (error) {
        res.send(error)
        //res.end();
    }

};

const CeliminarUnUsuario = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params
    const seelimino = await eliminarUnUsuario(id)

    if (seelimino) {
        res.json({
            msg: `Se eliminó el usuario con ID ${id}`
        });
    } else {
        res.json({
            msg: `no existe  el usuario con ID ${id}`
        });
    }

};

const CaniadirUsuario = async (req: AuthenticatedRequest, res: Response) => {

    try {
        const { login, clave, sts, tipo } = req.body;
        const datosCorrectos: boolean = validarDatos(login, clave, sts, tipo); //vamos a verificar que todo este correcto

        console.log("los datos que trae es : " + datosCorrectos)


        if (datosCorrectos) {
            const user: addUserBD = { login, clave, sts, tipo }

            const seaniadio = await aniadirUsuario(user)
            // const seaniadio = true

            if (seaniadio) {
                res.json({
                    msg: "Usuario fue agregado con éxito",

                });
            }

        }

    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("ingresa los datos correctamente")) {
                res.status(400).json({ msg: error.message })
                return
            }
        }
    }


};

const CactualizarUnUsuario = async (req: AuthenticatedRequest, res: Response) => {


    const { id } = req.params;
    const { login, clave, sts, tipo } = req.body;

    const resp: ResError | ResSuccess = await SactualizarUnUsuario(id, login, clave, sts, tipo);
    // console.log(resp)
    console.log("el error es nativo ? " + (resp instanceof Error))

    if ((resp instanceof Error)) {

        // throw resp 
        console.log("el error pertence a  la clase")
        res.status(resp.statuscode).json({
            msg: "el usuario no se actualizo",
            resp: resp.response()
        }).end()

    }
    else {
        console.log("el succes es de la clase definida")
        res.status(resp.statuscode).json({
            msg: "el usuario  se actualizo",
            resp: resp.response()
        }).end()
    }
};

// Exportar las funciones para usarlas en las rutas
export { CobtenerUsuarios, CobtenerUnUsuario, CeliminarUnUsuario, CaniadirUsuario, CactualizarUnUsuario /*consultarUsuarios, consultarDetalle, ingresar, actualizar, borrar,RegistrarLogin*/ };
