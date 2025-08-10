import { v4 } from 'uuid';

/**
 * Generates a payment redirect URL for external sites to use
 * @param {string} username - The username of the profile to receive payment
 * @param {string} amount - The amount to be paid
 * @param {string} callbackUrl - The URL to redirect to after payment
 * @param {Object} options - Additional options
 * @returns {Object} - The payment redirect information
 */
export async function generatePaymentRedirect(username, amount, callbackUrl, options = {}) {
  try {
    const response = await fetch('/api/payment-redirect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        amount,
        callbackUrl,
        ...options,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate payment redirect');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating payment redirect:', error);
    throw error;
  }
}

/**
 * Updates the status of a payment redirect
 * @param {string} paymentId - The ID of the payment
 * @param {string} status - The new status of the payment
 * @param {string} transactionId - The transaction ID (if available)
 * @returns {Object} - The updated payment information
 */
export async function updatePaymentRedirectStatus(paymentId, status, transactionId = null) {
  try {
    const response = await fetch('/api/payment-redirect', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentId,
        status,
        transactionId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update payment status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
}

/**
 * Generates HTML code for embedding a payment button on external sites
 * @param {string} username - The username of the profile to receive payment
 * @param {string} amount - The amount to be paid
 * @param {string} callbackUrl - The URL to redirect to after payment
 * @param {Object} options - Additional options for button styling
 * @returns {string} - HTML code for the payment button
 */
export function generatePaymentButtonCode(username, amount, callbackUrl, options = {}) {
  const {
    buttonText = 'Pay with ScratchCard',
    buttonColor = '#7A78FF',
    textColor = '#FFFFFF',
    borderRadius = '8px',
    padding = '12px 24px',
    fontSize = '16px',
  } = options;

  // Base URL - should be replaced with actual deployment URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  // Create a unique ID for this button
  const buttonId = `scratch-pay-${v4().substring(0, 8)}`;
  
  return `
<!-- ScratchCard Payment Button -->
<button 
  id="${buttonId}" 
  style="background-color: ${buttonColor}; color: ${textColor}; border: none; border-radius: ${borderRadius}; padding: ${padding}; font-size: ${fontSize}; cursor: pointer; font-family: system-ui, -apple-system, sans-serif;"
  onclick="window.open('${baseUrl}/api/redirect?username=${encodeURIComponent(username)}&amount=${encodeURIComponent(amount)}&callback=${encodeURIComponent(callbackUrl)}', '_blank')"
>
  ${buttonText}
</button>
`;
}