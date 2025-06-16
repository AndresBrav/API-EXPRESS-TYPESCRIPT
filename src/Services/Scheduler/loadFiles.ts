import FilesProcessed, { DetailFileProcessedInterface } from '../../Models/modelFilesProcessed';
import Ftp from '../../Models/modelFtp';
import path from 'path';
import { readdir, readFile as fsReadFile } from 'fs/promises'; // ✅ Renombramos readFile
import { getBoliviaDate } from '../../util/getDates';

type CarData = {
    id: number;
    precio: number;
    stock: number;
};

export const reloadDataBase = async () => {
    const processed_directory: string = await getDirectory();

    const files: string[] = await readDirectory(processed_directory);
    if (!files || files.length === 0) {
        console.log('No files found in directory.');
        return;
    }

    console.log(files);

    for (let i: number = 0; i < files.length; i++) {
        const fileName = files[i];
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
    console.log('The correct path is:', absoluteFilePath);
    try {
        const files = await readdir(absoluteFilePath);
        return files;
    } catch (error) {
        console.error('Error reading directory:', error);
        return []; // Devuelve un array vacío si hay error
    }
};

const readFile = async (processed_directory: string, fileName: string): Promise<CarData[]> => {
    // const fileName = fileName;
    const fullInputPath = path.join(processed_directory, fileName);
    const contenido = await fsReadFile(fullInputPath, { encoding: 'utf-8' });

    const lineas = contenido.split(/\r?\n/);
    const datosExtraidos: CarData[] = [];

    for (const linea of lineas) {
        const regex = /ID:\s*(\d+)\s*-\s*Precio:\s*(\d+)\s*-\s*Stock:\s*(\d+)/;
        const match = linea.match(regex);
        if (match) {
            const [, id, precio, stock] = match;
            datosExtraidos.push({
                id: parseInt(id),
                precio: parseFloat(precio),
                stock: parseInt(stock)
            });
        }
    }

    return datosExtraidos;
};

const uploadFilesDB = async (list: CarData[]) => {
    for (const i of list) {
        const date = getBoliviaDate();
        const newFile: DetailFileProcessedInterface = await FilesProcessed.create({
            id_car: i.id,
            precio: i.precio,
            stock: i.stock,
            dateupload: date
        });
    }
};
