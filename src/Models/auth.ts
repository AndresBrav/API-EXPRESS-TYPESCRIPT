import User, { UsersInstance } from "./modelUser";

export const loginUserModel = async (loginA: string): Promise<{ rows: any[] }> => {
    const user1 = await User.findOne({
        where: { login: loginA },
        attributes: ["login", "clave", "sts", "tipo"],
        raw: true  // <- this return a simple object 
    });

    return {
        rows: user1
            ? [
                // Convert keys to Uppercase
                Object.fromEntries(
                    Object.entries(user1).map(([key, value]) => [key.toUpperCase(), value])
                )
            ]
            : []
    };

}