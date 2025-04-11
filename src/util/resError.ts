class ResError extends Error {
    success = false;
    statuscode: number;
    code: number;
    stack?: string;

    constructor(statuscode: number, message: string, stack?: string) {
        super(message);
        this.statuscode = statuscode;
        this.code = statuscode;
        this.stack = stack;
    }

    response() {
        const resp = {
            success: this.success,
            code: this.code,
            message: this.message,
            error: this.stack ? this.stack.replace(/(?:\r\n|\r|\n)/g, '') : "undefined"
        };

        if (process.env.PRODUCTION === '1') {
            const { error, ...respProd } = resp;
            console.log(error);
            return respProd;
        } else {
            return resp;
        }
    }
}

export default ResError;
