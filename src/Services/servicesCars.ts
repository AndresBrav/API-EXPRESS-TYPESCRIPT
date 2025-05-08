import Car, { CarsInterface } from "../Models/modelCar";
import User from "../Models/modelUser";
import { AuthenticatedRequest } from "../Middlewares/tokenValidator";
import { Request, Response } from "express";
import path from 'path'
import fs from 'fs'
import PDFDocument from "pdfkit";
import { convertirYGuardarArchivoBase64 } from '../Services/Convertir_B64'
import { uploadFileToFTP } from "./basic-ftp";
import ResError from "../util/resError";
import ResSuccess from "../util/resSuccess";
import { respCode, respPhrase } from "../util/httpResponse";
import bcrypt from 'bcrypt'
import { IsNumber, IsString, typeTransfer } from "../Validations/validateTypes";
import DetailCar, { DetailCarInterface } from "../Models/modelDetailCar";

export const obtenerCarros = async (req: AuthenticatedRequest): Promise<CarsInterface[]> => {
    const loginUsuario = req.DatosToken?.u
    console.log("recuperado de usrt ", req.DatosToken?.u);

    // Obtener el ID del usuario a partir de su nombre
    const usuario = await User.findOne({ where: { login: loginUsuario } });
    //console.log("El usuario que vino es:", JSON.stringify(usuario, null, 2));
    const idUsuario = usuario.id;
    console.log("el id del usuario es " + idUsuario);


    /*****Retornar carros  */
    // Obtener los carros asociados a ese usuario
    const carros: CarsInterface[] = await Car.findAll({ where: { user_id: idUsuario } });

    //const carro = await Carro.findAll()
    return carros;
}


