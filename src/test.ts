import { downloadFileFromFTP } from './Services/basic-ftp';

const test = async () => {
    console.log('we bring datas');
    const element = 'Carro2.txt';
    const downloadPath = '../downloadsFromFTP/TXT/';
    const host = '127.0.0.1';
    const user = 'ftpuser';
    const password = '123';
    const transferMode = 'binary';

    const { size, lastModified } = await downloadFileFromFTP(
        element, // Route of file in the FTP
        downloadPath, //  local folder where it will be saved
        host, // Host FTP
        user, // User
        password, // Password
        transferMode // transferMode
    );

    console.log('............................the file size is .....');
    console.log(`File size: ${size} bytes`);
    console.log('the last date when it was modified is ');
    console.log(lastModified);
};

test();
