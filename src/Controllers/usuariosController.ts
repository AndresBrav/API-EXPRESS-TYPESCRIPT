import { Request, Response } from "express";
import jwt from "jsonwebtoken";  // Asegúrate de importar jsonwebtoken
// import cors from "cors";
import verifyToken, { AuthenticatedRequest } from "../Middlewares/verifyToken";  // Importa verifyToken
import User,{UsuariosInstance} from "../Models/modelUser"

import { Usuario } from "../interfaces/Usuario";
import { obtenerUsuarios,obtenerUnUsuario,existeUsuario,eliminarUnUsuario,aniadirUsuario } from "../Services/usuarioServices";
// import { obtenerTodosLosUsuarios, consultarDetalleUsuario, aniadirUsuario, actualizarUsuario, borrarUsuario } from '../Services/usuarioServices'


const CobtenerUsuarios = async(req: AuthenticatedRequest, res: Response) => {
    console.log("estamos obteniendo .....")
    const listaUsuarios = await obtenerUsuarios(req)
    console.log(!listaUsuarios)
    if(listaUsuarios.length===0){
        res.send("no tienes permisos para acceder a los usuarios")
    }
    else{
        res.send(listaUsuarios);
    }
    
}

const CobtenerUnUsuario = async (req: AuthenticatedRequest, res: Response) => {
    // const data = req.body
    const { id } = req.params

    const user:UsuariosInstance = await obtenerUnUsuario(id)

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
    const {id} = req.params
    const seelimino =await eliminarUnUsuario(id)

    if(seelimino){
        res.json({
            msg: `Se eliminó el usuario con ID ${id}`
        });
    }else{
        res.json({
            msg: `no existe  el usuario con ID ${id}`
        });
    }

};

const CaniadirUsuario = async (req: AuthenticatedRequest, res: Response) => {
    const { login, clave, sts, tipo } = req.body;
    const user = { login, clave, sts, tipo } 

    const seaniadio = await aniadirUsuario(user)

    if(seaniadio){
        res.json({
            msg: "Usuario fue agregado con éxito",
            
        });
    }
    else{
        res.json({
            msg: "no se añadio"
        })
    }

};

// const consultarUsuarios = async (req: AuthenticatedRequest, res: Response) => {
//     try {
//         console.log("Datos del token:", req.DatosToken?.username); // Sin await
//         const usuarios = await obtenerTodosLosUsuarios();  //llama al Servicio
//         res.json({
//             // username: `los datos son ${req.DatosToken.username}`,
//             msg: usuarios
//         });
//     } catch (err) {
//         if (err instanceof Error) {
//             res.status(500).send(err.message);
//         }
//     }
// };


// // Función para consultar detalles de un usuario
// const consultarDetalle = async (req: AuthenticatedRequest, res: Response) => {
//     const { id } = req.params;

//     const usuario = await consultarDetalleUsuario(id)    //llama al servicio
//     try {
//         res.json({
//             id: `Este es el id que se paso ${id}`,
//             username: `los datos del token son ${req.DatosToken}`,
//             msg: usuario
//         })
//         // Aquí puedes agregar la lógica para consultar los detalles del usuario con el id
//     } catch (err) {
//         if (err instanceof Error) {
//             res.status(500).send(err.message);
//         }
//     }
// };

// // Función para ingresar un nuevo usuario
// const ingresar = async (req: Request, res: Response) => {
//     try {
//         const { username, edad, password } = req.body;
//         const datosCorrectos: boolean = await aniadirUsuario(username, edad, password)

//         // console.log("vamos a verificar")
//         // console.log(datosCorrectos)

//         if (datosCorrectos) {
//             res.json({
//                 msg: 'se creo correctamente el usuario'
//             })

//         }
//         else {
//             res.json({
//                 msg: 'ingresa correctamente los datos'
//             })
//         }
//         // Aquí agregas la lógica para ingresar el usuario
//     } catch (err) {
//         if (err instanceof Error) {
//             res.status(500).send(err.message);
//         }
//     }
// };

// // Función para actualizar un usuario
// const actualizar = async (req: Request, res: Response) => {

//     try {

//         const { id } = req.params
//         const { username, edad, password } = req.body;
//         const datosCorrectos: boolean = await actualizarUsuario(username, edad, password, id);

//         if (datosCorrectos) {
//             res.json({
//                 msg: " el usuario fue actualizado con exito "
//             })
//         } else {
//             res.json("el usuario no se pudo actualizar")
//         }


//         // Aquí puedes agregar la lógica para actualizar el usuario con el id
//     } catch (err) {
//         if (err instanceof Error) {
//             res.status(500).send(err.message);
//         }
//     }
// };

// // Función para borrar un usuario
// const borrar = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params

//         const usuarioEliminado = await borrarUsuario(id)

//         if (usuarioEliminado) {
//             res.json({
//                 msg: 'el usuario fue eliminado con exito'
//             })
//         } else {
//             res.status(404).json({
//                 msg: `no existe el usuario ${id}`
//             })
//         }
//         // Aquí agregas la lógica para borrar el usuario con el id
//     } catch (err) {
//         if (err instanceof Error) {
//             res.status(500).send(err.message);
//         }
//     }
// };


// Función para ingresar un nuevo usuario
// const RegistrarLogin = async (req: Request, res: Response) => {
//     const { login, edad, clave } = req.body;

//     if (!login || !clave || !edad) {
//         res.status(400).json({ message: "Faltan datos en la solicitud" });
//         return;
//     }
//     // const usuario:Usuario = { username, password };
//     if (typeof login === 'string' && typeof clave === 'string') {
//         console.log("los datos son de tipo string")
//         const usuario = { login, edad, clave }
//         await Usuarios.create(usuario)  //lo crea en la base de datos

//         const UsuarioA = { login, clave }

//         const UsuarioArevisar: Usuario = UsuarioA
//         let existe = await verificarLogin(UsuarioArevisar);
//         // console.log(existe)
//         if (existe) {
//             //Crear un token con expiración
//             const token = jwt.sign(UsuarioArevisar, "miSecreto", { expiresIn: "1h" });
//             res.json({ token });
//         }
//         else {
//             res.json({ msg: 'el usuario que ingresaste no existe Registrate' })
//         }
//     }
//     else {
//         res.json({ msg: "Ingresa correctamente el usuario" })
//     }

// };





// Exportar las funciones para usarlas en las rutas
export {CobtenerUsuarios,CobtenerUnUsuario,CeliminarUnUsuario,CaniadirUsuario /*consultarUsuarios, consultarDetalle, ingresar, actualizar, borrar,RegistrarLogin*/  };
