import { Request, Response, NextFunction } from 'express'

const trimObject = (obj: any): any => {
  const res = {}

  Object.keys(obj).forEach(
    (k) => (res[k] = typeof obj[k] === 'string' ? obj[k].trim() : obj[k])
  )

  return res
}

export const trimParams = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  req.body = trimObject(req.body)
  req.headers = trimObject(req.headers)
  req.params = trimObject(req.params)
  req.query = trimObject(req.query)
  next()
}
