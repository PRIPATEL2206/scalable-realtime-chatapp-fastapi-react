class CustomError {
    errro:string
    statusCode?:number

    constructor({
        error,
        statusCode
    }:{
        error:string,
        statusCode?:number
    }) {
        this.errro=error;
        this.statusCode=statusCode
    }

    toJson = () => ({
        error:this.errro,
        statusCode:this.statusCode
    })

    toString=()=> JSON.stringify(this.toJson()) 
    static fromString=(s:string)=>new CustomError(JSON.parse(s)) 
}

export default CustomError