import { where } from 'sequelize';
import Process_ftp, { ProcessFtpInstance } from '../../Models/modelProcess_ftp';
import Ftp, { FtpInstance } from '../../Models/modelFtp';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const ftp_idkey = 1; /* ftp_id */

type FileItem = {
    id: number;
    file_name: string;
};

export const processedAuthomaticFiles = async () => {
    // bring from data base
    const files: FileItem[] = await consultDataBaseStates(1, 1);
    console.log(files);

    // bring directories from Data Base
    const { local_directory, interpreted_directory } = await getDirectories(1);
    console.log(local_directory, interpreted_directory);

    // Go through  Arrangment
    await goThroughArrangment(files, local_directory, interpreted_directory);
};

export const consultDataBaseStates = async (ftp_id: number, state: number): Promise<FileItem[]> => {
    try {
        const filesDB: ProcessFtpInstance[] = await Process_ftp.findAll({
            where: { ftp_id: ftp_id, state: state },
            raw: true,
            attributes: ['id', 'file_name']
        });
        return filesDB as FileItem[];
    } catch (error) {
        throw new Error("we can't make the consult in DB");
    }
};

const getDirectories = async (
    ftp_id: number
): Promise<{ local_directory: string; interpreted_directory: string }> => {
    const ftp: FtpInstance = await Ftp.findOne({
        where: { id: ftp_id },
        raw: true,
        attributes: ['local_directory', 'interpreted_directory']
    });

    console.log('we are goint to processed files');
    const { local_directory, interpreted_directory } = ftp;
    return { local_directory, interpreted_directory };
};

const goThroughArrangment = async (
    files: FileItem[],
    local_directory: string,
    interpreted_directory: string
) => {
    for (let i = 0; i < files.length; i++) {
        try {
            const fileName = files[i].file_name;
            const idFile = files[i].id;

            // download file in interpreted folder
            await downloadInterpretedFile(local_directory, interpreted_directory, fileName);

            // change the state 2 in dataBase
            await changeStateDB(idFile, fileName);
        } catch (error) {
            console.error('Error reading file:', error);
        }
    }
};

const downloadInterpretedFile = async (
    local_directory: string,
    interpreted_directory: string,
    fileName: string
) => {
    const fullInputPath = path.join(local_directory, fileName); // ✅ Route of the file
    const fullOutputPath = path.join(interpreted_directory, fileName); // ✅ Destino del nuevo archivo
    const contenido = await readFile(fullInputPath, { encoding: 'utf-8' });
    const lineas = contenido
        .split(/\r?\n/) // Soporta archivos con \r\n (Windows) o \n (Linux)
        .map((linea) => {
            // Ignorar encabezados que no tienen ID
            if (!linea.includes('ID:')) return linea;
            // Reemplazar "- Descripción: ... - Precio:" o "- Descripcion: ... - Precio:"
            return linea.replace(/ - Descrip(?:ci[oó]n): .*? - Precio:/i, ' - Precio:');
        });
    await writeFile(fullOutputPath, lineas.join('\n'), { encoding: 'utf-8' });
    console.log(`Archivo procesado correctamente: ${fileName}`);
    console.log(`Saved in: ${fullOutputPath}`);
};

const changeStateDB = async (idFile: number, fileName: string) => {
    const ChangeState = await Process_ftp.findOne({
        where: {
            id: idFile,
            file_name: fileName
        }
    });
    ChangeState.state = 2;
    ChangeState.save();
};
