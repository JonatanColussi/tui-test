export interface AddHotels {
  add(cityCodes: string[]): Promise<boolean>
}
