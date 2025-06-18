import Process_ftp, { ProcessFtpInstance } from '../../Models/modelProcess_ftp';
import Ftp, { FtpInstance } from '../../Models/modelFtp';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

type ftp_ids = {
    ftp_id: number;
};

const ftp_idArray: ftp_ids[] = [
    {
        ftp_id: 1 /* .txt */
    },
    {
        ftp_id: 3 /* list .txt */
    }
];

type FileItem = {
    id: number;
    file_name: string;
    file_type: string;
};

export const processedAuthomticFiles = async () => {
    for (const i of ftp_idArray) {
        // console.log(i.ftp_id);
        const ftp_id: number = i.ftp_id;
        // bring from data base
        const files: FileItem[] = await consultDataBaseStates(ftp_id, 2);
        console.log(files);

        // bring directories from Data Base
        const { interpreted_directory, processed_directory } = await getDirectories(
            ftp_id
        ); /* 1 id ftp */
        console.log(interpreted_directory, processed_directory);

        // Go through  Arrangment
        await goThroughArrangment(files, interpreted_directory, processed_directory);
    }
};

export const consultDataBaseStates = async (ftp_id: number, state: number): Promise<FileItem[]> => {
    try {
        const filesDB: ProcessFtpInstance[] = await Process_ftp.findAll({
            where: { ftp_id: ftp_id, state: state },
            raw: true,
            attributes: ['id', 'file_name', 'file_type']
        });
        return filesDB as FileItem[];
    } catch (error) {
        throw new Error("we can't make the consult in DB");
    }
};

const getDirectories = async (
    ftp_id: number
): Promise<{ interpreted_directory: string; processed_directory: string }> => {
    const ftp: FtpInstance = await Ftp.findOne({
        where: { id: ftp_id },
        raw: true,
        attributes: ['interpreted_directory', 'processed_directory']
    });

    // console.log('we are goint to processed files');
    const { interpreted_directory, processed_directory } = ftp;
    return { interpreted_directory, processed_directory };
};

const goThroughArrangment = async (
    files: FileItem[],
    interpreted_directory: string,
    processed_directory: string
) => {
    for (let i = 0; i < files.length; i++) {
        try {
            const fileName = files[i].file_name;
            const idFile = files[i].id;
            const file_type: string = files[i].file_type;

            if (file_type === '.txt') {
                // download file in interpreted folder
                await downloadProcessedFile(interpreted_directory, processed_directory, fileName);
                // change the state 2 in dataBase
                await changeStateDB(idFile, fileName);
            } else {
                // if (file_type === '.pdf') {
                //     await downloadInterpretedFilePDF(
                //         local_directory,
                //         interpreted_directory,
                //         fileName
                //     );
                // }
            }
        } catch (error) {
            console.error('Error reading file:', error);
        }
    }
};

// const downloadProcessedFile = async (
//     interpreted_directory: string,
//     processed_directory: string,
//     fileName: string
// ) => {
//     const fullInputPath = path.join(interpreted_directory, fileName);
//     const fullOutputPath = path.join(processed_directory, fileName);

//     const contenido = await readFile(fullInputPath, { encoding: 'utf-8' });

//     const lineas = contenido.split(/\r?\n/).map((linea) => {
//         if (!linea.trim()) return '';

//         // Eliminar numeración inicial tipo "1." o "12."
//         linea = linea.replace(/^\d+\.\s*/, '');

//         // Procesar línea con ID, eliminar Nombre, conservar Precio y Stock
//         if (linea.includes('ID:')) {
//             return linea.replace(
//                 /(ID:\s*\d+)\s*-.*?- (Precio:.*?)\s*- (Stock:.*)/i,
//                 '$1 - $2 - $3'
//             );
//         }

//         return linea;
//     });

//     await writeFile(fullOutputPath, lineas.join('\n'), { encoding: 'utf-8' });

//     console.log(`✅ File processed successfully: ${fileName}`);
//     console.log(`📍 Saved in: ${fullOutputPath}`);
// };

const downloadProcessedFile = async (
    interpreted_directory: string,
    processed_directory: string,
    fileName: string
) => {
    const fullInputPath = path.join(interpreted_directory, fileName);
    const fullOutputPath = path.join(processed_directory, fileName);

    const contenido = await readFile(fullInputPath, { encoding: 'utf-8' });

    const lineasProcesadas = contenido
        .split(/\r?\n/)
        .map((linea) => {
            if (!linea.trim()) return '';
            // Eliminar numeración inicial tipo "1." o "12."
            linea = linea.replace(/^\d+\.\s*/, '');

            // Extraer ID, Precio y Stock usando expresión regular
            const match = linea.match(
                /ID:\s*(\d+)\s*-\s*Nombre:.*?-\s*Precio:\s*(\d+)\s*-\s*Stock:\s*(\d+)/i
            );
            if (match) {
                const [, id, precio, stock] = match;
                return `${id},${precio},${stock}`;
            }

            return '';
        })
        .filter(Boolean); // Eliminar líneas vacías

    await writeFile(fullOutputPath, lineasProcesadas.join('\n'), { encoding: 'utf-8' });

    console.log(`✅ Archivo procesado correctamente: ${fileName}`);
    console.log(`📍 Guardado en: ${fullOutputPath}`);
};

const changeStateDB = async (idFile: number, fileName: string) => {
    const ChangeState = await Process_ftp.findOne({
        where: {
            id: idFile,
            file_name: fileName
        }
    });
    ChangeState.state = 3;
    ChangeState.save();
};
