import axios from 'axios';
import { API_KEY } from '@env';

export const genIt = async (
  dest: string, days: string, budget: string, pref: string
): Promise<string> => {
  const prompt = `Plan a ${days}-day trip to ${dest} with a budget of ₹${budget} (INR). Preferences: ${pref}. Include hotels, travel, and day-wise activities. Return the result in a nicely formatted itinerary.`;

  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAbNwAeRBcaq235KHFTHhipiBSKei2zRTM',
      {
        contents: [
          {
            role: 'user', parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          key: API_KEY,
        },
      }
    );

    const output = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!output) {
      throw new Error('No response text received from Gemini API');
    }

    return output;
  } catch (error: any) {
    console.error('Gemini AI API Error:', error?.response?.data || error.message);
    throw new Error('Failed to generate itinerary. Try again.');
  }
};