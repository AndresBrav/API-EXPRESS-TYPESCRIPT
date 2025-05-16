import { listFilesFromFTP } from "../Services/basic-ftp";
import { join } from 'path';
import { readdir } from 'fs/promises';

export const filesFromFTPMethod = async (
    remoteDir: string,
    host: string,
    user: string,
    password: string
): Promise<string[]> => {
    const files: string[] = await listFilesFromFTP(
        remoteDir,      /* / */
        host,           /* 127.0.0.1 */
        user,           /* ftpuser */
        password        /* 123 */
    );
    return files;
}

export const FilterFileslocalpath = async (filter: string, local_path: string): Promise<string[]> => {
    try {
        const route = join(__dirname, `${local_path}`);
        const files = await readdir(route);
        // const pattern = `^[${start}].*\\${finish}$`;  
        const pattern = `${filter}`;  // Creates the patern as a string
        // const pattern = `^[cC].*\.txt$`;  // Creates the patern as a string
        const regex = new RegExp(pattern, 'i');
        const filteredfiles = files.filter(nombre => regex.test(nombre));

        return filteredfiles;

    } catch (error) {
        return [];
    }
}