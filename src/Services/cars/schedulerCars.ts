import Ftp from "../../Models/modelFtp";
import HistoryFtp from "../../Models/modelProcess_ftp";
import { filesFromFTPMethod, filterforfile_format } from "../../util/filterFiles";
import { getBoliviaDate } from "../../util/getDates";
import { downloadFileFromFTP } from "../basic-ftp";


export const downloadAutomaticFiles = async () => {
    const ftp_user: string = 'ftpuser'
    // consulsts data base
    const data = await Ftp.findOne({
        where: { user: ftp_user },
        raw: true
    })
    // console.log("the data is ", data)
    const {
        id,
        host,
        user,
        password,
        transferMode,
        downloadPath,
        remote_path,
        file_format
    } = data;

    const filesfromFTP: string[] = await filesFromFTPMethod(
        remote_path,
        host,
        user,
        password)

    console.log("the files brings from ftp are")
    console.log(filesfromFTP)

    const filteredfilesFTP = filterforfile_format(file_format, filesfromFTP)
    console.log("the files filtered from ftp are")
    console.log(filteredfilesFTP)


    const filesFromHistory_DB = await HistoryFtp.findAll({
        where: { ftp_id: id },
        raw: true,
        attributes: ['name_file']
    })
    const fileNamesDB = filesFromHistory_DB.map(file => file.name_file);
    console.log("the files from db are", fileNamesDB)

    const filteredFilesDB = filterforfile_format(file_format, fileNamesDB)
    console.log("the files filtered from DB are")
    console.log(filteredFilesDB)

    console.log("the size of ftp is ", filteredfilesFTP.length)
    for (let index = 0; index < filteredfilesFTP.length; index++) {
        const element = filteredfilesFTP[index];
        if (filteredFilesDB.includes(element)) {
            console.log("the file already exists")
        }
        else {
            // console.log("we upload to db")
            // console.log(element)
            // upload data base
            await uploadDataBase(element, id, downloadPath)

            // download from data base
            await downloadFtp(
                element,
                downloadPath,
                host,
                user,
                password,
                transferMode)
        }
    }
}

export const uploadDataBase = async (name_file: string, id: number, downloadPath: string) => {
    const boliviaTime: Date = getBoliviaDate()
    const uploaded = boliviaTime
    const downloaded = boliviaTime
    const ftp_id = id
    // const downloadPath = "../downloadsFromFTP"
    await HistoryFtp.create(
        {
            name_file,
            uploaded,
            downloaded,
            ftp_id,
            downloadPath
        }
    )
}

export const downloadFtp = async (
    element: string,
    downloadPath: string,
    host: string,
    user: string,
    password: string,
    transferMode: string
) => {
    // download fles to adress
    await downloadFileFromFTP(
        element,                // Route of file in the FTP
        downloadPath,           //  local folder where it will be saved
        host,                   // Host FTP
        user,                   // User
        password,               // Password
        transferMode            // transferMode
    );
}