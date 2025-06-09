
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface LocationMapProps {
  location: string;
  onLocationChange?: (location: string) => void;
  readonly?: boolean;
}

const LocationMap: React.FC<LocationMapProps> = ({ 
  location, 
  onLocationChange, 
  readonly = false 
}) => {
  const [searchLocation, setSearchLocation] = useState(location);
  const [mapCoords, setMapCoords] = useState({ lat: -23.5505, lng: -46.6333 }); // São Paulo default

  useEffect(() => {
    if (location) {
      // Simular geocoding - em produção, usar Google Maps API
      setMapCoords({ lat: -23.5505 + Math.random() * 0.1, lng: -46.6333 + Math.random() * 0.1 });
    }
  }, [location]);

  const handleSearch = () => {
    if (onLocationChange) {
      onLocationChange(searchLocation);
    }
  };

  return (
    <div className="space-y-3">
      {!readonly && (
        <div className="flex gap-2">
          <Input
            placeholder="Digite o endereço ou local"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="bg-white"
          />
          <Button
            type="button"
            onClick={handleSearch}
            size="icon"
            variant="outline"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
      )}
      
      <Card className="bg-white">
        <CardContent className="p-0">
          <div 
            className="w-full h-48 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg relative flex items-center justify-center"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          >
            <div className="text-center">
              <MapPin className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">{location || 'Selecione uma localização'}</p>
              <p className="text-xs text-gray-500 mt-1">
                Lat: {mapCoords.lat.toFixed(4)}, Lng: {mapCoords.lng.toFixed(4)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationMap;
