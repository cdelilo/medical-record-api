export interface ILoginDTOOutput {
  user: {
    name: string
    email: string
  }
  token: string
  refreshToken: string
}
