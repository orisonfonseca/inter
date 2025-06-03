export interface Store {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  state: string;
  city: string;
}

export interface StoreData {
  [state: string]: {
    [city: string]: Store[];
  };
} 