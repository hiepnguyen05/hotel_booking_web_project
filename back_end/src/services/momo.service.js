const axios = require('axios');
const crypto = require('crypto');

class MoMoService {
  constructor() {
    // MoMo Sandbox/Test environment configuration
    this.partnerCode = process.env.MOMO_PARTNER_CODE || 'MOMO';
    this.accessKey = process.env.MOMO_ACCESS_KEY || 'F8BBA842ECF85';
    this.secretKey = process.env.MOMO_SECRET_KEY || 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    this.endpoint = process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create';
    
    console.log('[MOMO SERVICE] Initialized with:');
    console.log('[MOMO SERVICE] Partner Code:', this.partnerCode);
    console.log('[MOMO SERVICE] Access Key:', this.accessKey);
    console.log('[MOMO SERVICE] Secret Key:', this.secretKey);
    console.log('[MOMO SERVICE] Endpoint:', this.endpoint);
  }

  /**
   * Generate MoMo payment URL
   * @param {Object} orderInfo - Order information
   * @param {string} orderId - Unique order ID
   * @param {number} amount - Payment amount
   * @param {string} returnUrl - URL to redirect after payment (using ngrok)
   * @param {string} notifyUrl - URL for server notification (using ngrok)
   * @returns {Promise<Object>} Payment response with QR code and payment URL
   */
  async createPayment(orderInfo, orderId, amount, returnUrl, notifyUrl) {
    try {
      console.log('[MOMO SERVICE] Creating payment with:');
      console.log('[MOMO SERVICE] Order Info:', orderInfo);
      console.log('[MOMO SERVICE] Order ID:', orderId);
      console.log('[MOMO SERVICE] Amount:', amount);
      console.log('[MOMO SERVICE] Return URL (redirectUrl):', returnUrl);
      console.log('[MOMO SERVICE] Notify URL (ipnUrl):', notifyUrl);
      
      const requestId = orderId;
      const extraData = ''; // Pass more data if needed
      const requestType = "captureWallet";
      const lang = "vi";
      const autoCapture = true;
      const orderGroupId = '';

      // Create raw signature - ORDER IS IMPORTANT!
      const rawSignature = "accessKey=" + this.accessKey + 
                          "&amount=" + amount + 
                          "&extraData=" + extraData + 
                          "&ipnUrl=" + notifyUrl + 
                          "&orderId=" + orderId + 
                          "&orderInfo=" + orderInfo + 
                          "&partnerCode=" + this.partnerCode + 
                          "&redirectUrl=" + returnUrl + 
                          "&requestId=" + requestId + 
                          "&requestType=" + requestType;

      console.log('[MOMO SERVICE] Raw signature string:', rawSignature);
      
      // Create signature using HMAC-SHA256
      const signature = crypto
        .createHmac('sha256', this.secretKey)
        .update(rawSignature)
        .digest('hex');

      console.log('[MOMO SERVICE] Generated signature:', signature);

      // Request body - using ngrok URLs for both redirectUrl and ipnUrl
      const requestBody = {
        partnerCode: this.partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: returnUrl,  // This is where MoMo redirects user after payment (using ngrok)
        ipnUrl: notifyUrl,       // This is where MoMo sends payment result (using ngrok)
        lang: lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData: extraData,
        orderGroupId: orderGroupId,
        signature: signature
      };

      console.log('[MOMO SERVICE] Request body:', JSON.stringify(requestBody, null, 2));

      // Send request to MoMo
      console.log('[MOMO SERVICE] Sending request to MoMo endpoint:', this.endpoint);
      const response = await axios.post(this.endpoint, requestBody);
      console.log('[MOMO SERVICE] Response received from MoMo');

      console.log('[MOMO SERVICE] Response status:', response.status);
      console.log('[MOMO SERVICE] Response data:', JSON.stringify(response.data, null, 2));

      // Check if response has error
      if (response.data.resultCode !== 0) {
        console.error('[MOMO SERVICE] MoMo API error:', response.data.message);
        return {
          success: false,
          error: response.data.message || 'MoMo API error'
        };
      }

      return {
        success: true,
        data: {
          orderId: orderId,
          requestId: requestId,
          payUrl: response.data.payUrl,
          qrCodeUrl: response.data.qrCodeUrl,
          deeplink: response.data.deeplink,
          transId: response.data.transId // Add transaction ID
        }
      };
    } catch (error) {
      console.error('[MOMO SERVICE] MoMo payment creation error:', error);
      if (error.response) {
        console.error('[MOMO SERVICE] Response data:', error.response.data);
        console.error('[MOMO SERVICE] Response status:', error.response.status);
        console.error('[MOMO SERVICE] Response headers:', error.response.headers);
        return {
          success: false,
          error: error.response.data.message || error.message
        };
      }
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verify MoMo payment callback
   * @param {Object} callbackData - Data received from MoMo callback
   * @returns {Object} { isValid: boolean, data: {...} } 
   */
  verifyCallback(callbackData) {
    try {
      console.log('[MOMO SERVICE] Verifying callback data:', JSON.stringify(callbackData, null, 2));

      // Pull fields from callback (some fields might be missing in some environments)
      const partnerCode = callbackData.partnerCode || callbackData.partner || this.partnerCode || '';
      const accessKey = callbackData.accessKey || this.accessKey || '';
      const requestId = callbackData.requestId || '';
      const amount = callbackData.amount != null ? String(callbackData.amount) : '';
      const orderId = callbackData.orderId || '';
      const orderInfo = callbackData.orderInfo || '';
      const orderType = callbackData.orderType || '';
      const transId = callbackData.transId != null ? String(callbackData.transId) : '';
      const resultCode = callbackData.resultCode != null ? String(callbackData.resultCode) : '';
      const message = callbackData.message || '';
      const payType = callbackData.payType || '';
      const responseTime = callbackData.responseTime != null ? String(callbackData.responseTime) : '';
      const extraData = callbackData.extraData || '';
      const signature = callbackData.signature || '';

      // Build raw signature string — **ORDER AND FIELD NAMES MUST MATCH MoMo SPEC**
      // According to MoMo documentation, the order should be:
      // accessKey, amount, extraData, message, orderId, orderInfo, orderType, partnerCode, payType, requestId, responseTime, resultCode, transId
      const rawSignature = 
        "accessKey=" + accessKey +
        "&amount=" + amount +
        "&extraData=" + extraData +
        "&message=" + message +
        "&orderId=" + orderId +
        "&orderInfo=" + orderInfo +
        "&orderType=" + orderType +
        "&partnerCode=" + partnerCode +
        "&payType=" + payType +
        "&requestId=" + requestId +
        "&responseTime=" + responseTime +
        "&resultCode=" + resultCode +
        "&transId=" + transId;

      console.log('[MOMO SERVICE] Generated raw signature string:', rawSignature);

      // Create signature using HMAC-SHA256 with secretKey
      const generatedSignature = crypto
        .createHmac('sha256', this.secretKey)
        .update(rawSignature)
        .digest('hex');

      console.log('[MOMO SERVICE] Secret key (first 6 chars):', (this.secretKey || '').slice(0,6) + '***');
      console.log('[MOMO SERVICE] Generated signature:', generatedSignature);
      console.log('[MOMO SERVICE] Received signature:', signature);
      console.log('[MOMO SERVICE] Signatures match:', generatedSignature === signature);

      const isValid = generatedSignature === signature;

      return {
        isValid,
        data: {
          orderId,
          requestId,
          amount,
          resultCode: Number(resultCode),
          transId,
          message
        }
      };
    } catch (error) {
      console.error('MoMo callback verification error:', error);
      return {
        isValid: false,
        error: error.message
      };
    }
  }
}

module.exports = new MoMoService();