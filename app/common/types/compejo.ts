export interface IComplejo {
  id: string;
  name: string;
  region?: string;
  country: string;
  city: string;
  address: string;
  image_url: string | null;
  stars: number;
}
