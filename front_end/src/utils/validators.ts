// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (Vietnamese format)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+84|84|0)?[3|5|7|8|9][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Password validation
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Mật khẩu phải có ít nhất 8 ký tự');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Mật khẩu phải có ít nhất 1 chữ hoa');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Mật khẩu phải có ít nhất 1 chữ thường');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Mật khẩu phải có ít nhất 1 số');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Mật khẩu phải có ít nhất 1 ký tự đặc biệt');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Date validation
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

export const isDateInFuture = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
};

export const isDateInPast = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date < today;
};

export const isValidDateRange = (startDate: string, endDate: string): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start < end;
};

// File validation
export const validateFile = (
  file: File,
  maxSize: number = 5 * 1024 * 1024, // 5MB
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp']
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (file.size > maxSize) {
    errors.push(`File quá lớn. Kích thước tối đa: ${maxSize / (1024 * 1024)}MB`);
  }
  
  if (!allowedTypes.includes(file.type)) {
    errors.push(`Định dạng file không được hỗ trợ. Chỉ chấp nhận: ${allowedTypes.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Credit card validation
export const validateCreditCard = (cardNumber: string): {
  isValid: boolean;
  cardType: string | null;
} => {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  // Luhn algorithm
  const luhnCheck = (num: string): boolean => {
    let sum = 0;
    let isEven = false;
    
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num.charAt(i));
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  };
  
  // Card type detection
  const getCardType = (num: string): string | null => {
    if (/^4/.test(num)) return 'Visa';
    if (/^5[1-5]/.test(num)) return 'MasterCard';
    if (/^3[47]/.test(num)) return 'American Express';
    if (/^6(?:011|5)/.test(num)) return 'Discover';
    return null;
  };
  
  return {
    isValid: luhnCheck(cleaned),
    cardType: getCardType(cleaned)
  };
};

// URL validation
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Vietnamese ID card validation
export const isValidIDCard = (id: string): boolean => {
  // Old format: 9 digits or 12 digits
  // New format: 12 digits
  const idRegex = /^[0-9]{9}$|^[0-9]{12}$/;
  return idRegex.test(id);
};

// Price validation
export const isValidPrice = (price: number): boolean => {
  return price > 0 && price <= 999999999; // Max 999 million VND
};

// Capacity validation
export const isValidCapacity = (capacity: string): boolean => {
  const capacityRegex = /^[1-9][0-9]*\s*(khách|người|guest|person)s?$/i;
  return capacityRegex.test(capacity.trim());
};

// Room size validation
export const isValidRoomSize = (size: string): boolean => {
  const sizeRegex = /^[1-9][0-9]*(\.[0-9]+)?\s*m²?$/i;
  return sizeRegex.test(size.trim());
};

// Booking validation
export const validateBookingDates = (
  checkIn: string,
  checkOut: string,
  minDays: number = 1,
  maxDays: number = 30
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (!isValidDate(checkIn)) {
    errors.push('Ngày check-in không hợp lệ');
  }
  
  if (!isValidDate(checkOut)) {
    errors.push('Ngày check-out không hợp lệ');
  }
  
  if (errors.length > 0) {
    return { isValid: false, errors };
  }
  
  if (!isDateInFuture(checkIn)) {
    errors.push('Ngày check-in phải là ngày trong tương lai');
  }
  
  if (!isValidDateRange(checkIn, checkOut)) {
    errors.push('Ngày check-out phải sau ngày check-in');
  }
  
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffInDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays < minDays) {
    errors.push(`Số ngày ở tối thiểu là ${minDays} ngày`);
  }
  
  if (diffInDays > maxDays) {
    errors.push(`Số ngày ở tối đa là ${maxDays} ngày`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};





