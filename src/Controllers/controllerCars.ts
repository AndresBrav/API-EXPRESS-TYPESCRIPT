import {
    getCars,
    getOneCar,
    carExists,
    delOneCar,
    addCar,
    updateCar,
    saveCarFile,
    guardarArchivoUnCarroFile,
    subirListaServidor,
    obtenerBase64,
    convertirBase64toFileUpdate,
    getDetailsCars,
    addDetailCar
} from "../Services/servicesCars";
import  { AuthenticatedRequest } from "../Middlewares/tokenValidator";
import { Request, Response } from "express";
import User from "../Models/modelUser";
import Car, { CarsInterface } from "../Models/modelCar";
import { IsString } from "../Validations/validateTypes";
import DetailCar, { DetailCarInterface } from "../Models/modelDetailCar";

const CgetCars = async (req: AuthenticatedRequest, res: Response) => {

    /*const listaCarros = await Carro.findAll();*/
    const listCars: CarsInterface[] = await getCars(req)

    res.send(listCars);
};

const CgetOneCar = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params

    const car: CarsInterface = await getOneCar(id);

    const exist: boolean = await carExists(id)
    // console.log(`does the car exists ? ${existe}`);
    try {
        if (exist) {
            res.json(car);
        }
        else {
            res.json(
                { msg: `the car with id: ${id} does not exists` }
            )
        }
    }
    catch (error) {
        res.send(error)
        //res.end();
    }

};

const CdelCar = async (req: AuthenticatedRequest, res: Response) => {
    const loginUser = req.DatosToken?.u
    const { id } = req.params
    const result: boolean = await delOneCar(loginUser, id)

    if (result) {
        res.json({
            msg: `Removed car with id: ${id}`
        });
    }
    else {
        res.json({
            msg: `the car witch  ${id} does not belong to the user`
        });
    }
};


const CaddCar = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { nombre, descripcion, precio, stock } = req.body;
        const loginUsuario = req.DatosToken?.u;

        // Validate that basic data is present
        if (!nombre || !descripcion || precio == null || stock == null || !loginUsuario) {
            res.status(400).json({ msg: "Required Data is missing" });
            return;
        }

        // Call the service
        const result: CarsInterface = await addCar(
            nombre,
            descripcion,
            precio,
            stock,
            loginUsuario
        );

        // Respond Successfully
        res.status(201).json({
            msg: "Car added successfully",
            auto: result,
        });
    } catch (error) {
        // Handle specific erros
        if (error instanceof Error) {
            console.error("Error when adding the car is ...:", error.message);
            if (error.message.includes("the name must be of type string")) {
                res.status(400).json({ msg: error.message })
                return
            }
            if (error.message.includes("the descripcion must be of type string")) {
                res.status(400).json({ msg: error.message })
                return
            }
            if (error.message.includes("the precio must be of type number")) {
                res.status(400).json({ msg: error.message })
                return
            }
            if (error.message.includes("the stock must be of type number")) {
                res.status(400).json({ msg: error.message })
                return
            }
            if (error.message.includes("the loginUsuario must be of type string")) {
                res.status(400).json({ msg: error.message })
                return
            }

            res.status(500).json({ msg: "Error interno del servidor" });
            return
        }
        // console.error("Unknown error:", error);
        res.status(500).json({ msg: "Internal server error not identified" });
    }
};





const CupdateCar = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { body } = req;
    const login = req.DatosToken?.u
    try {

        const result = await updateCar(id, body, login)

        res.json({
            msg: "upgraded car",
            upgradedCar: result
        })
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({
                msg: "An error has occurred:",
                msgerror: error.message
            });
        } else {
            console.error('An unknown error occurred:', error);
        }
    }

};

/* we get specif details from cars */
const CgetDCars = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const result: DetailCarInterface[] = await getDetailsCars()
        res.json({
            msg: "we will send all the details",
            result: result
        })
    } catch (error) {

    }

}

