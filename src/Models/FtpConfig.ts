
export class FtpConfig {
    ftp_path: string;
    host_ip: string;
    user: string;
    password: string;
    type_file: string;
    transfer_mode: string;
    file_format: string;
    local_directory: string;

    constructor(
        ftp_path: string,
        host_ip: string,
        user: string,
        password: string,
        type_file: string,
        transfer_mode: string,
        file_format: string,
        local_directory: string
    ) {
        this.ftp_path = ftp_path;
        this.host_ip = host_ip;
        this.user = user;
        this.password = password;
        this.type_file = type_file;
        this.transfer_mode = transfer_mode;
        this.file_format = file_format;
        this.local_directory = local_directory;
    }
}
