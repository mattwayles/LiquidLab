import * as errorType from "./errorTypes";

export const errorMessage = (errorMessage) => {
    console.log(errorMessage);
    switch (errorMessage) {
        case errorType.INVALID_EMAIL:
            return "Invalid E-Mail address entered. The e-mail address must be in the format xxxx@yyy.zzz";
        case errorType.MISSING_PASSWORD:
            return "Please provide a password containing at least six characters.";
        case errorType.WEAK_PASSWORD:
            return "The provided password was too weak. Password must be at least 6 characters";
        case errorType.EMAIL_NOT_FOUND:
            return "The provided e-mail address was not found in our records.";
        case errorType.INVALID_PASSWORD:
            return "The provided e-mail address was found in our records, but the password is incorrect.";
        case errorType.EMAIL_EXISTS:
            return "A user record already exists for the provided e-mail address.";
        case errorType.BAD_REQUEST:
            return "The server received a bad request. Please contact your system administrator.";
        default:
            return errorMessage;
    }
};


export default errorMessage;
    