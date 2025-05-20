import Car, { CarsInterface } from "../../Models/modelCar";
import User from "../../Models/modelUser";
import { AuthenticatedRequest } from "../../Middlewares/tokenValidator";
import path from 'path'
import fs from 'fs'
import PDFDocument from "pdfkit";
import { returnB64fromFile } from '../Convert_B64'
import { downloadFileFromFTP, listFilesFromFTP, uploadFileToFTP } from "../basic-ftp";
import { IsNumber, IsString, typeTransfer } from "../../Validations/validateTypes";
import DetailCar, { DetailCarInterface } from "../../Models/modelDetailCar";
import Ftp, { FtpInstance } from "../../Models/modelFtp";
import { getBoliviaDate } from '../../util/getDates';
import { filesFromFTPMethod, FilterFileslocalpath, filterforfile_format } from "../../util/filterFiles";
import HistoryFtp from "../../Models/modelhistory_Ftp";

export const getCars = async (req: AuthenticatedRequest): Promise<CarsInterface[]> => {
    const loginUser = req.DatosToken?.u

    // get id from username
    const user = await User.findOne({ where: { login: loginUser } });
    const idUser = user.id;
    // console.log("id user is " + idUser);


    /*****Return cars  */
    // get cars associated with that user
    const cars: CarsInterface[] = await Car.findAll({ where: { user_id: idUser } });
    return cars;
}


export const getOneCar = async (id: string) => {
    const aCar = await Car.findByPk(id);
    if (aCar) {
        return aCar
    } else {
        return null
    }
}

export const carExists = async (id) => {
    const car = await Car.findByPk(id);
    return !!car; // Returns true if it exists, false if not
};

export const delOneCar = async (loginUser: string | undefined, id: string): Promise<boolean> => {

    const loginuser = loginUser//login in with
    const idUser = await User.findOne({
        where: { login: loginuser },
        attributes: ["id"],
        raw: true  // <- return simple object
    });

    // Extract only id
    const userId = idUser ? idUser.id : null;

    // console.log("the user id is " + userId);

    const user_ids = await Car.findAll({
        where: { user_id: userId },
        raw: true
    });

    // console.log(user_ids);

    const userIdArray = user_ids.map(user => user.id);
    // console.log(userIdArray);

    let belongsTo = userIdArray.includes(Number(id));
    // console.log(pertenece)
    if (belongsTo) {
        const car = await Car.findByPk(id);
        await car.destroy();
        return true

    }
    else {
        return false

    }

}


export const addCar = async (
    nombre: string,
    descripcion: string,
    precio: number,
    stock: number,
    loginUsuario: string
): Promise<CarsInterface> => {
    // Validaciones
    if (typeof nombre !== "string" || nombre.trim() === "") {
        throw new Error("the name must be of type string");
    }
    if (typeof descripcion !== "string" || descripcion.trim() === "") {
        throw new Error("the descripcion must be of type string");
    }
    if (typeof precio !== "number" || isNaN(precio) || precio <= 0) {
        throw new Error("the precio must be of type number");
    }
    if (typeof stock !== "number" || isNaN(stock) || stock < 0) {
        throw new Error("the stock must be of type number");
    }
    if (typeof loginUsuario !== "string" || loginUsuario.trim() === "") {
        throw new Error("the loginUsuario must be of type string");
    }



    // look for the user
    const idUser = await User.findOne({
        where: { login: loginUsuario },
        attributes: ["id"],
        raw: true,
    });

    if (!idUser) {
        throw new Error("User not found");
    }

    const userId = idUser.id;

    // Create the car
    const newCar: CarsInterface = await Car.create({
        nombre,
        descripcion,
        precio,
        stock,
        user_id: userId,
    });

    if (!newCar) {
        throw new Error("Could not create the car");
    }

    return newCar;
};



export const updateCar = async (id: string, body: any, login: string): Promise<CarsInterface> => {
    /********* we get the user id ****** */
    const useraux = await User.findOne({
        where: { login: login },
        raw: true
    })


    /**********we get the relation ************* */
    const relationCarUser = await Car.findAll({
        where: { user_id: useraux.id },
        include: User
    });


    /******we store their ids in a Array */
    const idsCars = [];
    relationCarUser.forEach(car => {
        idsCars.push(car.id);
    });

    // console.log("the car ids are:", idsCars);

    let existValue = idsCars.includes(Number(id));

    const car = await Car.findByPk(id);


    const fieldsToUpdate: any = {};

    if (typeof body.nombre === "string") { fieldsToUpdate.nombre = body.nombre; }
    else { throw new Error("the nombre must be of type string") }

    if (typeof body.descripcion === "string") { fieldsToUpdate.descripcion = body.descripcion; }
    else { throw new Error("the nombre must be of type string") }

    if (typeof body.precio === "number") { fieldsToUpdate.precio = body.precio; }
    else { throw new Error("the nombre must be of type number") }

    if (typeof body.stock === "number") { fieldsToUpdate.stock = body.stock; }
    else { throw new Error("the nombre must be of type number") }



    if (car && existValue) {
        await car.update(fieldsToUpdate);
        // console.log("the upgraded car is  ................................")
        // console.log(car)
        return car;
    }
    else {
        throw new Error("the car was not updated enter the data correctly")
    }

}


