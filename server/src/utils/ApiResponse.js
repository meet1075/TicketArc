class ApiResponse{
    constructor(message="success", data,statusCode){
        this.statusCode=statusCode
        this.data=data
        this.message=message
        this.success=statusCode<400
    }
}
export {ApiResponse}