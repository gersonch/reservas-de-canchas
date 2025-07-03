export interface IComplejo {
  _id: string;
  name: string;
  region?: string;
  country: string;
  city: string;
  address: string;
  image_url: string | null;
  stars: number | null;
  facilities?: {
    bar?: boolean;
    changingRooms?: boolean;
    parking?: boolean;
    restaurant?: boolean;
    showers?: boolean;
  };
  equipment?: {
    futbol?: boolean;
    tenis?: boolean;
    padel?: boolean;
  };
}
