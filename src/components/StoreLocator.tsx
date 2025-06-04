'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Store, StoreData } from '../types/store';

const containerStyle = {
  width: '100%',
  height: '500px'
};

const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090
};

const libraries = ['places'];

interface StoreLocatorProps {
  initialData: StoreData;
}

function formatOperationHours(hours: Store['dealerOperationHours']): string {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const uniqueTimings = new Set();
  
  days.forEach(day => {
    const openTime = hours[`${day}OpenTime` as keyof typeof hours];
    const closeTime = hours[`${day}CloseTime` as keyof typeof hours];
    if (openTime && closeTime) {
      uniqueTimings.add(`${openTime}-${closeTime}`);
    }
  });

  if (uniqueTimings.size === 1) {
    const timing = Array.from(uniqueTimings)[0];
    return `Mon-Sat: ${timing}`;
  }

  return days
    .map(day => {
      const openTime = hours[`${day}OpenTime` as keyof typeof hours];
      const closeTime = hours[`${day}CloseTime` as keyof typeof hours];
      if (openTime && closeTime) {
        return `${day.charAt(0).toUpperCase() + day.slice(1)}: ${openTime}-${closeTime}`;
      }
      return null;
    })
    .filter(Boolean)
    .join(', ');
}

export default function StoreLocator({ initialData }: StoreLocatorProps) {
  const [selectedState, setSelectedState] = useState<string>('Delhi');
  const [selectedCity, setSelectedCity] = useState<string>('New Delhi');
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: libraries as any,
  });

  const cityStateMap = initialData.cityStateMap;

  const states = useMemo(() => {
    return Object.keys(cityStateMap).sort();
  }, [cityStateMap]);

  const cities = useMemo(() => {
    if (!selectedState) return [];
    return Object.keys(cityStateMap[selectedState] || {}).sort();
  }, [cityStateMap, selectedState]);

  const filteredStores = useMemo(() => {
    if (!selectedState) {
      return Object.values(cityStateMap)
        .flatMap(cities => Object.values(cities))
        .flat();
    }
    if (!selectedCity) {
      return Object.values(cityStateMap[selectedState])
        .flat();
    }
    return cityStateMap[selectedState][selectedCity];
  }, [cityStateMap, selectedState, selectedCity]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setSelectedState(newState);
    if (newState !== selectedState) {
      setSelectedCity('');
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
  };

  const fitBounds = useCallback(() => {
    if (mapRef.current && filteredStores.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      
      filteredStores.forEach((store) => {
        const lat = parseFloat(store.latitude);
        const lng = parseFloat(store.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          bounds.extend({ lat, lng });
        }
      });

      mapRef.current.fitBounds(bounds);

      const currentZoom = mapRef.current.getZoom();
      if (currentZoom !== undefined) {
        // If there's only one store, zoom in closer
        if (filteredStores.length === 1) {
          mapRef.current.setZoom(15);
        }
        // If we're showing all stores, don't zoom in too close
        else if (!selectedState && !selectedCity && currentZoom > 5) {
          mapRef.current.setZoom(5);
        }
        // If we're showing state stores, adjust zoom accordingly
        else if (selectedState && !selectedCity && currentZoom > 8) {
          mapRef.current.setZoom(8);
        }
      }
    }
  }, [filteredStores, selectedState, selectedCity]);

  // Effect to handle initial state and city selection
  useEffect(() => {
    if (selectedState && !selectedCity && cities.length > 0) {
      setSelectedCity(cities[0]);
    }
  }, [selectedState, selectedCity, cities]);

  // Effect to update map bounds when filters change
  useEffect(() => {
    if (mapRef.current) {
      fitBounds();
    }
  }, [selectedState, selectedCity, fitBounds]);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setMap(map);
    fitBounds();
  }, [fitBounds]);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
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
        center={defaultCenter}
        zoom={5}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: true,
          mapTypeControl: true,
        }}
      >
        {filteredStores.map((store) => (
          <Marker
            key={store.dealerId}
            position={{ 
              lat: parseFloat(store.latitude), 
              lng: parseFloat(store.longitude) 
            }}
            title={store.name}
            onClick={() => {
              if (mapRef.current) {
                mapRef.current.setZoom(16);
                mapRef.current.panTo({
                  lat: parseFloat(store.latitude),
                  lng: parseFloat(store.longitude)
                });
              }
            }}
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
              <option value="">All States</option>
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
              onChange={handleCityChange}
              className="w-full p-2 border rounded-md"
              disabled={!selectedState}
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="store-list">
          <h2 className="text-xl font-semibold mb-4">
            {selectedCity
              ? `Stores in ${selectedCity}, ${selectedState}`
              : selectedState
              ? `Stores in ${selectedState}`
              : 'All Stores'}
          </h2>
          <div className="space-y-4">
            {filteredStores.length > 0 ? (
              filteredStores.map((store) => (
                <div
                  key={store.dealerId}
                  className="p-4 border rounded-md hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{store.name}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {store.type}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{store.address}</p>
                  {store.area && (
                    <p className="text-gray-500 text-sm">{store.area}</p>
                  )}
                  <p className="text-gray-500 text-sm">
                    {store.city}, {store.state} - {store.pincode}
                  </p>
                  <div className="mt-2 space-y-1">
                    <p className="text-gray-500 text-sm">
                      <span className="font-medium">Hours:</span>{' '}
                      {formatOperationHours(store.dealerOperationHours)}
                    </p>
                    <p className="text-gray-500 text-sm">
                      <span className="font-medium">Phone:</span> {store.phoneNumber}
                      {store.additionalPhones && `, ${store.additionalPhones}`}
                    </p>
                    {store.averageRating > 0 && (
                      <p className="text-gray-500 text-sm">
                        <span className="font-medium">Rating:</span>{' '}
                        {store.averageRating.toFixed(1)} ★
                      </p>
                    )}
                  </div>
                  <div className="mt-2">
                    <a
                      href={store.storePageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      View Store Details →
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-4">
                No stores found
              </div>
            )}
          </div>
        </div>

        <div className="map-container h-[500px] bg-gray-50 rounded-lg">
          {renderMap()}
        </div>
      </div>
    </div>
  );
} 