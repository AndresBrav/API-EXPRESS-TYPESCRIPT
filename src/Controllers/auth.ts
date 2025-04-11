import express, { Request, Response, Router } from 'express';
import {loginUserService} from '../Services/auth'

export const loginUser = async (req:Request, res:Response) => {

    const { login, clave } = req.body;
    console.log("Ingreso a Autenticación");
    if (!login || !clave) {
        res.status(400).json({ message: "Faltan datos en la solicitud" });
        return;
    }
    const data = req.body
    const loginA:string =req.body.login;
    const claveA:string =req.body.clave;

    let resp = await loginUserService(loginA,claveA);

    if (resp instanceof Error) { throw resp }
    else { res.status(resp.statuscode).json(resp.response()).end() }

    // res.end()
    // if (resp instanceof Error) { throw resp }
    // else { res.status(resp.statuscode).json(resp.response()).end() }

}