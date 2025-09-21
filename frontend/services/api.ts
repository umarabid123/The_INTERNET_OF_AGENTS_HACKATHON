import { 
  ApiResponse, 
  TranscriptionResponse, 
  TextToSpeechRequest,
  RecommendationRequest,
  RecommendationResponse,
  AgentOrchestrationRequest,
  AgentOrchestrationResponse,
  PaymentRequest,
  PaymentResponse,
  Flight,
  Hotel,
  Booking
} from '@/types';

// API Configuration
const API_BASE_URL = typeof window !== 'undefined' 
  ? (window as any).location?.origin?.includes('localhost') 
    ? 'http://localhost:5000' 
    : 'https://your-backend-url.com'
  : 'http://localhost:5000';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      headers: { ...defaultHeaders, ...options.headers },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else if (contentType?.includes('audio/')) {
        data = await response.blob();
      } else {
        data = await response.text();
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.baseURL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    
    return this.request<T>(url.pathname + url.search);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
      headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  async upload<T>(endpoint: string, file: File | Blob, fieldName = 'file'): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append(fieldName, file);

    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
    });
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Voice Service
export class VoiceService {
  static async speechToText(audioBlob: Blob): Promise<TranscriptionResponse> {
    const response = await apiClient.upload<TranscriptionResponse>(
      '/api/voice/speech-to-text',
      audioBlob,
      'audio'
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Speech-to-text failed');
    }
    
    return response.data;
  }

  static async textToSpeech(request: TextToSpeechRequest): Promise<Blob> {
    const response = await apiClient.post<Blob>('/api/voice/text-to-speech', request);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Text-to-speech failed');
    }
    
    return response.data;
  }

  static async generateSpeech(text: string, voiceId?: string): Promise<Blob> {
    return this.textToSpeech({ text, voiceId });
  }

  static async chat(message: string, conversationHistory?: Array<{role: string, content: string}>): Promise<{response: string, model?: string, usage?: any}> {
    const response = await apiClient.post<{response: string, model?: string, usage?: any}>(
      '/api/voice/chat',
      { 
        message,
        conversationHistory: conversationHistory || []
      }
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Chat failed');
    }
    
    return response.data;
  }
}

// Recommendation Service
export class RecommendationService {
  static async getRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
    const response = await apiClient.post<RecommendationResponse>(
      '/api/recommendations',
      request
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get recommendations');
    }
    
    return response.data;
  }

  static async searchFlights(query: string, preferences: any): Promise<Flight[]> {
    const response = await apiClient.post<Flight[]>('/api/booking/flights/search', {
      query,
      preferences,
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Flight search failed');
    }
    
    return response.data;
  }

  static async searchHotels(query: string, preferences: any): Promise<Hotel[]> {
    const response = await apiClient.post<Hotel[]>('/api/booking/hotels/search', {
      query,
      preferences,
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Hotel search failed');
    }
    
    return response.data;
  }
}

// Booking Service
export class BookingService {
  static async createBooking(bookingData: Partial<Booking>): Promise<Booking> {
    const response = await apiClient.post<Booking>('/api/booking/create', bookingData);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Booking creation failed');
    }
    
    return response.data;
  }

  static async getBooking(bookingId: string): Promise<Booking> {
    const response = await apiClient.get<Booking>(`/api/booking/${bookingId}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get booking');
    }
    
    return response.data;
  }

  static async updateBooking(bookingId: string, updates: Partial<Booking>): Promise<Booking> {
    const response = await apiClient.put<Booking>(`/api/booking/${bookingId}`, updates);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Booking update failed');
    }
    
    return response.data;
  }

  static async cancelBooking(bookingId: string): Promise<void> {
    const response = await apiClient.delete(`/api/booking/${bookingId}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Booking cancellation failed');
    }
  }

  static async getBookingHistory(userId?: string): Promise<Booking[]> {
    const params: Record<string, string> = {};
    if (userId) {
      params.userId = userId;
    }
    
    const response = await apiClient.get<Booking[]>('/api/booking/history', params);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get booking history');
    }
    
    return response.data;
  }
}

// Payment Service
export class PaymentService {
  static async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    const response = await apiClient.post<PaymentResponse>('/api/payment/create', request);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Payment creation failed');
    }
    
    return response.data;
  }

  static async verifyPayment(orderId: string): Promise<any> {
    const response = await apiClient.get(`/api/payment/verify/${orderId}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Payment verification failed');
    }
    
    return response.data as any;
  }

  static async getPaymentMethods(): Promise<any[]> {
    const response = await apiClient.get('/api/payment/methods');
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get payment methods');
    }
    
    return response.data as any[];
  }

  static async processRefund(orderId: string, amount?: number): Promise<void> {
    const response = await apiClient.post(`/api/payment/refund/${orderId}`, { amount });
    
    if (!response.success) {
      throw new Error(response.error || 'Refund processing failed');
    }
  }
}

// Coral Protocol / Agent Orchestration Service
export class CoralService {
  static async orchestrateAgents(request: AgentOrchestrationRequest): Promise<AgentOrchestrationResponse> {
    const response = await apiClient.post<AgentOrchestrationResponse>(
      '/api/coral/orchestrate',
      request
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Agent orchestration failed');
    }
    
    return response.data;
  }

  static async getSession(sessionId: string): Promise<any> {
    const response = await apiClient.get(`/api/coral/session/${sessionId}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get session data');
    }
    
    return response.data;
  }

  static async updateSession(sessionId: string, data: any): Promise<void> {
    const response = await apiClient.put(`/api/coral/session/${sessionId}`, data);
    
    if (!response.success) {
      throw new Error(response.error || 'Session update failed');
    }
  }
}

// Health Check Service
export class HealthService {
  static async checkHealth(): Promise<any> {
    const response = await apiClient.get('/health');
    
    if (!response.success || !response.data) {
      throw new Error('Health check failed');
    }
    
    return response.data as any;
  }

  static async checkServiceStatus(): Promise<any> {
    const response = await apiClient.get('/api/status');
    
    if (!response.success || !response.data) {
      throw new Error('Service status check failed');
    }
    
    return response.data as any;
  }
}

// Export all services
export const services = {
  voice: VoiceService,
  recommendation: RecommendationService,
  booking: BookingService,
  payment: PaymentService,
  coral: CoralService,
  health: HealthService,
};

export default services;