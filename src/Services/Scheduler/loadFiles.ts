import FilesProcessed, { DetailFileProcessedInterface } from '../../Models/modelFilesProcessed';
import Ftp from '../../Models/modelFtp';
import path from 'path';
import { readdir, readFile as fsReadFile } from 'fs/promises'; // ✅ Renombramos readFile
import { getBoliviaDate } from '../../util/getDates';

import fs from 'fs';
// import mysql from 'mysql2/promise';
import mysql, { Connection } from 'mysql2/promise';

type CarData = {
    id: number;
    precio: number;
    stock: number;
};

export const reloadDataBase = async () => {
    const processed_directory: string = await getDirectory();

    const files: string[] = await readDirectory(processed_directory); //names of the files
    if (!files || files.length === 0) {
        console.log('No files found in directory.');
        return;
    }

    // console.log(files);

    for (let i: number = 0; i < files.length; i++) {
        const fileName = files[i];
        console.log(fileName);
        // await uploadDataBaseFilesProcessed(processed_directory, fileName); //massive uploading of files
        const list: CarData[] = await readFile(processed_directory, fileName);
        await uploadFilesDB(list);
    }
};

const getDirectory = async (): Promise<string> => {
    const ftp = await Ftp.findOne({
        where: {
            id: 3
        },
        raw: true,
        attributes: ['processed_directory']
    });

    const { processed_directory } = ftp;
    return processed_directory;
};

const readDirectory = async (processed_directory: string): Promise<string[]> => {
    const absoluteFilePath = path.resolve(processed_directory);
    // console.log('The correct path is:', absoluteFilePath);
    try {
        const files = await readdir(absoluteFilePath);
        return files;
    } catch (error) {
        console.error('Error reading directory:', error);
        return []; // Devuelve un array vacío si hay error
    }
};

// const uploadDataBaseFilesProcessed = async (processed_directory: string, fileName: string) => {
//     const filePath = path.resolve(
//         'C:/Users/Asus/Desktop/Comteco Proyectos/Processed/TXT/L/',
//         fileName
//     );

//     const pool = mysql.createPool({
//         host: 'localhost',
//         user: 'root',
//         password: '',
//         database: 'carroscrudts',
//         waitForConnections: true,
//         connectionLimit: 10,
//         queueLimit: 0,
//         multipleStatements: true,
//         streamFactory: (path) => fs.createReadStream(path)
//     } as any);

//     const connection = await pool.getConnection();

//     const sql = `
//         LOAD DATA LOCAL INFILE ?
//         INTO TABLE filesprocessed
//         FIELDS TERMINATED BY ','
//         LINES TERMINATED BY '\\n'
//         (id_car, precio, stock)
//         SET dateupload = NOW()
//     `;

//     try {
//         if (!fs.existsSync(filePath)) {
//             throw new Error(`Archivo no encontrado: ${filePath}`);
//         }

//         await connection.query(sql, [filePath]);
//         console.log('✅ Datos cargados exitosamente a filesprocessed');
//     } catch (err) {
//         console.error('❌ Error al ejecutar LOAD DATA INFILE:', err.message);
//     } finally {
//         await connection.release(); //  important
//     }
// };

const readFile = async (processed_directory: string, fileName: string): Promise<CarData[]> => {
    const fullInputPath = path.join(processed_directory, fileName);
    const contenido = await fsReadFile(fullInputPath, { encoding: 'utf-8' });

    const lineas = contenido.split(/\r?\n/);
    const datosExtraidos: CarData[] = [];

    for (const linea of lineas) {
        if (!linea.trim()) continue; // Ignorar líneas vacías
        const [idStr, precioStr, stockStr] = linea.split(',');
        if (idStr && precioStr && stockStr) {
            datosExtraidos.push({
                id: parseInt(idStr),
                precio: parseFloat(precioStr),
                stock: parseInt(stockStr)
            });
        }
    }

    return datosExtraidos;
};

const uploadFilesDB = async (list: CarData[]) => {
    const filesDB = await FilesProcessed.findAll({
        raw: true
    });

    for (const item of list) {
        // We search if an object with the same id, price and stock exists in the first array.
        const Exists = filesDB.some((otro) => {
            return (
                otro.id_car === item.id && otro.precio === item.precio && otro.stock === item.stock
            );
        });

        // Show the result
        if (Exists) {
            console.log(`already exists: id=${item.id}`);
        } else {
            const date = getBoliviaDate();
            const newFile: DetailFileProcessedInterface = await FilesProcessed.create({
                id_car: item.id,
                precio: item.precio,
                stock: item.stock,
                dateupload: date
            });
        }
    }
};
