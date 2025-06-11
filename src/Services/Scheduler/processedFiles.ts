import { where } from 'sequelize';
import Process_ftp, { ProcessFtpInstance } from '../../Models/modelProcess_ftp';
import Ftp, { FtpInstance } from '../../Models/modelFtp';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const ftp_idkey = 1;

export const processedAuthomaticFiles = async () => {
    const filesDB: ProcessFtpInstance[] = await Process_ftp.findAll({
        where: { ftp_id: ftp_idkey, state: 1 },
        raw: true,
        attributes: ['id', 'file_name']
    });
    
    const files = [...filesDB];
    console.log(files);

    const ftp: FtpInstance = await Ftp.findOne({
        where: { id: ftp_idkey },
        raw: true,
        attributes: ['local_directory', 'interpreted_directory']
    });

    console.log('we are goint to processed files');
    const { local_directory, interpreted_directory } = ftp;

    for (let i = 0; i < files.length; i++) {
        try {
            const fileName = files[i].file_name;
            const idFile = files[i].id;

            const fullInputPath = path.join(local_directory, fileName); // ✅ Ruta completa al archivo
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

            const ChangeState = await Process_ftp.findOne({
                where: {
                    id: idFile,
                    file_name: fileName
                }
            });
            ChangeState.state = 2;
            ChangeState.save();

        } catch (error) {
            console.error('Error reading file:', error);
        }
    }
};
