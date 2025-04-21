export const IsString = (x: string): boolean => {
    if (typeof x === "string" && x.trim().length>0) {
        return true
    }
    else {
        return false
    }

}

export const typeTransfer = (x:any):boolean => {
    if(typeof x ==="string" && (x==="text" || x ==="binary")){
        return true
    }
    else{
        return false
    }
}