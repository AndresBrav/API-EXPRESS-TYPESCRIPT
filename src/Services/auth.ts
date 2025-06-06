import { newJWT, validPass } from "../util/crypt"
import { loginUserModel } from '../Models/auth'
import { respCode, respPhrase } from "../util/httpResponse";
import ResError from "../util/resError";
import ResSuccess from "../util/resSuccess";
import { encrypt, decrypt } from "../util/encrypt";

export const loginUserService = async (loginA: string, claveA: string): Promise<any> => {
    try {
        //*************- Call database Model *************//
        const result = await loginUserModel(loginA);
        // console.log(result) //bring login,clave,vig,admin
        if (result.rows.length === 1) {
            const passDB = result.rows[0].CLAVE //clave from DB
            const verifPassword = await validPass(claveA, passDB)
            console.log(verifPassword)

            if (verifPassword) {
                if (result.rows[0].STS == 'VIG') {
                  const token = await newJWT(result.rows[0].LOGIN, result.rows[0].TIPO);
                  const tokenEncrypt = encrypt(token)
                  const data = {
                    token: tokenEncrypt
                  }

                  // console.log(token)

                return new ResSuccess(respCode.OK, respPhrase.OK.auth1, data); //data is the authorization code
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