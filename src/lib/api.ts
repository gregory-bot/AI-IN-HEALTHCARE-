import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const analyzeSymptoms = async (symptoms: any) => {
  try {
    const response = await api.post('/analyze', symptoms);
    return response.data;
  } catch (error) {
    throw new Error('Failed to analyze symptoms');
  }
};

export const processPayment = async (paymentDetails: any) => {
  try {
    const response = await api.post('/payment', paymentDetails);
    return response.data;
  } catch (error) {
    throw new Error('Payment processing failed');
  }
};