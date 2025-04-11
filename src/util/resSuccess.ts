class ResSuccess {
    success: boolean;
    statuscode: number;
    code: number;
    message: string;
    result: any; // Puedes especificar un tipo más concreto si sabes qué tipo de datos esperas

    constructor(statuscode: number, message: string, result: any) {
        this.success = true;
        this.statuscode = statuscode;
        this.code = statuscode;
        this.message = message;
        this.result = result;
    }

    response(): { success: boolean, code: number, message: string, result: any } {
        const resp = {
            success: this.success,
            code: this.code,
            message: this.message,
            result: this.result || {}
        };
        return resp;
    }
}

export default ResSuccess;
