


export class ValidationError extends Error{
    public success: boolean;

    constructor(message: string, success = false){
        super(message);
        this.success = success;
    }
    
}