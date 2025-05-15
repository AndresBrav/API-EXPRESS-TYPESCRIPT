import {
    getCars,
    getOneCar,
    carExists,
    delOneCar,
    addCar,
    updateCar,
    saveCarFile,
    saveOneCarFile,
    uploadListServer,
    uploadListServerDB,
    getBase64,
    convertBase64toFile,
    getDetailsCars,
    addDetailCar,
    uploadAutomaticServer,
    downloadAutomaticServer
} from "../Services/servicesCars";
import { AuthenticatedRequest } from "../Middlewares/tokenValidator";
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

        const listCarUsers = await Car.findAll({
            where: {
                user_id: useraux.id
            },
            raw: true
        })
        // console.log("...........................................");
        // console.log(listCarUsers);

        let idsCars = [];
        listCarUsers.forEach(car => {
            idsCars.push(car.id);
        });

        let existValue = idsCars.includes(Number(id));

        if (existValue) {
            const base64Data = await saveOneCarFile(id, tipoGuardado) //guarda el pdf de un carro en la direccion 
            res.json({
                msg: " we arrived here check that it has saved the car",
                fileB64: base64Data
            })
        }
        else {
            res.json({
                msg: "the id car you entered does not belongs to the user login"
            })
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }

}

const CuploadServer = async (req: AuthenticatedRequest, res: Response) => {
    const { nombreArchivo, TipoTransferencia, host, user, password } = req.body

    //run the upload
    try {
        await uploadListServer(nombreArchivo, TipoTransferencia, host, user, password);
        res.send({
            msg: "it was uploaded to the server"
        })
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("enter the  nombre correctly")) {
                res.status(400).json({ msg: "enter the  nombre correctly" })
            }
            if (error.message.includes("el tipo have to be text or binary")) {
                res.status(400).json({ msg: error.message })
            }
            if (error.message.includes("enter the host correctly")) {
                res.status(400).json({ msg: error.message })
            }
            if (error.message.includes("enter the user correctly")) {
                res.status(400).json({ msg: error.message })
            }
            if (error.message.includes("enter the password correctly")) {
                res.status(400).json({ msg: error.message })
            }

        }
    }
}

const CuploadServerDB = async (req: AuthenticatedRequest, res: Response) => {
    const { nombreArchivo, ftp_user } = req.body

    //run the upload
    try {
        await uploadListServerDB(nombreArchivo, ftp_user);
        res.send({
            msg: "it was uploaded to the server"
        })
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ msg: error.message })
        }
    }
}

const CuploadAutomaticServer = async (req: AuthenticatedRequest, res: Response) => {
    const { ftp_user } = req.body
    try {
        await uploadAutomaticServer(ftp_user)
        res.end()
    } catch (error) {

    }
}

const CdownloadAutomaticServer = async (req:AuthenticatedRequest,res:Response) =>{
    try {
        await downloadAutomaticServer()
        res.send("let's download the files from ftp")
    } catch (error) {
        
    }
}

const CreturnBase64File = async (req: AuthenticatedRequest, res: Response) => {

    try {
        const { nombreArchivo } = req.body
        if (IsString(nombreArchivo)) {
            const base64Data = await getBase64(nombreArchivo);
            res.json({
                msg: "the code base64 was generated correctly",
                base64: base64Data
            })
        }
        else {
            res.status(404).json({ msg: " enter the file name correctly" })
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
}

const CconvertBase64toFile = async (req: AuthenticatedRequest, res: Response) => {
    const { base64Data, nombreArchivo, extension } = req.body
    //const {base64Data,nombreArchivo} = req.body
    try {
        await convertBase64toFile(base64Data, nombreArchivo, extension);
        res.json(
            { msg: "the file was converted correctly" }
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
    CuploadServer,
    CreturnBase64File,
    CconvertBase64toFile,
    CgetDCars,
    CaddDetailCar,
    CuploadServerDB,
    CuploadAutomaticServer,
    CdownloadAutomaticServer
}