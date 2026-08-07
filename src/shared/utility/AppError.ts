class AppError extends Error {
  public readonly message: string
  public readonly statusCode: number
  public readonly code?: string

  constructor(message: string, statusCode?: number, code?: string) {
    super()
    this.message = message
    this.statusCode = statusCode ?? 400
    this.code = code
  }
}

export default AppError
