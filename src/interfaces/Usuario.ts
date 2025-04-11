export interface Usuario {
    login: string;
    clave: string;
}

export interface UsuarioActualizado {
    username?: string;
    edad?: number;
    password?: string;
}
