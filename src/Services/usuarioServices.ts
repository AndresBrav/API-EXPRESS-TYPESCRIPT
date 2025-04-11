import { Usuario } from '../interfaces/Usuario';
// import Usuarios from "../Models/usuariosModel"
import { UsuarioActualizado } from '../interfaces/Usuario';
import User,{UsuariosInstance} from '../Models/modelUser';

import { isString, isNumero } from '../Validations/validaciones';

import bcrypt from 'bcrypt'

import verifyToken, { AuthenticatedRequest } from "../Middlewares/verifyToken"; 

export const obtenerUsuarios = async (req: AuthenticatedRequest):Promise<UsuariosInstance[]> => {

    const loginusuario = req.DatosToken?.u  //con el que inicio sesion

    const tipo = await User.findOne({
        where: { login: loginusuario },
        attributes: ["tipo"],
        raw: true  // Esto hace que devuelva un objeto simple 
    });

    if(tipo.tipo == "admin"){

        const user:UsuariosInstance[] = await User.findAll()
        return user;
    }
    else{
        // const user = "No tiene permisos para ver los usuarios"
        const user:UsuariosInstance[]=[]
        return user;
    }

    // const user = await User.findAll()
    // return user;
}


export const obtenerUnUsuario = async (id) => {
    // const { id } = req.params;
    const unUsuario:UsuariosInstance = await User.findByPk(id);
    if (unUsuario) {
        return unUsuario
    } else {
        return null
    }
}

export const existeUsuario = async (id) => {
    const user = await User.findByPk(id);
    return !!user; // Devuelve true si existe, false si no
};

export const eliminarUnUsuario = async (id): Promise<boolean> => {
    const user:UsuariosInstance = await User.findByPk(id);
    if (user) {
        await user.destroy();
        return true
    }
    else{
        return false
    }
    
}


export const aniadirUsuario = async (user):Promise<boolean> => {

    //const { body } = req;
    //await User.create(body);
    // Hashear la clave antes de guardarla
    const claveencriptada = bcrypt.hashSync(user.clave, 10);

    // Crear usuario con clave hasheada
    const nuevoUsuario = await User.create({
        login: user.login,
        clave: claveencriptada,  // Clave encriptada
        sts: user.sts,
        tipo: user.tipo
    });
    return true
}

// import User, { UsuariosInstance } from '../Models/modelUser'; // Asegúrate de que esta ruta sea correcta

// export const obtenerTodosLosUsuarios = async (): Promise<UsuariosInstance[]> => {
//   const usuarios = await User.findAll();
//   if (!usuarios || usuarios.length === 0) {
//     throw new Error('No se encontraron usuarios');
//   }
//   return usuarios;
// };

// export const obtenerTodosLosUsuarios = async (): Promise<any> => {
//     const usuarios = await Usuarios.findAll();
//     if (!usuarios || usuarios.length === 0) {
//         throw new Error('No se encontraron usuarios');
//     }
//     return usuarios;
// }

/* export const consultarDetalleUsuario = async (id: string): Promise<UsuariosInstance> => {

    // console.log("el parametro que se paso es "+isString(id))
    const tipoID = isString(id);

    if (tipoID) {
        const usuario:UsuariosInstance = await User.findByPk(id)
        return usuario;
    }
    else {
        throw new Error("pasa el tipo de dato correcto")
    }
}



export const aniadirUsuario = async (username: any, edad: any, password: any): Promise<boolean> => {
    if (isNumero(edad) && isString(username) && isString(password)) {
        const usuarioA:UsuarioActualizado ={username,edad,password}
        // const usuario = {
        //     username,
        //     edad,
        //     password
        // };
        await User.create(usuarioA)
        return true;
    }
    else {
        return false;
    }
}


export const actualizarUsuario = async (username: any, edad: any, password: any, id: string): Promise<boolean> => {
    const usuario = await User.findByPk(id);
    
    if (!usuario) {
        throw new Error("Usuario no encontrado");
    }

    // Verificar si los tres parámetros son undefined
    if (username === undefined && edad === undefined && password === undefined) {
        throw new Error("No se proporcionaron campos para actualizar");
    }

    const usuarioActualizado: UsuarioActualizado = {};



    // Verificar si no es undefined antes de agregar al objeto
    if (username !== undefined && isString(username)) {
        usuarioActualizado.username = username;
    }

    if (edad !== undefined && isNumero(edad)) {
        usuarioActualizado.edad = edad;
    }

    if (password !== undefined && isString(password)) {
        usuarioActualizado.password = password;
    }

    // Actualizamos el usuario con los campos que no son undefined
    await usuario.update(usuarioActualizado);
    return true;
}

export const borrarUsuario = async (id: string): Promise<boolean> => {
    let resultado:boolean = false;
    const usuario = await User.findByPk(id)
    console.log("vamos a eliminar el usuario.........")

    if (usuario !== null) {
        console.log(usuario)
        await usuario.destroy();
        resultado=true;
    }
    return resultado;
} */