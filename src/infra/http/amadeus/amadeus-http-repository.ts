import querystring from 'querystring'
import amadeusHelper from './helpers/amadeus-helper'
import {
  AmadeusAuthRepository,
  AmadeusAuthData,
  AmadeusAuthResponse
} from '../../../data/protocols/http/amadeus/auth-repository'
import {
  AmadeusHotelOffersRepository,
  AmadeusHotelOffersResponse
} from '../../../data/protocols/http/amadeus/hotel-offers-repository'

export class AmadeusHttpRepository
implements AmadeusHotelOffersRepository, AmadeusAuthRepository {
  constructor (private readonly amadeusCredentials: AmadeusAuthData) {}

  amadeusAuth: AmadeusAuthResponse;

  async auth (): Promise<void> {
    const api = amadeusHelper('v1')

    const data: AmadeusAuthResponse = await api.post(
      '/security/oauth2/token',
      querystring.stringify({
        grant_type: 'client_credentials',
        client_id: this.amadeusCredentials.clientId,
        client_secret: this.amadeusCredentials.secret
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    this.amadeusAuth = data
  }

  async get (cityCodes: string[]): Promise<AmadeusHotelOffersResponse[]> {
    await this.auth()

    const api = amadeusHelper('v2')

    const result: AmadeusHotelOffersResponse[] = await Promise.all(
      cityCodes.map((cityCode) =>
        api.get('/shopping/hotel-offers', {
          params: { cityCode },
          headers: { Authorization: `Bearer ${this.amadeusAuth.access_token}` }
        })
      )
    )

    return result
  }
}
