import HistoryFtp from '../../Models/modelProcess_ftp';
import { filesFromFTPMethod, filterforfile_format } from '../../util/filterFiles';
import { getBoliviaDate } from '../../util/getDates';
import { downloadFileFromFTP } from '../basic-ftp';
import Ftp from '../../Models/modelFtp';
import Process_ftp from '../../Models/modelProcess_ftp';

export const downloadAutomaticFiles = async () => {
    const ftp_user: string = 'ftpuser';
    const file_for: string = '.txt';
    await downloadFiles(1, ftp_user, file_for); /* we are going to download files .txt */
};

const downloadFiles = async (ftp_id: number, ftp_user: string, file_for: string) => {
    // consulsts data base
    const data = await Ftp.findOne({
        where: { user: ftp_user, file_format: file_for },
        raw: true
    });
    // console.log('the data is ', data);

    const {
        ftp_path,
        host_ip,
        user,
        password,
        type_file,
        transfer_mode,
        file_format,
        local_directory
    } = data;

    /* filter files from FTP */

    const filesfromFTP: string[] = await filesFromFTPMethod(ftp_path, host_ip, user, password);
    // console.log('the files that come from ftp are : ');
    // console.log(filesfromFTP);

    const filteredfilesFTP = filterforfile_format(type_file, filesfromFTP);
    console.log('the files filtered from ftp are');
    console.log(filteredfilesFTP);

    /* Filter Files from Data Base ............................*/
    const filesFromDB = await Process_ftp.findAll({
        where: { ftp_id: ftp_id },
        raw: true,
        attributes: ['file_name']
    });

    const filesDB = filesFromDB.map((file) => file.file_name);
    // console.log('the files bringing from database are .');
    // console.log(filesDB);

    const filteredFilesDB = filterforfile_format(type_file, filesDB);
    console.log('the files filtered from DB are');
    console.log(filteredFilesDB);

    for (let index = 0; index < filteredfilesFTP.length; index++) {
        const element = filteredfilesFTP[index];
        if (filteredFilesDB.includes(element)) {
            console.log('the file already exists');
        } else {
            // download from data base
            const { size, lastModified } = await downloadFileFromFTP(
                element,
                local_directory,
                host_ip,
                user,
                password,
                transfer_mode
            );
            const filesize: string = size + ' kb';
            // upload to database
            const boliviaTime: Date = getBoliviaDate();
            /* upload to database */
            await uploadDataBase(
                ftp_id,
                element,
                file_format /* .txt */,
                filesize,
                lastModified,
                boliviaTime,
                1 /* state */
            );
        }
    }
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
