import { Request, Response, NextFunction } from 'express';
import resError from "../util/resError";
import * as Crypt from "../util/crypt";
import { respCode, respPhrase } from "../util/httpResponse";
import { JwtPayload } from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
    DatosToken?: JwtPayload;      //is optional or jwt payload type
}

const validToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const token = req.header('x-api-token');
    // console.log(token)
    try {
        req.DatosToken = Crypt.validJWT(token);
        next();
    } catch (error) {
        const newError = new resError(respCode.UNAUTHORIZED, respPhrase.UNAUTHORIZED.tokenValidator1, null);
        res.status(newError.statuscode).json(newError.response()).end(); 
        console.log(newError)
    }
};



export default validToken