export const getDetailsCars = async () => {
    try {
        const detailscars: DetailCarInterface[] = await DetailCar.findAll({
            include: Car
        })
        // console.log(detailscars)
        return detailscars;
    } catch (error) {
        console.log("happened the next error", error)
    }
}

// Promise<DetailCarInterface>
export const addDetailCar = async (
    color: string,
    transmision: string,
    combustible: string,
    puertas: number,
    motor: string,
    car_id: number,
    login: string
): Promise<DetailCarInterface> => {

    if (!IsString(color)) {
        throw new Error("enter the color as a string")
    }
    if (!IsString(transmision)) {
        throw new Error("enter the transmision as a string")
    }
    if (!IsString(combustible)) {
        throw new Error("enter the combustible as a string")
    }
    if (!IsNumber(puertas)) {
        throw new Error("enter the puertas as a number")
    }
    if (!IsString(motor)) {
        throw new Error("enter the motor as a string")
    }
    if (!IsNumber(car_id)) {
        throw new Error("enter the car_id as a number")
    }
    if (!IsString(login)) {
        throw new Error("enter the login as a string")
    }



    const iduser = await User.findOne({
        where: { login: login },
        raw: true,
        attributes: ['id']
    })
    // console.log("the user id is ", iduser)
    // extract only de id
    const userId = iduser ? iduser.id : null;

    const userCars = await Car.findAll({
        where: { user_id: userId },
        // include:User,
        raw: true
    });


    const idCars: number[] = userCars.map(auto => auto.id)

    // console.log(idCars)
    // console.log(idCarros.includes(Number(car_id)))

    if (idCars.includes(Number(car_id)) === true) {
        const detailscreated: DetailCarInterface = await DetailCar.create({
            color,
            transmision,
            combustible,
            puertas,
            motor,
            car_id
        })

        return detailscreated;
    }
    else {
        // console.log("will not be evaluated")
        throw new Error("the car_id you entered does not belong to you or is duplicated")
    }
}


/*******************pdf Section********************** */
export const saveCarFile = async (
    loginUser: string,
    tipoGuardado: 'txt' | 'pdf'
): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ where: { login: loginUser } });
            if (!user) return reject('user not found');

            const idUser: number = user.id;
            // console.log('the user id is ' + idUsuario);

            const cars = await Car.findAll({ where: { user_id: idUser } });
            if (!cars.length) return reject('No cars were found for the user');

            let nombreDelArchivo = '';
            const folderPath = path.join(__dirname, '../ArchivosGuardados');
            if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

            if (tipoGuardado === 'txt') {
                let filePath = path.join(folderPath, 'lista_carros.txt');
                let i = 1;
                while (fs.existsSync(filePath)) {
                    filePath = path.join(folderPath, `lista_carros${i}.txt`);
                    i++;
                }
                nombreDelArchivo = path.basename(filePath);

                const fileContent = cars
                    .map(
                        (carro: any, index: number) =>
                            `${index + 1}. ID: ${carro.id} - Nombre: ${carro.nombre} - Descripción: ${carro.descripcion} - Precio: ${carro.precio} - Stock: ${carro.stock}`
                    )
                    .join('\n');

                fs.writeFile(filePath, fileContent, async (err) => {
                    if (err) return reject('Error saving file TXT: ' + err);
                    console.log('file txt saved:', filePath);

                    const variableBase64 = await returnB64fromFile(nombreDelArchivo);
                    resolve(variableBase64 || '');
                });
            } else if (tipoGuardado === 'pdf') {
                let filePath = path.join(folderPath, 'lista_carros.pdf');
                let i = 1;
                while (fs.existsSync(filePath)) {
                    filePath = path.join(folderPath, `lista_carros${i}.pdf`);
                    i++;
                }
                nombreDelArchivo = path.basename(filePath);

                const doc = new PDFDocument();
                const writeStream = fs.createWriteStream(filePath);
                doc.pipe(writeStream);

                doc.fontSize(20).text('Lista de Carros', { align: 'center' }).moveDown();
                cars.forEach((carro: any, index: number) => {
                    doc
                        .fontSize(14)
                        .text(
                            `${index + 1}. ID: ${carro.id} - Nombre: ${carro.nombre} - Descripción: ${carro.descripcion} - Precio: ${carro.precio} - Stock: ${carro.stock}`
                        );
                    doc.moveDown(0.5);
                });

                doc.end();

                writeStream.on('finish', async () => {
                    console.log('PDF saved in :', filePath);
                    const variableBase64 = await returnB64fromFile(nombreDelArchivo);
                    resolve(variableBase64 || '');
                });

                writeStream.on('error', (err) => reject('Error saving file PDF: ' + err));
            } else {
                reject('save Type not supported.');
            }
        } catch (error) {
            reject('Error in the process: ' + error);
        }
    });
};