export const obtenerUnCarro = async (id: string) => {
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

export const eliminarUnCarro = async (loginUsuario: string | undefined, id: string): Promise<boolean> => {

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
    else {
        return false

    }

}


export const aniadirCarro = async (
    nombre: string,
    descripcion: string,
    precio: number,
    stock: number,
    loginUsuario: string
): Promise<CarsInterface> => {
    // Validaciones
    if (typeof nombre !== "string" || nombre.trim() === "") {
        throw new Error("El nombre tiene que ser de tipo string");
    }
    if (typeof descripcion !== "string" || descripcion.trim() === "") {
        throw new Error("La descripción tiene que ser de tipo string");
    }
    if (typeof precio !== "number" || isNaN(precio) || precio <= 0) {
        throw new Error("El precio tiene que ser number");
    }
    if (typeof stock !== "number" || isNaN(stock) || stock < 0) {
        throw new Error("El stock tiene que ser number");
    }
    if (typeof loginUsuario !== "string" || loginUsuario.trim() === "") {
        throw new Error("El loginUsuario  tiene que ser string");
    }



    // Buscar el usuario
    const idUsuario = await User.findOne({
        where: { login: loginUsuario },
        attributes: ["id"],
        raw: true,
    });

    if (!idUsuario) {
        throw new Error("Usuario no encontrado");
    }

    const userId = idUsuario.id;

    // Crear el auto
    const nuevoAuto: CarsInterface = await Car.create({
        nombre,
        descripcion,
        precio,
        stock,
        user_id: userId,
    });

    if (!nuevoAuto) {
        throw new Error("No se pudo crear el auto");
    }

    return nuevoAuto;
};



export const ActualizarCarro = async (id: string, body: any, login: string): Promise<CarsInterface> => {
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


    /******Guardamos sus id en un Arreglo */
    const idsCarros = [];
    relacionCarroUsuario.forEach(carro => {
        idsCarros.push(carro.id);
    });

    console.log("IDs de los carros:", idsCarros);

    let existeValor = idsCarros.includes(Number(id));

    const carro = await Car.findByPk(id);


    const camposAActualizar: any = {};

    if (typeof body.nombre === "string") { camposAActualizar.nombre = body.nombre; }
    else { throw new Error(" el nombre tiene que ser string ") }

    if (typeof body.descripcion === "string") { camposAActualizar.descripcion = body.descripcion; }
    else { throw new Error(" la descripcion tiene que ser string ") }

    if (typeof body.precio === "number") { camposAActualizar.precio = body.precio; }
    else { throw new Error(" el precio tiene que ser un numero ") }

    if (typeof body.stock === "number") { camposAActualizar.stock = body.stock; }
    else { throw new Error(" el stock  tiene que ser un numero ") }



    if (carro && existeValor) {
        await carro.update(camposAActualizar);  //puedes enviar un solo dato {"nombre": "vw actualizado"}
        console.log("el carro actualizado es ................................")
        console.log(carro)
        return carro;
    }
    else {
        throw new Error("el auto no se actualizo ingresa correctamente los datos ")
    }

}


export const ObtenerTodosDetalles = async () => {
    try {
        const detallesCarros: DetailCarInterface[] = await DetailCar.findAll({
            include: Car
        })
        // console.log(detallesCarros)
        return detallesCarros;
    } catch (error) {
        console.log("sucedio el siguiente error", error)
    }
}

// Promise<DetailCarInterface>
export const aniadirDetallesCarros = async (
    color: string,
    transmision: string,
    combustible: string,
    puertas: number,
    motor: string,
    car_id: number,
    login: string
): Promise<DetailCarInterface> => {

    if (!IsString(color)) {
        throw new Error("ingresa el color como string")
    }
    if (!IsString(transmision)) {
        throw new Error("ingresa la transmision como string")
    }
    if (!IsString(combustible)) {
        throw new Error("ingresa el combustible como string")
    }
    if (!IsNumber(puertas)) {
        throw new Error("ingresa el numero de puertas  como numero")
    }
    if (!IsString(motor)) {
        throw new Error("ingresa el motor como string")
    }
    if (!IsString(motor)) {
        throw new Error("ingresa el motor como string")
    }
    if (!IsNumber(car_id)) {
        throw new Error("ingresa el car_id como numero")
    }
    if (!IsString(login)) {
        throw new Error("ingresa el login como string")
    }



    const iduser = await User.findOne({
        where: { login: login },
        raw: true,
        attributes: ['id']
    })
    console.log("el id del usuario es ", iduser)
    // Extraer solo el ID
    const userId = iduser ? iduser.id : null;

    const usuariosAutos = await Car.findAll({
        where: { user_id: userId },
        // include:User,
        raw: true
    });


    const idCarros: number[] = usuariosAutos.map(auto => auto.id)

    console.log(idCarros)
    console.log(idCarros.includes(Number(car_id)))

    if (idCarros.includes(Number(car_id)) === true) {
        const detallescreados: DetailCarInterface = await DetailCar.create({
            color,
            transmision,
            combustible,
            puertas,
            motor,
            car_id
        })

        return detallescreados;
    }
    else {
        // console.log("no se va a evaluar")
        throw new Error("el car_id que ingresaste no te pertenece o esta duplicado")
    }
}


/*******************Seccion de pdf ********************** */
export const guardarArchivosCarros = async (
    loginUsuario: string,
    tipoGuardado: 'txt' | 'pdf'
): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            const usuario = await User.findOne({ where: { login: loginUsuario } });
            if (!usuario) return reject('Usuario no encontrado');

            const idUsuario: number = usuario.id;
            console.log('El ID del usuario es ' + idUsuario);

            const carros = await Car.findAll({ where: { user_id: idUsuario } });
            if (!carros.length) return reject('No se encontraron carros para el usuario');

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

                const fileContent = carros
                    .map(
                        (carro: any, index: number) =>
                            `${index + 1}. ID: ${carro.id} - Nombre: ${carro.nombre} - Descripción: ${carro.descripcion} - Precio: ${carro.precio} - Stock: ${carro.stock}`
                    )
                    .join('\n');

                fs.writeFile(filePath, fileContent, async (err) => {
                    if (err) return reject('Error al guardar el archivo TXT: ' + err);
                    console.log('Archivo TXT guardado en:', filePath);

                    const variableBase64 = await convertirYGuardarArchivoBase64(nombreDelArchivo);
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
                carros.forEach((carro: any, index: number) => {
                    doc
                        .fontSize(14)
                        .text(
                            `${index + 1}. ID: ${carro.id} - Nombre: ${carro.nombre} - Descripción: ${carro.descripcion} - Precio: ${carro.precio} - Stock: ${carro.stock}`
                        );
                    doc.moveDown(0.5);
                });

                doc.end();

                writeStream.on('finish', async () => {
                    console.log('PDF guardado en:', filePath);
                    const variableBase64 = await convertirYGuardarArchivoBase64(nombreDelArchivo);
                    resolve(variableBase64 || '');
                });

                writeStream.on('error', (err) => reject('Error al guardar el PDF: ' + err));
            } else {
                reject('Tipo de guardado no soportado.');
            }
        } catch (error) {
            reject('Error en el proceso: ' + error);
        }
    });
};

