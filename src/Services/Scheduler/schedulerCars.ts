import { filesFromFTPMethod, filterforfile_format } from '../../util/filterFiles';
import { getBoliviaDate } from '../../util/getDates';
import { downloadFileFromFTP } from '../basic-ftp';
import Ftp from '../../Models/modelFtp';
import Process_ftp from '../../Models/modelProcess_ftp';
import { FileConfig, configs } from '../../util/filterOptions';
import { FtpConfig } from '../../Models/FtpConfig';

export const downloadAutomaticFiles = async () => {
    for (const i of configs) {
        /* go through arrangement */
        await downloadFiles(i.ftp_id, i.ftp_user, i.file_format, i.type_file_filter);
    }
};

const downloadFiles = async (
    ftp_id: number,
    ftp_user: string,
    file_for: string,
    type_filefilter: string
) => {
    // return FTP config
    const instanceFTP: FtpConfig = await ReturnFTPconfig(ftp_user, file_for, type_filefilter);

    // from ftp
    const filteredfiles_from_FTP = await FilterFTP(instanceFTP);
    console.log('the files filtered from ftp are');
    console.log(filteredfiles_from_FTP);

    // from database
    const filteredfiles_from_DataBase = await filterDataBase(ftp_id, type_filefilter);
    console.log('the files filtered from DB are');
    console.log(filteredfiles_from_DataBase);

    await compareFiles(filteredfiles_from_FTP, filteredfiles_from_DataBase, instanceFTP, ftp_id);
};

export const compareFiles = async (
    filteredfilesFTP: string[],
    filteredFilesDB: string[],
    instanceFTP: FtpConfig,
    ftp_id: number
) => {
    for (let index = 0; index < filteredfilesFTP.length; index++) {
        const element = filteredfilesFTP[index];
        if (filteredFilesDB.includes(element)) {
            console.log('the file already exists');
        } else {
            // download from data base
            const { size, lastModified } = await downloadFileFromFTP(
                element,
                instanceFTP.local_directory,
                instanceFTP.host_ip,
                instanceFTP.user,
                instanceFTP.password,
                instanceFTP.transfer_mode
            );
            const filesize: string = size + ' kb';
            // upload to database
            const boliviaTime: Date = getBoliviaDate();
            /* upload to database */
            await uploadDataBase(
                ftp_id,
                element,
                instanceFTP.file_format /* .txt */,
                filesize,
                lastModified,
                boliviaTime,
                1 /* state */
            );
        }
    }
};

const ReturnFTPconfig = async (
    ftp_user: string,
    file_for: string,
    type_filefilter: string
): Promise<FtpConfig> => {
    // consulsts data base
    const data = await Ftp.findOne({
        where: { user: ftp_user, file_format: file_for, type_file: type_filefilter },
        raw: true
    });

    if (!data) throw new Error('No FTP configuration found');

    const ftpConfig = new FtpConfig(
        data.ftp_path,
        data.host_ip,
        data.user,
        data.password,
        data.type_file,
        data.transfer_mode,
        data.file_format,
        data.local_directory
    );

    return ftpConfig;
};

export const FilterFTP = async (ftpConfig: FtpConfig): Promise<string[]> => {
    /* filter files from FTP */
    const filesfromFTP: string[] = await filesFromFTPMethod(
        ftpConfig.ftp_path,
        ftpConfig.host_ip,
        ftpConfig.user,
        ftpConfig.password
    );

    console.log('the files that come from ftp are : ');
    console.log(filesfromFTP);

    const filteredfilesFTP = filterforfile_format(ftpConfig.type_file, filesfromFTP);
    return filteredfilesFTP;
};

export const filterDataBase = async (ftp_id: number, type_file: string): Promise<string[]> => {
    const filesFromDB = await Process_ftp.findAll({
        where: { ftp_id: ftp_id },
        raw: true,
        attributes: ['file_name']
    });

    const filesDB = filesFromDB.map((file) => file.file_name);
    const filteredFilesDB = filterforfile_format(type_file, filesDB);
    return filteredFilesDB;
};

export const uploadDataBase = async (
    ftp_id: number,
    file_name: string,
    file_type: string,
    file_size: string,
    file_date_creation: Date,
    file_download: Date,
    state: number
) => {
    // we are going to upload to Data Base
    Process_ftp.create({
        ftp_id,
        file_name,
        file_type,
        file_size,
        file_date_creation,
        file_download,
        state
    });
};
