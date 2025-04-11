export interface RespPhrase {
    val: string;
    auth1?: string;
    auth2?: string;
    tokenValidator1?: string;
    errorHandler1?: string;
}

export const respPhrase: { [key: string]: RespPhrase } = {
    OK: {
        val: "OK",
        auth1: "Acceso autorizado"
    },
    CREATED: {
        val: "Creado"
    },
    ACCEPTED: {
        val: "Aceptado"
    },
    NO_CONTENT: {
        val: "Sin Contenido"
    },
    BAD_REQUEST: {
        val: "Solicitud Incorrecta"
    },
    UNAUTHORIZED: {
        val: "Sin Autorización",
        auth1: "Usuario o contraseña, incorrectos",
        auth2: "Cuenta inactiva",
        tokenValidator1: "Token invalido"
    },
    PAYMENT_REQUIRED: {
        val: "Pago Requerido"
    },
    FORBIDDEN: {
        val: "Prohibido el Acceso"
    },
    NOT_FOUND: {
        val: "No Encontrado"
    },
    METHOD_NOT_ALLOWED: {
        val: "Método no Permitido"
    },
    NOT_ACCEPTABLE: {
        val: "No Aceptado"
    },
    REQUEST_TIMEOUT: {
        val: "Tiempo Excedido"
    },
    INTERNAL_SERVER_ERROR: {
        val: "Error Interno del Servidor",
        errorHandler1: "Consulte con el administrador"
    },
    NOT_IMPLEMENTED: {
        val: "No Implementado"
    },
    SERVICE_UNAVAILABLE: {
        val: "Servicio no Disponible",
    }
};

export const respCode = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT_REQUIRED: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    REQUEST_TIMEOUT: 408,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    SERVICE_UNAVAILABLE: 503
};
