import User, { UsersInstance } from '../Models/modelUser';
import bcrypt from 'bcrypt'
import  { AuthenticatedRequest } from "../Middlewares/tokenValidator";
import { addUserBD, updateUserBD } from '../types/user.types'
import ResError from '../util/resError';
import { respCode, respPhrase } from '../util/httpResponse';
import ResSuccess from '../util/resSuccess';

export const getUsers = async (req: AuthenticatedRequest): Promise<UsersInstance[]> => {

    const loginusuario = req.DatosToken?.u

    const tipo = await User.findOne({
        where: { login: loginusuario },
        attributes: ["tipo"],
        raw: true  //  return a simple object 
    });

    if (tipo.tipo == "admin") {

        const user: UsersInstance[] = await User.findAll()
        return user;
    }
    else {
        const user: UsersInstance[] = []
        return user;
    }


}


export const getOneUser = async (id: string) => {
    const unUsuario: UsersInstance = await User.findByPk(id);
    if (unUsuario) {
        return unUsuario
    } else {
        return null
    }
}

export const UserExists = async (id) => {
    const user = await User.findByPk(id);
    return !!user; // Returns true if exists, false if not
};

export const delUser = async (id: string): Promise<boolean> => {
    const user: UsersInstance = await User.findByPk(id);
    if (user) {
        await user.destroy();
        return true
    }
    else {
        return false
    }

}


export const addUser = async (user: addUserBD): Promise<boolean> => {

    // Hashear the key before saving it
    const encryptedkey = bcrypt.hashSync(user.clave, 10);

    // Create the user
    const newUser = await User.create({
        login: user.login,
        clave: encryptedkey,  // encrypt key
        sts: user.sts,
        tipo: user.tipo
    });
    return true
}

export const updateUser = async (
    id?: string,
    login?: string,
    clave?: string,
    sts?: string,
    tipo?: string): Promise<ResError | ResSuccess> => {

    const fieldstoUpdate: any = {};

    /* you have to fill in all the fields */
    if (typeof login === "string") { fieldstoUpdate.login = login; }
    else { return new ResError(respCode.BAD_REQUEST, respPhrase.INCORRECT_FIELD.val, null) }

    if (typeof clave === "string") { fieldstoUpdate.clave = bcrypt.hashSync(clave, 10); }
    else { return new ResError(respCode.BAD_REQUEST, respPhrase.INCORRECT_FIELD.val, null) }
    if (typeof sts === "string") { fieldstoUpdate.sts = sts; }
    else { return new ResError(respCode.BAD_REQUEST, respPhrase.INCORRECT_FIELD.val, null) }
    if (typeof tipo === "string") { fieldstoUpdate.tipo = tipo; }
    else { return new ResError(respCode.BAD_REQUEST, respPhrase.INCORRECT_FIELD.val, null) }


    const user = await User.findByPk(id);
    if (!user) {
        return new ResError(respCode.NOT_FOUND, respPhrase.NOT_FOUND.val, null)
    }
    await user.update(fieldstoUpdate);
    const data: string = "the user was succefully updated"
    return new ResSuccess(respCode.ACCEPTED, respPhrase.ACCEPTED.val, data); //data es el codigo de authorizacion
    // return true;

}

export const validateData = (login: string, clave: string, sts: string, tipo: string): boolean => {

    if (typeof login === "string" && typeof clave === "string" && typeof sts === "string" && typeof tipo === "string") {
        return true
    }
    else {
        throw new Error("enter de data correctly")
    }
}