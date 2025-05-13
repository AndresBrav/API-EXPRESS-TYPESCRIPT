export enum FilterAtxt {
    startsWith = "a",
    endsWith = ".txt"
}

export enum FilterCtxt {
    startsWith = "c",
    endsWith = ".txt"
}

export enum FilterLtxt {
    startsWith = "l",
    endsWith = ".txt"
}

export enum FilterApdf {
    startsWith = "a",
    endsWith = ".pdf"
}

export enum FilterCpdf {
    startsWith = "c",
    endsWith = ".pdf"
}

export enum FilterLpdf {
    startsWith = "l",
    endsWith = ".pdf"
}

// Interfaz para los filtros que usarás
export interface FilterParams {
    startsWith: string;
    endsWith: string;
}
