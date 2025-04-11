import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";  // Asegúrate de importar jsonwebtoken
import { Secret, SignOptions } from "jsonwebtoken"; // 👈 importa el tipo
import { JwtPayload } from 'jsonwebtoken';
export const validPass = async (passIN: string, passDB: string): Promise<boolean> => {
  try {

    const coincide = await bcrypt.compare(passIN, passDB);
    return coincide;
  } catch (error) {
    throw new Error(error.stack)
  }
}

interface JWTPayload {
  u: string;
  t: string;
}

export const newJWT = (
  u: string,
  t: string,
  tiempo: number | `${number}${"s" | "m" | "h" | "d" | "y"}` = "3h"
): Promise<string> => {
  const payload: JWTPayload = { u, t };

  // 1) Asegurarnos de que la SECRETKEY existe
  const secret = process.env.SECRETKEY as string;
  if (!secret) {
    throw new Error("SECRETKEY no está definida en las variables de entorno");
  }

  // 2) Preparamos las opciones con el tipo correcto
  const options: SignOptions = { expiresIn: tiempo };

  return new Promise((resolve, reject) => {
    // 3) Cast explícito de `secret` al tipo `Secret`
    jwt.sign(
      payload,
      secret,
      options,
      (err, token) => {
        if (err) {
          reject(new Error(err.stack || "Error generating token"));
        } else {
          resolve(token as string);
        }
      }
    );
  });
};


export const validJWT = (token): any => {
  try {
    // const { iat, exp, ...data } = jwt.verify(token, process.env.SECRETKEY as string);
    // console.log("los datos que vienen son .......")
    // console.log(token)
    // const data = jwt.verify(token, process.env.SECRETKEY as string)
    const decoded = jwt.verify(token, process.env.SECRETKEY as string)
    console.log("los datos de decoded es .....")
    console.log(decoded)

    // Si quieres modificar algo o separar campos
    const { iat, exp, ...rest } = decoded as any;
    console.log("los datos de data son .....")
    const data = { iat, exp, ...rest };
    console.log(data)
    // const data = "hola";
    return data;
  } catch (error) {
    throw new Error('Token inválido');
  }
};