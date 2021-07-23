interface CustomErrorArgs {
  error: string
  message: string
}
export class CustomError {
  error: string;
  message: string;
  constructor (args: CustomErrorArgs) {
    this.error = args.error
    this.message = args.message
  }
}

type Result<T> = T | CustomError;
export type Type<T> = Result<T>;

export function isError<T> (result: Result<T>): result is CustomError {
  return result instanceof CustomError
}

export function isSuccess<T> (result: Result<T>): result is T {
  return !isError(result)
}
