export interface AmadeusAuthData {
  clientId: string
  secret: string
}

export interface AmadeusAuthResponse {
  type: string
  username: string
  application_name: string
  client_id: string
  token_type: string
  access_token: string
  expires_in: Number
  state: string
  scope: string
}

export interface AmadeusAuthRepository {
  auth(): Promise<void>
}
