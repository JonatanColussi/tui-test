import { ObjectId } from 'mongodb'

export interface AddressModel {
  lines?: string[]
  postalCode?: string
  cityName?: string
  countryCode?: string
}

export interface ContactModel {
  phone?: string
  fax?: string
  email?: string
}

export interface DescriptionModel {
  lang?: string
  text?: string
}

export interface MediaModel {
  uri?: string
  category?: string
}

export interface OffersModel {
  id?: string
  checkInDate?: Date
  checkOutDate?: Date
  boardType?: string
  typeEstimated?: string
  roomDescription?: string
  price?: Number
  currency?: string
}

export interface HotelModel {
  id?: ObjectId
  type?: string
  hotelId?: string
  chainCode?: string
  dupeId?: string
  name?: string
  rating?: string
  cityCode?: string
  latitude?: Number
  longitude?: Number
  address?: AddressModel
  contact?: ContactModel
  description?: DescriptionModel
  amenities?: string[]
  media?: MediaModel[]
  available?: boolean
  offers?: OffersModel[]
}
