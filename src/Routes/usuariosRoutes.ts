import express, { Request, Response, Router } from 'express';
import { /*consultarUsuarios, consultarDetalle, ingresar, actualizar, borrar, RegistrarLogin,*/ verificarLogin } from '../Controllers/usuariosController'; // Asegúrate de importar las funciones from '../Controllers/usuariosController'
import jwt from "jsonwebtoken";  // Asegúrate de importar jsonwebtoken
// import cors from "cors";

import { Usuario } from '../interfaces/Usuario';
import { loginUser } from '../Controllers/auth';
import validToken, { AuthenticatedRequest } from '../Middlewares/tokenValidator';

const router: Router = express.Router();

// router.get('/consultar', verifyToken, consultarUsuarios);

// router.post('/ingresar', verifyToken, ingresar);

// router.route("/detalles/:id")
//     .get(verifyToken, consultarDetalle)  // Aplica verifyToken al método GET
//     .put(verifyToken, actualizar)        // Aplica verifyToken al método PUT
//     .delete(verifyToken, borrar);

// router.post("/login/registrar", RegistrarLogin);

//Ruta para obtener un token
/* router.post("/login/iniciar", async (req: Request, res: Response) => {
    const { login, clave } = req.body;

    if (!login || !clave) {
        res.status(400).json({ message: "Faltan datos en la solicitud" });
        return;
    }

    

    console.log("la clave que esta trayendo es "+clave)
    const usuario: Usuario = { login, clave };

    let existe = await verificarLogin(usuario);                   //verifica que el usuario exista en la BD
    console.log(existe)
    if (existe) {
        //Crear un token con expiración
        const token = jwt.sign(usuario, "miSecreto", { expiresIn: "4h" });
        res.json({ token });
    }
    else {
        res.json({ msg: 'el usuario que ingresaste no existe Registrate' })
    }

}); */

router.post("/login/iniciar", loginUser)


// Ruta protegida que requiere token
router.get("/protected/usuario", validToken, (req: AuthenticatedRequest, res: Response): void => {
    res.send(`Acceso permitido a la ruta protegida. El username del usuario es: ${req.DatosToken?.u}`);
});

// Ruta para obtener datos del usuario desde el token
// router.get("/hola/usuario", verifyToken, (req: AuthenticatedRequest, res: Response): void => {
//     const { username, password } = req.DatosToken || {};

//     if (!password || !username) {
//         res.status(400).json({ message: "Token inválido" });
//         return;
//     }

//     res.send(`El id del usuario es: ${password}, El username es: ${username}`);
// });

export default router;