export const guardarArchivoUnCarroFile = async (id: string, tipoGuardado: 'pdf' | 'txt'): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("el tipo de guardado es: " + tipoGuardado);
            const carro = await Car.findByPk(id);
            const existe = await existeCarro(id)

            let nombreDelArchivo = "";
            const folderPath = path.join(__dirname, "../ArchivosGuardados");
            if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

            if (tipoGuardado === "txt" && existe) {
                let filePath = path.join(folderPath, "Carro.txt");
                let i = 1;
                while (fs.existsSync(filePath)) {
                    filePath = path.join(folderPath, `Carro${i}.txt`);
                    i++;
                }
                nombreDelArchivo = path.basename(filePath);

                // Crear el contenido del archivo .txt
                let fileContent = "Detalle de Carro\n\n";

                // Agregar los carros al archivo .txt

                fileContent += ` ID: ${carro.id} - Nombre: ${carro.nombre} - Descripcion: ${carro.descripcion} - Precio: ${carro.precio} - Stock: ${carro.stock}\n`;

                fs.writeFile(filePath, fileContent, async (err) => {
                    if (err) return reject("Error al guardar el archivo TXT: " + err);
                    console.log("Archivo TXT guardado en:", filePath);

                    const variableBase64 = await convertirYGuardarArchivoBase64(nombreDelArchivo);
                    resolve(variableBase64 || '');
                });

            } else if (tipoGuardado === "pdf" && existe) {
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
                    console.log("PDF guardado en:", filePath);
                    const variableBase64 = await convertirYGuardarArchivoBase64(nombreDelArchivo);
                    resolve(variableBase64 || '');
                });

                writeStream.on("error", (err) => reject("Error al guardar el PDF: " + err));
            } else {
                reject("Tipo de guardado no soportado.");
            }
        } catch (error) {
            reject("Error en el proceso: " + error);
        }

    }
    );
};

/*************Subir al servidor ********* */
export const subirListaServidor = async (nombreArchivo: string, TipoTransferencia: string, host: string, user: string, password: string) => {
    // Ruta relativa al archivo
    const localFilePath = `../ArchivosGuardados/${nombreArchivo}`;

    // Convertir la ruta relativa a una ruta absoluta
    const absoluteFilePath = path.resolve(__dirname, localFilePath);
    //console.log("la ruta absoluta es : " + absoluteFilePath);

    const remoteFilePath = `/${nombreArchivo}`;
    //const transferMode = 'binary';
    const transferMode = TipoTransferencia;
    console.log(`ahora ..........El tipo de transferencia es ${TipoTransferencia}`);

    if (IsString(nombreArchivo) && typeTransfer(TipoTransferencia) && IsString(host) && IsString(user) && IsString(password)) {

        await uploadFileToFTP(absoluteFilePath, remoteFilePath, transferMode, host, user, password);
    }
    else {
        if (!IsString(nombreArchivo)) {
            throw new Error("ingresa el nombre correctamente")
        }
        if (!typeTransfer(TipoTransferencia)) {  /* !false = true entra y se evalua */
            // console.log("no ingresaste correctamente el tipo de transferencia ")
            throw new Error("el tipo tiene que ser text o binary")
        }
        if (!IsString(host)) {
            throw new Error("ingresa el host correctamente")
        }
        if (!IsString(user)) {
            throw new Error("ingresa el user correctamente")
        }
        if (!IsString(password)) {
            throw new Error("ingresa el password correctamente")
        }
    }
}



export const obtenerBase64 = async (nombreArchivo: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            const base64Data = await convertirYGuardarArchivoBase64(nombreArchivo);
            resolve(base64Data);
        } catch (error) {
            reject("Error al obtener el archivo en Base64: " + error);
        }

    })
}

export const convertirBase64toFileUpdate = async (base64Data: string, nombreArchivo: string, extension: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            if (!base64Data || !nombreArchivo || !extension) {
                return reject("Base64, nombre de archivo o extensión no proporcionados.");
            }
            // console.log("..........verificar ")
            // console.log(typeof nombreArchivo)

            if (!IsString(base64Data)) {
                return reject("Ingresa el codigo base64 como string")
            }
            if (!IsString(nombreArchivo)) {
                return reject("Ingresa el nombre correctamente es de tipo string")
            }
            if (!IsString(extension)) {
                return reject("Ingresa la extension  correctamente es txt o pdf")
            }

            // Crear la carpeta 'ArchivosConvertidosDeBase64' si no existe
            const folderPath = path.join(__dirname, "../ArchivosConvertidosDeBase64");
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath);
            }

            // Ruta del archivo con nombre y extensión
            let filePath = path.join(folderPath, `${nombreArchivo}.${extension}`);
            let i = 1;

            // Verificar si el archivo ya existe y cambiar el nombre si es necesario
            while (fs.existsSync(filePath)) {
                filePath = path.join(folderPath, `${nombreArchivo}${i}.${extension}`);
                i++;
            }

            // Convertir base64 a buffer
            const buffer = Buffer.from(base64Data, "base64");

            // Escribir el archivo
            fs.writeFile(filePath, buffer, (err) => {
                if (err) return reject("Error al guardar el archivo: " + err);
                console.log("Archivo guardado en:", filePath);
                resolve(filePath);
            });

        } catch (error) {
            reject("Error en el proceso: " + error);
        }
    });
};