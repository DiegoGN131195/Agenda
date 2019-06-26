import { ErrorModel } from "./error-model";

export class MessageResponse<T> {
    response: T;
    error: ErrorModel;
}
