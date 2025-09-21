// Simple data types for our mock data
export interface SimpleHotel {
  id: number;
  name: string;
  location: string;
  price: number;
  rating?: number;
  reviews?: number;
  amenities?: string[];
  availability?: number;
  activeViewers?: number;
  description?: string;
  image?: string;
}

export interface SimpleInsurance {
  id: number;
  name: string;
  provider: string;
  price: number;
}

export interface SimpleFlight {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departure: {
    time: string;
    date: string;
  };
  arrival: {
    time: string;
    date: string;
  };
  duration: string;
  price: number;
  currency: string;
  class: string;
  stops: number;
  availability: number;
  baggage: {
    carry: string;
    checked: string;
  };
}