export const saveOneCarFile = async (id: string, tipoGuardado: 'pdf' | 'txt'): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("the save type is : " + tipoGuardado);
            const carro = await Car.findByPk(id);
            const exist = await carExists(id)

            let nombreDelArchivo = "";
            const folderPath = path.join(__dirname, "../ArchivosGuardados");
            if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

            if (tipoGuardado === "txt" && exist) {
                let filePath = path.join(folderPath, "Carro.txt");
                let i = 1;
                while (fs.existsSync(filePath)) {
                    filePath = path.join(folderPath, `Carro${i}.txt`);
                    i++;
                }
                nombreDelArchivo = path.basename(filePath);

                // Create the file content .txt
                let fileContent = "Detalle de Carro\n\n";

                // add the cars to file .txt

                fileContent += ` ID: ${carro.id} - Nombre: ${carro.nombre} - Descripcion: ${carro.descripcion} - Precio: ${carro.precio} - Stock: ${carro.stock}\n`;

                fs.writeFile(filePath, fileContent, async (err) => {
                    if (err) return reject("Error saving file TXT: " + err);
                    // console.log("file TXT saved in:", filePath);

                    const variableBase64 = await returnB64fromFile(nombreDelArchivo);
                    resolve(variableBase64 || '');
                });

            } else if (tipoGuardado === "pdf" && exist) {
                let filePath = path.join(folderPath, "Carro.pdf");
                let i = 1;
                while (fs.existsSync(filePath)) {
                    filePath = path.join(folderPath, `Carro${i}.pdf`);
                    i++;
                }
                nombreDelArchivo = path.basename(filePath);

                const doc = new PDFDocument();
                const writeStream = fs.createWriteStream(filePath);
                doc.pipe(writeStream);

                doc.fontSize(20).text("Detalles del Carro", { align: "center" }).moveDown();

                //agregar carro al pdf
                doc.fontSize(14).text(`ID: ${carro.id} - Nombre: ${carro.nombre} - Descripcion: ${carro.descripcion} - Precio: ${carro.precio} - Stock:${carro.stock}`)


                doc.end();

                writeStream.on("finish", async () => {
                    // console.log("PDF saved in:", filePath);
                    const variableBase64 = await returnB64fromFile(nombreDelArchivo);
                    resolve(variableBase64 || '');
                });

                writeStream.on("error", (err) => reject("Error saving PDF: " + err));
            } else {
                reject("save type not supported");
            }
        } catch (error) {
            reject("Error in the process: " + error);
        }

    }
    );
};

/*************upload to the server  ********* */
export const uploadListServer = async (
    nombreArchivo: string,
    TipoTransferencia: string,
    host: string,
    user: string,
    password: string
) => {
    //Relative path to the file
    // const localFilePath = `../ArchivosGuardados/${nombreArchivo}`;

    //Convert relative path to the absoluted path
    // const absoluteFilePath = path.resolve(__dirname, localFilePath);
    const absoluteFilePath = path.join(process.cwd(), 'src', 'ArchivosGuardados', nombreArchivo);
    //console.log("the absoluted path is : " + absoluteFilePath);
    const remoteFilePath = `/${nombreArchivo}`;
    //const transferMode = 'binary';
    const transferMode = TipoTransferencia;
    // console.log(`now ..........the transfer type is ${TipoTransferencia}`);
    if (
        IsString(nombreArchivo) &&
        typeTransfer(TipoTransferencia) &&
        IsString(host) &&
        IsString(user) &&
        IsString(password)
    ) {
        console.log("arrive here")
        console.log(nombreArchivo)
        console.log(absoluteFilePath)
        await uploadFileToFTP(
            absoluteFilePath,
            remoteFilePath,
            transferMode,
            host,
            user,
            password
        );
    }
    else {
        if (!IsString(nombreArchivo)) {
            throw new Error("enter the  nombre correctly")
        }
        if (!typeTransfer(TipoTransferencia)) {  /* !false = true entra y se evalua */

            throw new Error("el tipo have to be text or binary")
        }
        if (!IsString(host)) {
            throw new Error("enter the host correctly")
        }
        if (!IsString(user)) {
            throw new Error("enter the user correctly")
        }
        if (!IsString(password)) {
            throw new Error("enter the password correctly")
        }
    }
}

