import express, { Request, Response, Router } from 'express';
import {loginUserService} from '../Services/auth'

export const loginUser = async (req:Request, res:Response) => {

    const { login, clave } = req.body;
    if (!login || !clave) {
        res.status(400).json({ message: "Missing data in the application" });
        return;
    }
    const data = req.body
    const loginA:string =req.body.login;
    const claveA:string =req.body.clave;

    let resp = await loginUserService(loginA,claveA);

    if (resp instanceof Error) { throw resp }
    else { res.status(resp.statuscode).json(resp.response()).end() }

}