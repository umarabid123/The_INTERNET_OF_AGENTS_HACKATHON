
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star } from 'lucide-react';
import { SimpleHotel } from '@/types/data';
import ActiveNow from './ActiveNow';

interface HotelCardProps {
  hotel: SimpleHotel;
  onSelect: (hotel: SimpleHotel) => void;
  isSelected: boolean;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onSelect, isSelected }) => (
  <Card className={`transition-all duration-200 hover:shadow-lg ${isSelected ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border'}`}>
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        {hotel.name}
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm text-muted-foreground">{hotel.rating || 4.5}</span>
        </div>
      </CardTitle>
      <CardDescription className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <MapPin className="w-4 h-4" />
          <span>{hotel.location}</span>
        </div>
        {hotel.activeViewers && (
          <ActiveNow 
            hotelId={hotel.id} 
            initialViewers={hotel.activeViewers} 
            className="ml-2" 
          />
        )}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-primary">${hotel.price}</p>
          <p className="text-sm text-muted-foreground">per night</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-green-600 font-medium">Available</p>
          <p className="text-xs text-muted-foreground">Free cancellation</p>
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Button 
        onClick={() => onSelect(hotel)} 
        className="w-full" 
        variant={isSelected ? 'default' : 'outline'}
      >
        {isSelected ? 'Selected' : 'Select Hotel'}
      </Button>
    </CardFooter>
  </Card>
);

export default HotelCard;
