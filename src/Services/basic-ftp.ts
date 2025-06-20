import { Client } from 'basic-ftp';
import * as path from 'path';

export async function uploadFileToFTP(
    localFilePath: string,
    remoteFilePath: string,
    transferMode: string = 'binary',
    host: string,
    user: string = 'null',
    password: string = 'null'
): Promise<void> {
    const client = new Client();
    client.ftp.verbose = true;
    console.log(`the type of transfer being made is ${transferMode}`);
    try {
        await client.access({
            host: host /* 127.0.0.1 */,
            user: user /* userftp */,
            password: password /* 123 */,
            secure: true,
            port: 21,
            secureOptions: {
                rejectUnauthorized: false
            }
        });

        if (transferMode === 'binary') {
            await client.send('TYPE I');
        } else if (transferMode === 'text') {
            await client.send('TYPE A');
        } else {
            throw new Error('Invalid transfer mode.Use “binary” or “text”..');
        }

        await client.uploadFrom(localFilePath, remoteFilePath);
        console.log('File uploaded successfully');
    } catch (err) {
        console.error('Error uploading file:', err);
        throw err; // Propagates the error to be handled by the controller
    } finally {
        client.close();
    }
}

export async function listFilesFromFTP(
    remoteDir: string,
    host: string,
    user: string = 'null',
    password: string = 'null'
): Promise<string[]> {
    const client = new Client();
    client.ftp.verbose = true;

    try {
        await client.access({
            host: host,
            user: user,
            password: password,
            secure: true,
            port: 21,
            secureOptions: {
                rejectUnauthorized: false
            }
        });

        const list = await client.list(remoteDir);

        // Filtrar solo archivos (ignorar carpetas)
        const fileNames = list.filter((item) => item.isFile).map((file) => file.name);

        return fileNames;
    } catch (err) {
        console.error('Error listing files:', err);
        throw err;
    } finally {
        client.close();
    }
}

export async function downloadFileFromFTP(
    remoteFilePath: string /* name of the file /Carro1.txt */,
    localDirPath: string /* ../downloadsFromFTP/TXT */,
    host: string,
    user: string = 'null',
    password: string = 'null',
    transferMode: string = 'binary'
): Promise<{ size: number; lastModified: Date | null }> {
    const client = new Client();
    client.ftp.verbose = true;

    try {
        await client.access({
            host: host,
            user: user,
            password: password,
            secure: true,
            port: 21,
            secureOptions: {
                rejectUnauthorized: false
            }
        });

        if (transferMode === 'binary') {
            await client.send('TYPE I');
        } else if (transferMode === 'text') {
            await client.send('TYPE A');
        } else {
            throw new Error('Invalid transfer mode. Use “binary” or “text”.');
        }

        const fileName = path.basename(remoteFilePath);
        const localFilePath = path.join(localDirPath, fileName);

        // get and print the file size
        const size = await client.size(remoteFilePath);
        // console.log('............................the file size is .....');
        // console.log(`File size: ${size} bytes`);

        // get last modified date ...................
        const lastModified = await client.lastMod(remoteFilePath);
        // console.log('the last date is .....');
        // console.log(lastModified);

        // download the file
        await client.downloadTo(localFilePath, remoteFilePath);
        console.log(`file downloaded correctly in: ${localFilePath}`);
        return { size, lastModified };
    } catch (err) {
        console.error('Error downloading file', err);
        throw err;
    } finally {
        client.close();
    }
}