// upload to ftp extracting dates from data base
export const uploadListServerDB = async (nombreArchivo: string, ftp_user: string) => {
    // consulsts data base
    const data = await Ftp.findOne({
        where: { user: ftp_user },
        raw: true
    })

    console.log(data)

    const transferMode: string = data.transferMode
    const host: string = data.host
    const user: string = data.user
    const password: string = data.password
    const local_path: string = data.local_path
    const remote_path: string = data.remote_path

    //absolute path
    const absoluteFilePath = path.join(process.cwd(), 'src', local_path, nombreArchivo);
    //console.log("the absoluted path is : " + absoluteFilePath);
    const remoteFilePath = `${remote_path}${nombreArchivo}`;


    if (
        IsString(nombreArchivo) &&
        typeTransfer(transferMode) &&
        IsString(host) &&
        IsString(user) &&
        IsString(password)
    ) {

        await uploadFileToFTP(
            absoluteFilePath,
            remoteFilePath,
            transferMode,
            host,
            user,
            password
        );
    }
    else {
        if (!IsString(nombreArchivo)) {
            throw new Error("enter the  nombre correctly")
        }
        if (!typeTransfer(transferMode)) {  /* !false = true entra y se evalua */

            throw new Error("el transferMode have to be text or binary")
        }
        if (!IsString(host)) {
            throw new Error("enter the host correctly")
        }
        if (!IsString(user)) {
            throw new Error("enter the ftp_user correctly")
        }
        if (!IsString(password)) {
            throw new Error("enter the password correctly")
        }
    }
}

export const uploadAutomaticServer = async (ftp_user: string): Promise<boolean> => {
    let result: boolean = false;
    // consulsts data base
    const data = await Ftp.findOne({
        where: { user: ftp_user },
        raw: true
    })
    console.log("the data is ", data)
    const id = data.id  /* we get the id */
    const file_format = data.file_format    /* we get the file_format ^[cC].*\.txt$ */
    const local_path = data.local_path /* we get the local path ../ArchivosGuardados/ */
    const remote_path = data.remote_path /* we get the remote path / */
    const host = data.host  /* 127.0.0.1 */
    const user = data.user
    const password = data.password

    console.log("the local path is ", local_path)
    const absoluteFilePath = path.join(process.cwd(), 'src', local_path);
    console.log("the path correct is ", absoluteFilePath)

    const filterFiles: string[] = await FilterFileslocalpath(file_format, absoluteFilePath)
    console.log("the filtered files are ")
    console.log(filterFiles)


    const filesfromFTP: string[] = await filesFromFTPMethod(remote_path, host, user, password)
    console.log("the files brings from ftp are")
    console.log(filesfromFTP)

    const filesFromHistory_DB = await HistoryFtp.findAll({
        where: { ftp_id: id },
        raw: true,
        attributes: ['name_file']
    })

    // console.log("the files from db are", filesFromHistory_DB)

    const fileNamesDB = filesFromHistory_DB.map(file => file.name_file);

    // console.log("the name of the files are:", fileNames);

    if (filterFiles.length === 0) {
        console.log("there is nothing to upload")
        result = false
    }
    else {
        await uploadAutomaticFiles(
            filterFiles,
            filesfromFTP,
            fileNamesDB,
            data)
        result = true
    }
    return result;
}


