
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
    <View >
      {!readonly && (
        <View >
          <Input
            placeholder="Digite o endereço ou local"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            
          />
          <Button
            type="button"
            onPress={handleSearch}
            size="icon"
            variant="outline"
          >
            <Search  />
          </Button>
        </View>
      )}
      
      <Card >
        <CardContent >
          <View 
            
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          >
            <View >
              <MapPin  />
              <Text>{location || 'Selecione uma localização'}</Text>
              <Text>
                Lat: {mapCoords.lat.toFixed(4)}, Lng: {mapCoords.lng.toFixed(4)}
              </Text>
            </View>
          </View>
        </CardContent>
      </Card>
    </View>
  );
};

export default LocationMap;
