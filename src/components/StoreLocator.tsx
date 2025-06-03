import { useState, useMemo, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { storeData } from '../data/stores';
import { Store } from '../types/store';

const containerStyle = {
  width: '100%',
  height: '500px'
};

const defaultCenter = {
  lat: 28.6329,
  lng: 77.2195
};

const libraries = ['places'];

export default function StoreLocator() {
  const [selectedState, setSelectedState] = useState<string>('Delhi');
  const [selectedCity, setSelectedCity] = useState<string>('New Delhi');
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: libraries as any,
  });

  const states = useMemo(() => Object.keys(storeData), []);
  const cities = useMemo(() => 
    selectedState ? Object.keys(storeData[selectedState]) : [],
    [selectedState]
  );
  const stores = useMemo(() => 
    selectedState && selectedCity ? storeData[selectedState][selectedCity] : [],
    [selectedState, selectedCity]
  );

  const center = useMemo(() => 
    stores.length > 0 
      ? { lat: stores[0].lat, lng: stores[0].lng }
      : defaultCenter,
    [stores]
  );

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setSelectedState(newState);
    setSelectedCity(Object.keys(storeData[newState])[0]);
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const renderMap = () => {
    if (loadError) {
      return (
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading Google Maps
              </h3>
              <div className="mt-2 text-sm text-red-700">
                Please check your internet connection and try again.
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (!isLoaded) {
      return (
        <div className="flex items-center justify-center h-[500px] bg-gray-50 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    return (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: true,
          mapTypeControl: true,
        }}
      >
        {stores.map((store: Store) => (
          <Marker
            key={store.id}
            position={{ lat: store.lat, lng: store.lng }}
            title={store.name}
          />
        ))}
      </GoogleMap>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Store Locator</h1>
        <div className="flex gap-4 mb-4">
          <div className="w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <select
              value={selectedState}
              onChange={handleStateChange}
              className="w-full p-2 border rounded-md"
            >
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="store-list">
          <h2 className="text-xl font-semibold mb-4">Stores in {selectedCity}</h2>
          <div className="space-y-4">
            {stores.map((store: Store) => (
              <div
                key={store.id}
                className="p-4 border rounded-md hover:bg-gray-50"
              >
                <h3 className="font-medium">{store.name}</h3>
                <p className="text-gray-600">{store.address}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="map-container h-[500px] bg-gray-50 rounded-lg">
          {renderMap()}
        </div>
      </div>
    </div>
  );
} 