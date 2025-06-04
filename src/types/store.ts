interface DealerOperationHours {
  mondayOpenTime: string;
  mondayCloseTime: string;
  tuesdayOpenTime: string;
  tuesdayCloseTime: string;
  wednesdayOpenTime: string;
  wednesdayCloseTime: string;
  thursdayOpenTime: string;
  thursdayCloseTime: string;
  fridayOpenTime: string;
  fridayCloseTime: string;
  saturdayOpenTime: string;
  saturdayCloseTime: string;
  sundayOpenTime: string;
  sundayCloseTime: string;
}

interface DealerContent {
  section: string;
  content: string;
}

export interface Store {
  name: string;
  address: string;
  pincode: string;
  latitude: string;
  longitude: string;
  phoneNumber: string;
  area: string;
  dealerOperationHours: DealerOperationHours;
  storePageUrl: string;
  dealerContent: DealerContent[];
  dealerId: string;
  seoStoreServices: Record<string, unknown>;
  type: string;
  additionalPhones: string;
  gmbMapUrl: string;
  city: string;
  state: string;
  averageRating: number;
}

export interface CityStateMap {
  [state: string]: {
    [city: string]: Store[];
  };
}

export interface StoreData {
  cityStateMap: CityStateMap;
} 