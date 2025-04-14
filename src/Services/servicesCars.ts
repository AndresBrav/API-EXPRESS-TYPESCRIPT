import Car,{CarsInterface} from "../Models/modelCar";
import User from "../Models/modelUser";
import verifyToken, { AuthenticatedRequest } from "../Middlewares/verifyToken"; 
import { Request, Response } from "express";

export const obtenerCarros = async (req: AuthenticatedRequest):Promise<CarsInterface[]> => {
    const loginUsuario = req.DatosToken?.u 
    console.log("recuperado de usrt ", req.DatosToken?.u );

    // Obtener el ID del usuario a partir de su nombre
    const usuario = await User.findOne({ where: { login: loginUsuario } });
    //console.log("El usuario que vino es:", JSON.stringify(usuario, null, 2));
    const idUsuario = usuario.id;
    console.log("el id del usuario es " + idUsuario);


    /*****Retornar carros  */
    // Obtener los carros asociados a ese usuario
    const carros:CarsInterface[] = await Car.findAll({ where: { user_id: idUsuario } });

    //const carro = await Carro.findAll()
    return carros;
}


export const obtenerUnCarro = async (id:string) => {
    const unCarro = await Car.findByPk(id);
    if (unCarro) {
        return unCarro
    } else {
        return null
    }
}

export const existeCarro = async (id) => {
    const carro = await Car.findByPk(id);
    return !!carro; // Devuelve true si existe, false si no
};

export const eliminarUnCarro = async (loginUsuario:string | undefined,id:string):Promise<boolean> => {

    const loginusuario = loginUsuario//con el que inicio sesion
    // const { body } = req.body;
    const idUsuario = await User.findOne({
        where: { login: loginusuario },
        attributes: ["id"],
        raw: true  // <- Esto hace que devuelva un objeto simple 
    });

    // Extraer solo el ID
    const userId = idUsuario ? idUsuario.id : null;

    console.log("el id del usuario es " + userId);



    const user_ids = await Car.findAll({
        where: { user_id: userId },
        raw: true
    });

    console.log("el id de los usuarios es.......");
    console.log(user_ids);

    const userIdArray = user_ids.map(user => user.id);
    console.log(userIdArray);
    // res.end();
    // const { id } = req.params;

    let pertenece = userIdArray.includes(Number(id));
    // console.log(pertenece)
    if (pertenece) {
        const carro = await Car.findByPk(id);
        await carro.destroy();
        return true
        
    }
    else{
        return false
        
    }

}

export const aniadirCarro = async (nombre:string,descripcion:string,precio:number,stock:number,loginUsuario:string):Promise<CarsInterface> => {


    //console.log("recuperado de usrt ", req.usrT.u);

    const loginusuario = loginUsuario  //con el que inicio sesion
    // const { body } = req.body;
    const idUsuario = await User.findOne({
        where: { login: loginusuario },
        attributes: ["id"],
        raw: true  // <- Esto hace que devuelva un objeto simple 
    });

    // Extraer solo el ID
    const userId = idUsuario ? idUsuario.id : null;

    console.log("el id del usuario es " + userId);

    const nuevoAuto = await Car.create({
        nombre: nombre,
        descripcion: descripcion,  // Clave encriptada
        precio: precio,
        stock: stock,
        user_id: userId
    });

    return nuevoAuto;
}

export const ActualizarCarro = async (id:string,body:any,login:string):Promise<CarsInterface> => {
    /********* Obtenemos el id del usuario****** */
    const usuarioaux = await User.findOne({
        where: { login: login },
        raw: true
    })


    /**********Obtenemos la relacion ************* */
    const relacionCarroUsuario = await Car.findAll({
        where: { user_id: usuarioaux.id },
        include: User
    });

    // console.log("El carro que se actualizó es:");
    // console.log(JSON.stringify(relacionCarroUsuario, null, 2));

    /******Guardamos sus id en un Arreglo */
    const idsCarros = [];
    relacionCarroUsuario.forEach(carro => {
        idsCarros.push(carro.id);
    });

    console.log("IDs de los carros:", idsCarros);

    let existeValor = idsCarros.includes(Number(id));
    // console.log(id);
    // console.log("El valor existe:", existeValor);


    const carro = await Car.findByPk(id);

    if (carro && existeValor) {
        await carro.update(body);  //puedes enviar un solo dato {"nombre": "vw actualizado"}
        console.log("el carro actualizado es ................................")
        console.log(carro)
        return carro;
    } 
    else{
        throw new Error("el auto no se actualizo ingresa correctamente los datos ")
    }
    
}