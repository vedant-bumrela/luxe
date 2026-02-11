class ApiResponse {
    constructor(statusCode, data, message = 'Success', meta = null) {
        this.success = statusCode < 400;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;

        if (meta) {
            this.meta = meta;
        }
    }

    static success(data, message = 'Operation successful', statusCode = 200, meta = null) {
        return new ApiResponse(statusCode, data, message, meta);
    }

    static created(data, message = 'Resource created successfully') {
        return new ApiResponse(201, data, message);
    }

    static error(message, statusCode = 500) {
        return {
            success: false,
            statusCode,
            message,
            error: {
                message,
                statusCode
            }
        };
    }
}

module.exports = ApiResponse;
