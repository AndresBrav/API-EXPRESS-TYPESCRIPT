export enum FilterOptions {
    option1 = '^[cC].*\.txt$', /* starts with c, finish with .txt */
    option2 = '^[cC].*\.pdf$', /* starts with c, finish with .pdf */
    option3 = '^[lL].*\.txt$',
    option4 = '^[lL].*\.pdf$'   
}

// Interfaz para los filtros que usarás
export interface FilterParams {
    option1?:string,
    option2?:string,
    option3?:string,
    option4?:string
}
