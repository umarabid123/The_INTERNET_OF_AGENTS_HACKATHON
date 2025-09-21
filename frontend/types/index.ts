// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Voice Types
export interface VoiceRecording {
  id: string;
  audioBlob: Blob;
  audioUrl: string;
  duration: number;
  timestamp: Date;
  transcription?: string;
}

export interface TranscriptionResponse {
  text: string;
  confidence: number;
  language?: string;
}

export interface TextToSpeechRequest {
  text: string;
  voiceId?: string;
  speed?: number;
  pitch?: number;
}

// Booking Types
export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    city: string;
    country: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    city: string;
    country: string;
    time: string;
    date: string;
  };
  duration: string;
  price: number;
  currency: string;
  class: 'economy' | 'business' | 'first';
  stops: number;
  baggage: {
    carry: string;
    checked: string;
  };
  cancellationPolicy: string;
  availability: number;
}

export interface Hotel {
  id: string;
  name: string;
  rating: number;
  location: {
    address: string;
    city: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  price: number;
  currency: string;
  amenities: string[];
  images: string[];
  description: string;
  checkIn: string;
  checkOut: string;
  availability: boolean;
}

export interface Booking {
  id: string;
  type: 'flight' | 'hotel' | 'package';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    passport?: string;
  };
  flightDetails?: Flight;
  hotelDetails?: Hotel;
  totalAmount: number;
  currency: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

// Payment Types
export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'crypto' | 'bank_transfer';
  displayName: string;
  isDefault: boolean;
}

export interface CryptoPayment {
  currency: string;
  amount: number;
  walletAddress: string;
  transactionHash?: string;
  network: string;
}

export interface PaymentRequest {
  bookingId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  customerEmail: string;
  returnUrl?: string;
  webhookUrl?: string;
}

export interface PaymentResponse {
  orderId: string;
  paymentUrl: string;
  status: 'pending' | 'completed' | 'failed';
  expiresAt: Date;
}

// AI Recommendation Types
export interface TravelPreferences {
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
  dates?: {
    departure: string;
    return?: string;
    flexible: boolean;
  };
  destinations?: string[];
  travelers: {
    adults: number;
    children: number;
    infants: number;
  };
  interests: string[];
  accommodation: 'budget' | 'mid-range' | 'luxury';
  activities: string[];
}

export interface AIRecommendation {
  id: string;
  type: 'destination' | 'flight' | 'hotel' | 'activity';
  title: string;
  description: string;
  confidence: number;
  reasoning: string;
  data: Flight | Hotel | any;
  priority: number;
}

export interface RecommendationRequest {
  query: string;
  preferences: TravelPreferences;
  context?: string;
  sessionId?: string;
}

export interface RecommendationResponse {
  recommendations: AIRecommendation[];
  sessionId: string;
  context: string;
  nextSuggestions: string[];
}

// Agent Orchestration Types
export interface AgentSession {
  id: string;
  userId?: string;
  status: 'active' | 'completed' | 'error';
  messages: ChatMessage[];
  agents: {
    voice: boolean;
    booking: boolean;
    payment: boolean;
    recommendation: boolean;
  };
  context: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  type: 'text' | 'voice' | 'action';
  audioUrl?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface AgentOrchestrationRequest {
  userQuery: {
    text?: string;
    audioBuffer?: Blob;
  };
  sessionId: string;
  context?: Record<string, any>;
}

export interface AgentOrchestrationResponse {
  sessionId: string;
  speechText?: string;
  recommendations?: AIRecommendation[];
  bookingOptions?: (Flight | Hotel)[];
  audioResponse?: Blob;
  nextActions: string[];
  context: Record<string, any>;
}

// WebSocket Types
export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: Date;
  sessionId?: string;
}

export interface VoiceWebSocketMessage extends WebSocketMessage {
  type: 'voice_start' | 'voice_data' | 'voice_end' | 'transcription' | 'speech_generated';
  payload: {
    audioData?: ArrayBuffer;
    text?: string;
    audioUrl?: string;
  };
}

// UI Component Types
export interface ComponentProps {
  className?: string;
  children?: any;
}

export interface FormData {
  [key: string]: any;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Redux Store Types
export interface RootState {
  voice: VoiceState;
  booking: BookingState;
  payment: PaymentState;
  user: UserState;
  ui: UIState;
}

export interface VoiceState {
  isRecording: boolean;
  isPlaying: boolean;
  currentRecording?: VoiceRecording;
  transcriptions: TranscriptionResponse[];
  error?: string;
}

export interface BookingState {
  flights: Flight[];
  hotels: Hotel[];
  currentBooking?: Booking;
  searchFilters: TravelPreferences;
  loading: boolean;
  error?: string;
}

export interface PaymentState {
  methods: PaymentMethod[];
  currentPayment?: PaymentRequest;
  status: 'idle' | 'processing' | 'success' | 'error';
  error?: string;
}

export interface UserState {
  isAuthenticated: boolean;
  profile?: {
    id: string;
    name: string;
    email: string;
    preferences: TravelPreferences;
  };
  sessionId?: string;
}

export interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  modals: {
    [key: string]: boolean;
  };
  toasts: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchFilters {
  query?: string;
  filters: Record<string, any>;
  pagination: PaginationParams;
}

export type ResponseStatus = 'success' | 'error' | 'loading';

export interface AsyncState<T> {
  data?: T;
  loading: boolean;
  error?: string;
  lastUpdated?: Date;
}