class ApiResponse {

    constructor(statusCode, data, message ="sucess"){

        this.statusCode = statusCode
        this.message = message
        this.data = data
        this.data.success = statusCode<400
    }
}