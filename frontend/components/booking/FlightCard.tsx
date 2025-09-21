'use client';

import React from 'react';
import { Plane, Clock, MapPin, Luggage, CreditCard, Star, Wifi, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Flight } from '@/types';
import { cn } from '@/lib/utils';

interface FlightCardProps {
  flight: Flight;
  isSelected?: boolean;
  onSelect?: (flight: Flight) => void;
  onBook?: (flight: Flight) => void;
  className?: string;
  showFullDetails?: boolean;
}

export const FlightCard: React.FC<FlightCardProps> = ({
  flight,
  isSelected = false,
  onSelect,
  onBook,
  className,
  showFullDetails = false,
}) => {
  const handleSelect = () => {
    onSelect?.(flight);
  };

  const handleBook = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBook?.(flight);
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
    });
  };

  const getClassIcon = (flightClass: string) => {
    switch (flightClass) {
      case 'first':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'business':
        return <Utensils className="h-4 w-4 text-blue-500" />;
      default:
        return <Plane className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStopsText = (stops: number) => {
    if (stops === 0) return 'Direct';
    if (stops === 1) return '1 stop';
    return `${stops} stops`;
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected && "ring-2 ring-primary ring-offset-2",
        className
      )}
      onClick={handleSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Plane className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">{flight.airline}</h3>
                <p className="text-sm text-muted-foreground">{flight.flightNumber}</p>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {flight.currency} {flight.price.toLocaleString()}
            </div>
            <div className="flex items-center space-x-1 mt-1">
              {getClassIcon(flight.class)}
              <span className="text-sm text-muted-foreground capitalize">
                {flight.class}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Flight Route */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{formatTime(flight.departure.time)}</div>
                <div className="text-sm text-muted-foreground">{flight.departure.airport}</div>
                <div className="text-xs text-muted-foreground">{formatDate(flight.departure.date)}</div>
              </div>
              
              <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1 h-px bg-border"></div>
                  <div className="text-xs text-muted-foreground px-2">
                    {flight.duration}
                  </div>
                  <div className="flex-1 h-px bg-border"></div>
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold">{formatTime(flight.arrival.time)}</div>
                <div className="text-sm text-muted-foreground">{flight.arrival.airport}</div>
                <div className="text-xs text-muted-foreground">{formatDate(flight.arrival.date)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Flight Details */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{getStopsText(flight.stops)}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Luggage className="h-4 w-4 text-muted-foreground" />
              <span>{flight.baggage.carry}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{flight.duration}</span>
            </div>
          </div>
          
          <Badge variant={flight.availability > 5 ? "default" : "destructive"}>
            {flight.availability} seats left
          </Badge>
        </div>

        {/* Additional Details (if shown) */}
        {showFullDetails && (
          <>
            <Separator />
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-2">Route Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">From:</span>
                    <div>{flight.departure.city}, {flight.departure.country}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">To:</span>
                    <div>{flight.arrival.city}, {flight.arrival.country}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Baggage Allowance</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Carry-on:</span>
                    <div>{flight.baggage.carry}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Checked:</span>
                    <div>{flight.baggage.checked}</div>
                  </div>
                </div>
              </div>

              {flight.cancellationPolicy && (
                <div>
                  <h4 className="font-medium mb-1">Cancellation Policy</h4>
                  <p className="text-sm text-muted-foreground">{flight.cancellationPolicy}</p>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="pt-3">
        <div className="flex w-full space-x-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleSelect}
          >
            {isSelected ? 'Selected' : 'Select Flight'}
          </Button>
          
          <Button 
            className="flex-1"
            onClick={handleBook}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Book Now
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default FlightCard;