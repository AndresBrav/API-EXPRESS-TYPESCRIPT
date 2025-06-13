import { where } from 'sequelize';
import Process_ftp, { ProcessFtpInstance } from '../../Models/modelProcess_ftp';
import Ftp, { FtpInstance } from '../../Models/modelFtp';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

// work with pdfs........
import fs from 'fs/promises';
import pdfParse from 'pdf-parse';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

type ftp_ids = {
    ftp_id: number;
};

const ftp_idArray: ftp_ids[] = [
    {
        ftp_id: 1 /* .txt */
    },
    {
        ftp_id: 3 /* list .txt */
    },
    {
        ftp_id: 2 /* .pdf */
    }
];

type FileItem = {
    id: number;
    file_name: string;
    file_type: string;
};

export const processedAuthomaticFiles = async () => {
    for (const i of ftp_idArray) {
        // console.log(i.ftp_id);
        const ftp_id: number = i.ftp_id;
        // bring from data base
        const files: FileItem[] = await consultDataBaseStates(ftp_id, 1);
        console.log(files);

        // bring directories from Data Base
        const { local_directory, processed_directory } = await getDirectories(
            ftp_id
        ); /* 1 id ftp */
        console.log(local_directory, processed_directory);

        // Go through  Arrangment
        await goThroughArrangment(files, local_directory, processed_directory);
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
): Promise<{ local_directory: string; processed_directory: string }> => {
    const ftp: FtpInstance = await Ftp.findOne({
        where: { id: ftp_id },
        raw: true,
        attributes: ['local_directory', 'processed_directory']
    });

    console.log('we are goint to processed files');
    const { local_directory, processed_directory } = ftp;
    return { local_directory, processed_directory };
};

const goThroughArrangment = async (
    files: FileItem[],
    local_directory: string,
    processed_directory: string
) => {
    for (let i = 0; i < files.length; i++) {
        try {
            const fileName = files[i].file_name;
            const idFile = files[i].id;
            const file_type: string = files[i].file_type;

            if (file_type === '.txt') {
                // download file in interpreted folder
                await downloadProcessedFile(local_directory, processed_directory, fileName);
                // change the state 2 in dataBase
                await changeStateDB(idFile, fileName);
            } else {
                if (file_type === '.pdf') {
                    await downloadProcessedFilePDF(local_directory, processed_directory, fileName);
                }
            }
        } catch (error) {
            console.error('Error reading file:', error);
        }
    }
};

const downloadProcessedFile = async (
    local_directory: string,
    processed_directory: string,
    fileName: string
) => {
    const fullInputPath = path.join(local_directory, fileName); // ✅ Route of the file
    const fullOutputPath = path.join(processed_directory, fileName); // ✅ Destino del nuevo archivo
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
    console.log(`File processed successfully: ${fileName}`);
    console.log(`Saved in: ${fullOutputPath}`);
};

const downloadProcessedFilePDF = async (
    local_directory: string,
    processed_directory: string,
    fileName: string
) => {
    // try {
    //     const fullInputPath = path.join(local_directory, fileName);
    //     const fullOutputPath = path.join(processed_directory, fileName);
    //     await fs.access(fullInputPath);
    //     const dataBuffer = await fs.readFile(fullInputPath);
    //     // Verificar que sea un PDF
    //     const magicNumber = dataBuffer.toString('utf8', 0, 5);
    //     if (!magicNumber.startsWith('%PDF-')) {
    //         throw new Error('El archivo no es un PDF válido');
    //     }
    //     let originalText = '';
    //     try {
    //         const pdfData = await pdfParse(dataBuffer);
    //         originalText = pdfData.text;
    //     } catch (innerError) {
    //         console.warn(
    //             '⚠️ Error parcial al leer el PDF, se recuperará texto parcial si es posible'
    //         );
    //     }
    //     if (!originalText) {
    //         console.warn('No se pudo extraer texto del PDF');
    //         return;
    //     }
    //     // 🧹 Filtrar "Descripcion: ..."
    //     const filteredText = originalText
    //         .split('\n')
    //         .map((line) => line.replace(/Descripcion:[^-\n]+ -\s*/, ''))
    //         .join('\n');
    //     // 📝 Crear nuevo PDF
    //     const pdfDoc = await PDFDocument.create();
    //     const page = pdfDoc.addPage();
    //     const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    //     const fontSize = 12;
    //     const { width, height } = page.getSize();
    //     // Dividir en líneas y dibujar en el PDF
    //     const lines = filteredText.split('\n');
    //     let y = height - 40;
    //     for (const line of lines) {
    //         page.drawText(line, {
    //             x: 10,
    //             y,
    //             size: fontSize,
    //             font
    //         });
    //         y -= fontSize + 4;
    //         if (y < 100) break; // no escribir fuera de la página
    //     }
    //     const pdfBytes = await pdfDoc.save();
    //     await fs.writeFile(fullOutputPath, pdfBytes);
    //     console.log(`✅ Nuevo PDF guardado en: ${fullOutputPath}`);
    // } catch (error) {
    //     console.error('❌ Error leyendo o procesando el PDF:', error);
    // }
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
