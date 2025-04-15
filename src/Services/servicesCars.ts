import Car,{CarsInterface} from "../Models/modelCar";
import User from "../Models/modelUser";
import verifyToken, { AuthenticatedRequest } from "../Middlewares/verifyToken"; 
import { Request, Response } from "express";
import path from 'path'
import fs from 'fs'
import PDFDocument from "pdfkit"; 
import {convertirYGuardarArchivoBase64} from '../Services/Convertir_B64'
import { uploadFileToFTP } from "./basic-ftp";

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

  export const guardarArchivoUnCarroFile = async (id:string, tipoGuardado:'pdf' | 'txt'):Promise<string> => {
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
export const subirListaServidor = async (nombreArchivo, TipoTransferencia, host, user, password) => {
  // Ruta relativa al archivo
  const localFilePath = `../ArchivosGuardados/${nombreArchivo}`;

  // Convertir la ruta relativa a una ruta absoluta
  const absoluteFilePath = path.resolve(__dirname, localFilePath);
  //console.log("la ruta absoluta es : " + absoluteFilePath);

  const remoteFilePath = `/${nombreArchivo}`;
  //const transferMode = 'binary';
  const transferMode = TipoTransferencia;
  console.log(`ahora ..........El tipo de transferencia es ${TipoTransferencia}`);

  //uploadFileToFTP(localFilePath, remoteFilePath, transferMode);
  await uploadFileToFTP(absoluteFilePath, remoteFilePath, transferMode, host, user, password);
}