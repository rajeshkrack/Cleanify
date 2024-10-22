export const errorHandler = (statuscode, messaage)=> {
    const error = new Error();
    error.statuscode = statuscode;
    error.message = messaage;
    return error;
}