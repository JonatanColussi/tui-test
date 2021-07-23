export interface AmadeusHotelModel {
  type?: string
  hotel?: Hotel
  available?: boolean
  offers?: Offer[]
  self?: string
}

export interface Offer {
  id?: string
  checkInDate?: string
  checkOutDate?: string
  rateCode?: string
  rateFamilyEstimated?: RateFamilyEstimated
  commission?: Commission
  boardType?: string
  room?: Room
  guests?: Guests
  price?: Price
  policies?: Policies
  self?: string
}

interface Policies {
  guarantee?: Guarantee
  paymentType?: string
  cancellation?: Cancellation
  deposit?: any
  holdTime?: any
}

interface Cancellation {
  numberOfNights?: number
  deadline?: string
  description?: any
  amount?: string
}

interface Guarantee {
  acceptedPayments?: AcceptedPayments
}

interface AcceptedPayments {
  creditCards?: string[]
  methods?: string[]
}

interface Price {
  currency?: string
  total?: string
  base?: string
  taxes?: Tax[]
  variations?: Variations
}

interface Variations {
  average?: Average
  changes?: Change[]
}

interface Change {
  startDate?: string
  endDate?: string
  total?: string
  base?: string
}

interface Average {
  total?: string
  base?: string
}

interface Tax {
  code?: string
  percentage?: string
  included?: boolean
}

interface Guests {
  adults?: number
}

interface Room {
  type?: string
  typeEstimated?: TypeEstimated
  description?: Description
}

interface TypeEstimated {
  category?: string
  bedType?: string
  beds?: any
}

interface Commission {
  percentage?: string
}

interface RateFamilyEstimated {
  code?: string
  type?: string
}

interface Hotel {
  type?: string
  hotelId?: string
  chainCode?: string
  dupeId?: string
  name?: string
  rating?: string
  cityCode?: string
  latitude?: number
  longitude?: number
  hotelDistance?: HotelDistance
  address?: Address
  contact?: Contact
  description?: Description
  amenities?: string[]
  media?: Media[]
}

interface Media {
  uri?: string
  category?: string
}

interface Description {
  lang?: string
  text?: string
}

interface Contact {
  phone?: string
  fax?: string
  email?: string
}

interface Address {
  lines?: string[]
  postalCode?: string
  cityName?: string
  countryCode?: string
}

interface HotelDistance {
  distance?: number
  distanceUnit?: string
}

export interface AmadeusHotelOffersResponse {
  data?: AmadeusHotelModel[]
}

export interface AmadeusHotelOffersRepository {
  get(cityCodes: string[]): Promise<AmadeusHotelOffersResponse[]>
}
