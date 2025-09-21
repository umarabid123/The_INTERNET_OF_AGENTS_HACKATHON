// Simple API Service Layer for Travel Booking Application
const API_BASE_URL = typeof window !== 'undefined' && (window as any).env?.NEXT_PUBLIC_API_URL 
  ? (window as any).env.NEXT_PUBLIC_API_URL 
  : 'http://localhost:3001/api';

// Simple API response type
export interface SimpleAPIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Base API function
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<SimpleAPIResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Voice API functions
export const voiceAPI = {
  async speechToText(audioBlob: Blob) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');

    return apiRequest('/voice/speech-to-text', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set multipart headers
    });
  },

  async textToSpeech(text: string, voiceId = 'default') {
    return apiRequest('/voice/text-to-speech', {
      method: 'POST',
      body: JSON.stringify({ text, voiceId }),
    });
  },

  async processCommand(command: string) {
    return apiRequest('/voice/process-command', {
      method: 'POST',
      body: JSON.stringify({ command }),
    });
  },
};

// Booking API functions
export const bookingAPI = {
  async searchFlights(searchParams: any) {
    const queryParams = new URLSearchParams(searchParams).toString();
    return apiRequest(`/booking/flights/search?${queryParams}`);
  },

  async searchHotels(searchParams: any) {
    const queryParams = new URLSearchParams(searchParams).toString();
    return apiRequest(`/booking/hotels/search?${queryParams}`);
  },

  async createBooking(bookingData: any) {
    return apiRequest('/booking/create', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  async getBooking(bookingId: string) {
    return apiRequest(`/booking/${bookingId}`);
  },
};

// Payment API functions
export const paymentAPI = {
  async createPayment(paymentRequest: any) {
    return apiRequest('/payment/create', {
      method: 'POST',
      body: JSON.stringify(paymentRequest),
    });
  },

  async verifyPayment(orderId: string) {
    return apiRequest(`/payment/verify/${orderId}`);
  },
};

// AI API functions
export const aiAPI = {
  async getRecommendations(query: any) {
    return apiRequest('/ai/recommendations', {
      method: 'POST',
      body: JSON.stringify(query),
    });
  },

  async chatWithAI(message: string, context?: any) {
    return apiRequest('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
  },
};

export default {
  voice: voiceAPI,
  booking: bookingAPI,
  payment: paymentAPI,
  ai: aiAPI,
};