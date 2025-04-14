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

export const SactualizarUnUsuario = async (id:string,login:string,clave:string,sts:string,tipo:string):Promise<boolean> => {
    // const { login, clave, sts, tipo } = req.body;
    const claveencriptada = bcrypt.hashSync(clave, 10);
    const carro = await User.findByPk(id);

    if (carro) {
        await carro.update({
            login: login,
            clave: claveencriptada,  // Clave encriptada
            sts: sts,
            tipo: tipo
        });
        return true;
    }
    else{
        return false;
    }
}