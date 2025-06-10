import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";  // Make sure to import jsonwebtoken
import { Secret, SignOptions } from "jsonwebtoken"; // 👈 import the type
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

  // 1) Ensuring that SECRETKEY exists
  const secret = process.env.SECRETKEY as string;
  if (!secret) {
    throw new Error("SECRETKEY is not defined in .env");
  }

  // 2) Prepare the options with the correct type
  const options: SignOptions = { expiresIn: tiempo };

  return new Promise((resolve, reject) => {
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
    
    const decoded = jwt.verify(token, process.env.SECRETKEY as string)
    const { iat, exp, ...rest } = decoded as any;
    const data = { iat, exp, ...rest };
    return data;
  } catch (error) {
    throw new Error('Invalid Token');
  }
};