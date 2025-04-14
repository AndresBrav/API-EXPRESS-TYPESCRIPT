import Car from "../Models/modelCar";
import User from "../Models/modelUser";
import verifyToken, { AuthenticatedRequest } from "../Middlewares/verifyToken"; 


export const obtenerCarros = async (req: AuthenticatedRequest) => {
    const loginUsuario = req.DatosToken?.u 
    console.log("recuperado de usrt ", req.DatosToken?.u );

    // Obtener el ID del usuario a partir de su nombre
    const usuario = await User.findOne({ where: { login: loginUsuario } });
    //console.log("El usuario que vino es:", JSON.stringify(usuario, null, 2));
    const idUsuario = usuario.id;
    console.log("el id del usuario es " + idUsuario);


    /*****Retornar carros  */
    // Obtener los carros asociados a ese usuario
    const carros = await Car.findAll({ where: { user_id: idUsuario } });

    //const carro = await Carro.findAll()
    return carros;
}