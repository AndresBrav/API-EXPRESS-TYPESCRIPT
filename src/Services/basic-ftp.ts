import { Client } from 'basic-ftp';

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
    console.log(`el tipo de transferencia que se esta haciendo es ${transferMode}`);
    try {
        await client.access({
            host: host, /* 127.0.0.1 */
            user: user, /* userftp */
            password: password, /* 123 */
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
            throw new Error('Modo de transferencia no válido. Use "binary" o "text".');
        }

        await client.uploadFrom(localFilePath, remoteFilePath);
        console.log('File uploaded successfully');
    } catch (err) {
        console.error('Error uploading file:', err);
        throw err; // Propaga el error para que el controlador lo maneje
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
        const fileNames = list
            .filter(item => item.isFile)
            .map(file => file.name);

        return fileNames;
    } catch (err) {
        console.error('Error listing files:', err);
        throw err;
    } finally {
        client.close();
    }
}