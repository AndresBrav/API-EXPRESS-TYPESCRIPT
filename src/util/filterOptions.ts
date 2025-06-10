export type FileConfig = {
    ftp_id: number;
    ftp_user: string;
    file_format: string;
    type_file_filter: string;
};

export const configs: FileConfig[] = [
    {
        ftp_id: 1,
        ftp_user: 'ftpuser',
        file_format: '.txt',
        type_file_filter: '^c.*.txt$'
    },
    {
        ftp_id: 3,
        ftp_user: 'ftpuser',
        file_format: '.txt',
        type_file_filter: '^l.*.txt$'
    },
    {
        ftp_id: 2,
        ftp_user: 'ftpuser',
        file_format: '.pdf',
        type_file_filter: '^c.*.pdf$'
    },
    {
        ftp_id: 4,
        ftp_user: 'ftpuser',
        file_format: '.pdf',
        type_file_filter: '^l.*.pdf$'
    }
];