const uploadAutomaticFiles = async (
    filterFiles: string[],
    filesfromFTP: string[],
    fileNamesDB: string[],
    data: FtpInstance
) => {
    // console.log(filterFiles.length)

    for (let index = 0; index < filterFiles.length; index++) {
        const element = filterFiles[index];
        console.log("the name's file is ", element)
        if (filesfromFTP.includes(element) || fileNamesDB.includes(element)) {
            console.log("will not go up")
        }
        else {
            console.log("will go up")
            const transferModedb = data.transferMode
            const hostdb = data.host
            const userdb = data.user
            const passworddb = data.password
            const local_path = data.local_path
            const remote_path = data.remote_path
            const id = data.id
            // Relative path to the file
            // const localFilePath = `${local_path}${element}`;
            //Convert relative path to the absoluted path
            // const absoluteFilePath = path.resolve(__dirname, localFilePath);

            const absoluteFilePath = path.join(process.cwd(), 'src', local_path, element);
            
            const remoteFilePath = `${remote_path}${element}`;
            const transferMode = transferModedb
            const host = hostdb
            const user = userdb
            const password = passworddb

            const boliviaTime: Date = getBoliviaDate() /* we get the date in Bolivia */


            const name_file = element
            const uploaded = boliviaTime
            const downloaded = boliviaTime
            const ftp_id = id

            try {
                /* upload to db HistoryFtp */
                await HistoryFtp.create(
                    {
                        name_file,
                        uploaded,
                        downloaded,
                        ftp_id
                    }
                )

                /* upload to FTP */
                await uploadFileToFTP(
                    absoluteFilePath,
                    remoteFilePath,
                    transferMode,
                    host,
                    user,
                    password
                );
            } catch (error) {
                console.log(error)
            }

        }
    }

}

export const downloadAutomaticServer = async (ftp_user: string) => {

    // consulsts data base
    const data = await Ftp.findOne({
        where: { user: ftp_user },
        raw: true
    })
    // console.log("the data is ", data)
    const {
        id,
        host,
        user,
        password,
        transferMode,
        downloadPath,
        remote_path,
        file_format
    } = data;

    const filesfromFTP: string[] = await filesFromFTPMethod(remote_path, host, user, password)
    console.log("the files brings from ftp are")
    console.log(filesfromFTP)


    const filteredfilesFTP = filterforfile_format(file_format, filesfromFTP)
    console.log("the files filtered from ftp are")
    console.log(filteredfilesFTP)


    const filesFromHistory_DB = await HistoryFtp.findAll({
        where: { ftp_id: id },
        raw: true,
        attributes: ['name_file']
    })
    const fileNamesDB = filesFromHistory_DB.map(file => file.name_file);
    console.log("the files from db are", fileNamesDB)

    const filteredFilesDB = filterforfile_format(file_format, fileNamesDB)
    console.log("the files filtered from DB are")
    console.log(filteredFilesDB)

    for (let index = 0; index < filteredfilesFTP.length; index++) {
        const element = filteredfilesFTP[index];
        // from database
        const data = await HistoryFtp.findOne({
            where: { name_file: element }
            // raw: true
        })
        // console.log(data)
        if (!data) {
            console.log("data not exist")

        }
        else {
            console.log("let's find out")
            if (filteredfilesFTP.includes(data.name_file)) {
                console.log("data exists")
                console.log(data.name_file)
                const boliviaTimeDownload: Date = getBoliviaDate()
                await data.update({ downloaded: boliviaTimeDownload }) /* update time of download */

                // download fles to adress
                await downloadFileFromFTP(
                    element,                // Route of file in the FTP
                    downloadPath,           //  local folder where it will be saved
                    host,                   // Host FTP
                    user,                   // User
                    password,               // Password
                    transferMode            // transferMode
                );
            }

        }
    }

}


export const getBase64 = async (nombreArchivo: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            const base64Data = await returnB64fromFile(nombreArchivo);
            resolve(base64Data);
        } catch (error) {
            reject("Error al obtener el archivo en Base64: " + error);
        }

    })
}

export const convertBase64toFile = async (base64Data: string, nombreArchivo: string, extension: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            if (!base64Data || !nombreArchivo || !extension) {
                return reject("Base64, file name or extension not provided.");
            }

            if (!IsString(base64Data)) {
                return reject("Enter the code base64 as a string")
            }
            if (!IsString(nombreArchivo)) {
                return reject("enter the nombre correctly is of type string")
            }
            if (!IsString(extension)) {
                return reject("enter the extension  correctly is txt or pdf")
            }

            // create the folder  'ArchivosConvertidosDeBase64' if does not exist
            const folderPath = path.join(__dirname, "../ArchivosConvertidosDeBase64");
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath);
            }

            // Route file with name and extension
            let filePath = path.join(folderPath, `${nombreArchivo}.${extension}`);
            let i = 1;

            // check if the file already exist and change the name if necessary
            while (fs.existsSync(filePath)) {
                filePath = path.join(folderPath, `${nombreArchivo}${i}.${extension}`);
                i++;
            }

            // Convert base64 to buffer
            const buffer = Buffer.from(base64Data, "base64");

            // write the file
            fs.writeFile(filePath, buffer, (err) => {
                if (err) return reject("Error saving file: " + err);
                console.log("file saved in: ", filePath);
                resolve(filePath);
            });

        } catch (error) {
            reject("Error in the process: " + error);
        }
    });
};