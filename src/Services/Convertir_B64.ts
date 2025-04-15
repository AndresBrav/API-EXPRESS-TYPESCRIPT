import path from 'path';
import { readFile } from 'fs/promises';

// Función para convertir un archivo a Base64 y luego decodificarlo a un archivo
export const convertirYGuardarArchivoBase64 = async (nombreArchivo: string): Promise<string | null> => {
    try {
        // Ruta relativa al archivo
        const localFilePath = path.resolve(__dirname, '../ArchivosGuardados/', nombreArchivo);

        // Leer el archivo de forma asíncrona
        const data = await readFile(localFilePath);

        // Convertir a Base64
        const base64String: string = data.toString('base64');
        console.log("el archivo convertido es ....")
        console.log(base64String)
        return base64String;
    } catch (error) {
        console.error('Error al leer el archivo:', error);
        return null;
    }
};

// convertirYGuardarArchivoBase64("../ArchivosGuardados/TSS.pdf");