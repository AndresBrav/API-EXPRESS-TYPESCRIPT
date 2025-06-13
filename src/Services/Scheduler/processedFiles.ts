import Process_ftp, { ProcessFtpInstance } from '../../Models/modelProcess_ftp';
import Ftp, { FtpInstance } from '../../Models/modelFtp';

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

        // // Go through  Arrangment
        // await goThroughArrangment(files, local_directory, interpreted_directory);
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

    console.log('we are goint to processed files');
    const { interpreted_directory, processed_directory } = ftp;
    return { interpreted_directory, processed_directory };
};
