import path from 'path';
import { readFile } from 'fs/promises';

// function to conver file to b64
export const returnB64fromFile = async (nombreArchivo: string): Promise<string | null> => {
    try {
        // Relative path to the file
        const localFilePath = path.resolve(__dirname, '../ArchivosGuardados/', nombreArchivo);

        // read te file async way
        const data = await readFile(localFilePath);

        // Convert to Base64
        const base64String: string = data.toString('base64');
        // console.log("the file converted is ....")
        // console.log(base64String)
        return base64String;
    } catch (error) {
        console.error('Error reading file:', error);
        return null;
    }
};
