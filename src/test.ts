// console.log("first test")
import { readdir } from 'fs/promises';
import { join } from 'path';
import { FilterParams, FilterOptions } from "./Validations/filterTypesPath";
import { listFilesFromFTP, uploadFileToFTP } from './Services/basic-ftp'; /* bring files from ftp */
import path from 'path'

export const uploadAutomaticServer = async () => {
    try {
        const filters: FilterParams = {
            option1: FilterOptions.option1,
            option2: FilterOptions.option2,
            option3: FilterOptions.option3,
            option4: FilterOptions.option4
        };

        const filterFiles: string[] = await FilterFileslocalpath(filters)
        console.log("the filtered files are ")
        console.log(filterFiles)


        const filesfromFTP: string[] = await filesFromFTPMethod()
        console.log("the files brings from ftp are")
        console.log(filesfromFTP)

        await uploadAutomaticFiles(filterFiles, filesfromFTP)

    } catch (error) {
        console.error('Error reading the address:', error);
        // return [];
    }
}

const filesFromFTPMethod = async (): Promise<string[]> => {
    const archivos: string[] = await listFilesFromFTP('/', '127.0.0.1', 'ftpuser', '123');
    return archivos;
}

const FilterFileslocalpath = async (filters: FilterParams): Promise<string[]> => {
    try {
        const archivosGuardados: string[] = [];
        const ruta = join(__dirname, './ArchivosGuardados/');
        const archivos = await readdir(ruta);

        // const pattern = `^[${start}].*\\${finish}$`;  
        const pattern = `${filters.option3}`;  // Creates the patern as a string
        const regex = new RegExp(pattern, 'i');
        const archivosFiltrados = archivos.filter(nombre => regex.test(nombre));
        // const archivosFiltrados = archivos.filter(nombre => {
        //     // return /^[cC].*\.txt$/i.test(nombre);
        // });

        return archivosFiltrados;

    } catch (error) {
        return [];
    }
}

const uploadAutomaticFiles = async (filterFiles: string[], filesfromFTP: string[]) => {
    // console.log(filterFiles.length)
    for (let index = 0; index < filterFiles.length; index++) {
        const element = filterFiles[index];
        console.log("the name's file is ", element)
        if (filesfromFTP.includes(element)) {
            console.log("will not go up")

            // const date: Date = new Date()
            // // Obtener la hora en Bolivia como string ISO válido para SQL
            // const boliviaTime = new Date(date.getTime() - 4 * 60 * 60 * 1000);

            // // console.log("the date is ", date)
            // console.log(boliviaTime)
            // console.log(date.toISOString()); // Para debug

            const DatesSQL = getBoliviaDateAsSQLString();
            console.log("Fecha válida para SQL:", DatesSQL);
        }
        else {
            console.log("will go up")
            //Relative path to the file
            const localFilePath = `./ArchivosGuardados/${element}`;

            //Convert relative path to the absoluted path
            const absoluteFilePath = path.resolve(__dirname, localFilePath);
            const remoteFilePath = `/${element}`;

            const transferMode = 'binary'
            const host = '127.0.0.1'
            const user = 'ftpuser'
            const password = '123'

            const date: Date = new Date()

            console.log("the date is ", date)

            try {
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

function getBoliviaDateAsSQLString(): string {
    const now = new Date();

    const boliviaTimeStr = now.toLocaleString('en-US', {
        timeZone: 'America/La_Paz',
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    // boliviaTimeStr = '05/14/2025, 10:31:15'
    // Convertimos eso a formato SQL: '2025-05-14 10:31:15'

    const [datePart, timePart] = boliviaTimeStr.split(', ');
    const [month, day, year] = datePart.split('/');

    return `${year}-${month}-${day} ${timePart}`;
}

uploadAutomaticServer();