import { newJWT, validPass } from "../util/crypt"
import { loginUserModel } from '../Models/auth'
import { respCode, respPhrase } from "../util/httpResponse";
import ResError from "../util/resError";
import jwt from "jsonwebtoken";  // Asegúrate de importar jsonwebtoken
import ResSuccess from "../util/resSuccess";
export const loginUserService = async (loginA: string, claveA: string): Promise<any> => {
    try {
        // console.log("los datos del usuario es.." + loginA)
        // console.log("la clave es usuario es.." + claveA)

        //*************- Llamar al modelo de base de datos *************//
        const result = await loginUserModel(loginA);
        // console.log(result) //trae login,clave,vig,admin
        if (result.rows.length === 1) {
            const passDB = result.rows[0].CLAVE //clave de la baseDatos
            // console.log(passDB)
            const verifPassword = await validPass(claveA, passDB)
            console.log(verifPassword)

            if (verifPassword) {
                if (result.rows[0].STS == 'VIG') {
                  const token = await newJWT(result.rows[0].LOGIN, result.rows[0].TIPO);
                  const data = {
                    token: token
                  }

                  console.log(token)

                return new ResSuccess(respCode.OK, respPhrase.OK.auth1, data); //data es el codigo de authorizacion
                }
                else return new ResError(respCode.UNAUTHORIZED, respPhrase.UNAUTHORIZED.auth2, null);
              }
              else return new ResError(respCode.UNAUTHORIZED, respPhrase.UNAUTHORIZED.auth1, null);

        }
        else return new ResError(respCode.UNAUTHORIZED, respPhrase.UNAUTHORIZED.auth1, null);




    } catch (error) {
        return error
    }
}