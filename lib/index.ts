import { handleResponseError } from './handlingErrors';
import { AppError } from './appError';


const trimText = (text:string) => {
    return text.replace(/\s+/g, ' ');
}

const asycnWrapper = (promise: Promise<void>) => promise.then((data: any) => [undefined, data]).catch((err) => [err]);


export { asycnWrapper, AppError, handleResponseError, trimText };
