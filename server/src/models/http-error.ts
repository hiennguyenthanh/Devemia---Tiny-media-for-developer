export class HttpError extends Error {
  constructor(message: string, public errorCode: number) {
    super(message);
    this.errorCode = errorCode;
  }
}
