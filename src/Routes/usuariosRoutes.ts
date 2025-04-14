import express, { Request, Response, Router } from 'express';
import { /*consultarUsuarios, consultarDetalle, ingresar, actualizar, borrar, RegistrarLogin,*/ CobtenerUsuarios, CobtenerUnUsuario, CeliminarUnUsuario, CaniadirUsuario, CactualizarUnUsuario } from '../Controllers/usuariosController'; // Asegúrate de importar las funciones from '../Controllers/usuariosController'
import jwt from "jsonwebtoken";  // Asegúrate de importar jsonwebtoken
// import cors from "cors";
import { Usuario } from '../interfaces/Usuario';
import { loginUser } from '../Controllers/auth';
import validToken, { AuthenticatedRequest } from '../Middlewares/tokenValidator';

const rutasUsuarios: Router = express.Router();

rutasUsuarios.get('/getUsers', [validToken], CobtenerUsuarios);

rutasUsuarios.get('/getUsers/:id', [validToken], CobtenerUnUsuario);

rutasUsuarios.delete('/delUsers/:id', [validToken], CeliminarUnUsuario);

rutasUsuarios.post('/addUser', [validToken], CaniadirUsuario);

rutasUsuarios.put('/update/:id', [validToken], CactualizarUnUsuario);

rutasUsuarios.post("/login/iniciar", loginUser)


/* // Ruta protegida que requiere token
rutasUsuarios.get("/protected/usuario", validToken, (req: AuthenticatedRequest, res: Response): void => {
    res.send(`Acceso permitido a la ruta protegida. El username del usuario es: ${req.DatosToken?.u}`);
}); */


export default rutasUsuarios;