const CaddDetailCar = async (req: AuthenticatedRequest, res: Response) => {

    try {
        const login = req.DatosToken?.u
        const { color, transmision, combustible, puertas, motor, car_id } = req.body;

        const result: DetailCarInterface = await addDetailCar(
            color,
            transmision,
            combustible,
            puertas,
            motor,
            car_id,
            login)

        res.json({
            msg: "the detail was added correctly",
            result: result
        })

    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("el car_id que ingresaste no te pertenece o esta duplicado")) {
                res.status(400).json({
                    msg: "el car_id que ingresaste no te pertenece o esta duplicado"
                })
            }
            else {
                res.status(400).json({
                    msg: error.message
                })
            }


        }
    }
}


/***********Seccion pdf**************** */

const CsaveFile = async (req: AuthenticatedRequest, res: Response) => {

    try {
        const { body } = req;
        const loginUser = req.DatosToken?.u
        const tipoGuardado = body.tipoGuardado

        if (tipoGuardado === "txt" || tipoGuardado === "pdf") {
            const base64Data = await saveCarFile(loginUser, tipoGuardado)  // save the pdf in the address 
            res.json({
                msg: "we arrived here and the car was stored",
                archivoB64: "the code base64 is:" + base64Data
            })
        }
        else {
            res.status(404).json({
                msg: "the tipGuardado have to be txt o pdf",
            })

        }


    }
    catch (error) {
        res.status(500).json({ success: false, message: error });
    }
}


const CsaveOnePdf = async (req: AuthenticatedRequest, res: Response) => {

    try {
        const { id } = req.params
        const { tipoGuardado } = req.body;

        const loginUser = req.DatosToken?.u //USER1
        /*********we get the id from the user****** */
        const useraux = await User.findOne({
            where: { login: loginUser },
            raw: true
        })

        const listaDeCarrosDelUsuario = await Car.findAll({
            where: {
                user_id: useraux.id
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
    try {
        await subirListaServidor(nombreArchivo, TipoTransferencia, host, user, password);
        res.send({
            msg: "se subio al servidor"
        })
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("ingresa el nombre correctamente")) {
                res.status(400).json({ msg: "ingresa el nombre correctamente" })
            }
            if (error.message.includes("el tipo tiene que ser text o binary")) {
                res.status(400).json({ msg: error.message })
            }
            if (error.message.includes("ingresa el host correctamente")) {
                res.status(400).json({ msg: error.message })
            }
            if (error.message.includes("ingresa el user correctamente")) {
                res.status(400).json({ msg: error.message })
            }
            if (error.message.includes("ingresa el password correctamente")) {
                res.status(400).json({ msg: error.message })
            }

        }
    }
}

const CdevolverArchivoBase64 = async (req: AuthenticatedRequest, res: Response) => {

    try {
        const { nombreArchivo } = req.body
        if (IsString(nombreArchivo)) {
            const base64Data = await obtenerBase64(nombreArchivo);
            res.json({
                msg: "El codigo base64 se genero correctamente:",
                base64: base64Data
            })
        }
        else {
            res.status(404).json({ msg: "ingresa correctamente el nombre del Archivo" })
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
}

const CconvertirBase64toFile = async (req: AuthenticatedRequest, res: Response) => {
    const { base64Data, nombreArchivo, extension } = req.body
    //const {base64Data,nombreArchivo} = req.body
    try {
        await convertirBase64toFileUpdate(base64Data, nombreArchivo, extension);
        //await convertirBase64toFile(base64Data, nombreArchivo);
        res.json(
            { msg: "El archivo se convirtio correctamente" }
        )
    } catch (error) {
        res.status(400).json({ success: false, message: error });
    }
}




export {
    CgetCars,
    CgetOneCar,
    CdelCar,
    CaddCar,
    CupdateCar,
    CsaveFile,
    CsaveOnePdf,
    CsubirServidor,
    CdevolverArchivoBase64,
    CconvertirBase64toFile,
    CgetDCars,
    CaddDetailCar
}