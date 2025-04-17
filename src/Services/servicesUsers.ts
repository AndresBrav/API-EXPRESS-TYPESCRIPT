// import Usuarios from "../Models/usuariosModel"
import User, { UsuariosInstance } from '../Models/modelUser';

// import { isString, isNumero } from '../Validations/validaciones';

import bcrypt from 'bcrypt'

import verifyToken, { AuthenticatedRequest } from "../Middlewares/verifyToken";
import { addUserBD, updateUserBD } from '../types/user.types'
import ResError from '../util/resError';
import { respCode, respPhrase } from '../util/httpResponse';
import ResSuccess from '../util/resSuccess';

export const obtenerUsuarios = async (req: AuthenticatedRequest): Promise<UsuariosInstance[]> => {

    const loginusuario = req.DatosToken?.u  //con el que inicio sesion

    const tipo = await User.findOne({
        where: { login: loginusuario },
        attributes: ["tipo"],
        raw: true  // Esto hace que devuelva un objeto simple 
    });

    if (tipo.tipo == "admin") {

        const user: UsuariosInstance[] = await User.findAll()
        return user;
    }
    else {
        // const user = "No tiene permisos para ver los usuarios"
        const user: UsuariosInstance[] = []
        return user;
    }

    // const user = await User.findAll()
    // return user;
}


export const obtenerUnUsuario = async (id) => {
    // const { id } = req.params;
    const unUsuario: UsuariosInstance = await User.findByPk(id);
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

export const eliminarUnUsuario = async (id:string): Promise<boolean> => {
    const user: UsuariosInstance = await User.findByPk(id);
    if (user) {
        await user.destroy();
        return true
    }
    else {
        return false
    }

}


export const aniadirUsuario = async (user: addUserBD): Promise<boolean> => {

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

export const SactualizarUnUsuario = async (id?: string, login?: string, clave?: string, sts?: string, tipo?: string): Promise<ResError | ResSuccess> => {

    

    const camposAActualizar: any = {};

    if (typeof login === "string") { camposAActualizar.login = login; }
    else { return new ResError(respCode.BAD_REQUEST, respPhrase.INCORRECT_FIELD.val, null)  }

    if (typeof clave === "string") { camposAActualizar.clave = bcrypt.hashSync(clave, 10); }
    else { return new ResError(respCode.BAD_REQUEST, respPhrase.INCORRECT_FIELD.val, null)  }
    if (typeof sts === "string") { camposAActualizar.sts = sts; }
    else { return new ResError(respCode.BAD_REQUEST, respPhrase.INCORRECT_FIELD.val, null)  }
    if (typeof tipo === "string") { camposAActualizar.tipo = tipo; }
    else { return new ResError(respCode.BAD_REQUEST, respPhrase.INCORRECT_FIELD.val, null)  }

    const usuario = await User.findByPk(id);
    if (!usuario) {
        return new ResError(respCode.NOT_FOUND, respPhrase.NOT_FOUND.val, null)
    }
    await usuario.update(camposAActualizar);
    const data:string = "el usuario se actualizo con exito"
    return new ResSuccess(respCode.ACCEPTED, respPhrase.ACCEPTED.val, data); //data es el codigo de authorizacion
    // return true;

}

export const validarDatos = (login: string, clave: string, sts: string, tipo: string): boolean => {

    if (typeof login === "string" && typeof clave === "string" && typeof sts === "string" && typeof tipo === "string") {
        return true
    }
    else {
        throw new Error("ingresa los datos correctamente")
    }
}