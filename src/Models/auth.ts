import User, { UsuariosInstance } from "./modelUser";

export const loginUserModel = async (loginA: string): Promise<{ rows: any[] }> => {
    const user1 = await User.findOne({
        where: { login: loginA },
        attributes: ["login", "clave", "sts", "tipo"],
        raw: true  // <- Esto hace que devuelva un objeto simple 
    });

    //   console.log("El usuario que traigo de la base de datos  es ", user1);

    return {
        rows: user1
            ? [
                // Convertir las claves a mayúsculas
                Object.fromEntries(
                    Object.entries(user1).map(([key, value]) => [key.toUpperCase(), value])
                )
            ]
            : []
    };

}