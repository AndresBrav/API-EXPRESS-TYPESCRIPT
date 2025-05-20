import Ftp from "../../Models/modelFtp";
import HistoryFtp from "../../Models/modelhistory_Ftp";
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

    const filesfromFTP: string[] = await filesFromFTPMethod(remote_path, host, user, password)
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

    for (let index = 0; index < filteredfilesFTP.length; index++) {
        const element = filteredfilesFTP[index];
        console.log(element)
        // if(filteredFilesDB.includes(element)){
        //     console.log("the file already exists")
        // }
        // else{
        //     console.log("we upload to db")
        // }
        // from database
        // const data = await HistoryFtp.findOne({
        //     where: { name_file: element }
        //     // raw: true
        // })
        // // console.log(data)
        // if (!data) {
        //     console.log("data not exist")

        // }
        // else {
        //     console.log("let's find out")
        //     if (filteredfilesFTP.includes(data.name_file)) {
        //         console.log("data exists")
        //         console.log(data.name_file)
        //         const boliviaTimeDownload: Date = getBoliviaDate()
        //         await data.update({ downloaded: boliviaTimeDownload }) /* update time of download */

        //         // download fles to adress
        //         await downloadFileFromFTP(
        //             element,                // Route of file in the FTP
        //             downloadPath,           //  local folder where it will be saved
        //             host,                   // Host FTP
        //             user,                   // User
        //             password,               // Password
        //             transferMode            // transferMode
        //         );
        //     }

        // }
    }

}