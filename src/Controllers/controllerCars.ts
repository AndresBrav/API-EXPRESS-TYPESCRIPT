import { obtenerCarros, obtenerUnCarro, existeCarro, eliminarUnCarro, aniadirCarro, ActualizarCarro, guardarArchivosCarros, guardarArchivoUnCarroFile, subirListaServidor } from "../Services/servicesCars";
import verifyToken, { AuthenticatedRequest } from "../Middlewares/verifyToken";
import { Request, Response } from "express";
import User from "../Models/modelUser";
import Car from "../Models/modelCar";

const Cobtenercarros = async (req: AuthenticatedRequest, res: Response) => {

    /*const listaCarros = await Carro.findAll();*/
    const listaCarros = await obtenerCarros(req)

    res.send(listaCarros);
};

const Cobteneruncarro = async (req: AuthenticatedRequest, res: Response) => {
    // const data = req.body
    const { id } = req.params

    const carro = await obtenerUnCarro(id);

    const existe = await existeCarro(id)
    console.log(`el carro existe ? ${existe}`);
    try {
        if (existe) {
            res.json(carro);
        }
        else {
            res.json(
                { msg: `el carro con id:${id} no existe` }
            )
        }
    }
    catch (error) {
        res.send(error)
        //res.end();
    }

};

const CeliminarCarro = async (req: AuthenticatedRequest, res: Response) => {
    const loginUsuario = req.DatosToken?.u
    const { id } = req.params
    const resultado: boolean = await eliminarUnCarro(loginUsuario, id)

    if (resultado) {
        res.json({
            msg: `Se eliminó el carro con ID ${id}`
        });
    }
    else {
        res.json({
            msg: `El carro con ${id} no pertenece al usuario`
        });
    }
};

const CaniadirCarro = async (req: AuthenticatedRequest, res: Response) => {
    const { nombre, descripcion, precio, stock } = req.body
    //console.log("recuperado de usrt ", req.usrT.u);
    const loginusuario = req.DatosToken?.u  //con el que inicio sesion

    const resultado = await aniadirCarro(nombre, descripcion, precio, stock, loginusuario)
    // console.log(resultado)
    res.json({
        msg: "auto añadido exitosamente",
        auto: resultado
    })
};

const CactualizarCarro = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { body } = req;
    const login = req.DatosToken?.u
    try {

        const resultado = await ActualizarCarro(id, body, login)

        res.json({
            msg: "carro actualizado",
            autoActualizado: resultado
        })
    }
    catch (error) {
        if (error instanceof Error) {
            res.json({
                msg: "An error occurred:",
                msgerror: error.message
            });
        } else {
            console.error('An unknown error occurred:', error);
        }
    }

};

/***********Seccion pdf**************** */

const CguardarArchivo = async (req: AuthenticatedRequest, res: Response) => {

    try {
        const { body } = req;
        const loginUsuario = req.DatosToken?.u
        const tipoGuardado = body.tipoGuardado

        const base64Data = await guardarArchivosCarros(loginUsuario, tipoGuardado)  //guarda el pdf en la direccion 
        //await subirListaServidor() //sube los archivos al servidor 
        res.json({
            msg: "llegamos hasta aqui se guardo los carros",
            archivoB64: "El codigo base64 es:" + base64Data
        })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error });
    }
}


const CguardarUnArchivo = async (req: AuthenticatedRequest, res: Response) => {

    try {
        const { id } = req.params
        const {  tipoGuardado } = req.body;

        const loginUsuario = req.DatosToken?.u //USER1
        /********* Obtenemos el id del usuario****** */
        const usuarioaux = await User.findOne({
            where: { login: loginUsuario },
            raw: true
        })

        const listaDeCarrosDelUsuario = await Car.findAll({
            where: {
                user_id: usuarioaux.id
            },
            raw: true
        })
        // console.log("...........................................");
        // console.log(listaDeCarrosDelUsuario);

        let idsCarros = [];
        listaDeCarrosDelUsuario.forEach(carro => {
            idsCarros.push(carro.id);
        });

        let existeValor = idsCarros.includes(Number(id));

        if (existeValor) {
            const base64Data = await guardarArchivoUnCarroFile(id, tipoGuardado) //guarda el pdf de un carro en la direccion 
            res.json({
                msg: "llegamos hasta aqui verifica que se haya subido el carro",
                archivoB64: base64Data
            })
        }
        else {
            res.json({
                msg: "El id del carro que ingresaste no pertenece al usuario que inicio sesion"
            })
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }



    // await guardarPdfUnCarro(id, TipoTransferencia) //guarda el pdf de un carro en la direccion 

}

const CsubirServidor = async (req: AuthenticatedRequest, res: Response) => {
    const { nombreArchivo, TipoTransferencia, host, user, password } = req.body

    //Ejecutar la subida
    await subirListaServidor(nombreArchivo, TipoTransferencia, host, user, password);
    res.send({
        msg: "se subio al servidor"
    })
}



export { Cobtenercarros, Cobteneruncarro, CeliminarCarro, CaniadirCarro, CactualizarCarro, CguardarArchivo, CguardarUnArchivo, CsubirServidor }