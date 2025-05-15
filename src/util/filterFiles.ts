import { listFilesFromFTP } from "../Services/basic-ftp";
import { join } from 'path';
import { readdir } from 'fs/promises';
import { FilterOptions, FilterParams } from "../Validations/filterTypesPath";

export const filesFromFTPMethod = async (): Promise<string[]> => {
    const archivos: string[] = await listFilesFromFTP('/', '127.0.0.1', 'ftpuser', '123');
    return archivos;
}

export const FilterFileslocalpath = async (filter: string,local_path:string): Promise<string[]> => {
    try {
        const archivosGuardados: string[] = [];
        const ruta = join(__dirname, `${local_path}`);
        const archivos = await readdir(ruta);
        // const pattern = `^[${start}].*\\${finish}$`;  
        const pattern = `${filter}`;  // Creates the patern as a string
        // const pattern = `^[cC].*\.txt$`;  // Creates the patern as a string
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