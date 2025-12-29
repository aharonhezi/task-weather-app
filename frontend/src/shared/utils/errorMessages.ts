export const getErrorMessage = (error: any): string => {
  if (!error.response) {
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      return 'Unable to connect. Check your internet connection.';
    }
    if (error.code === 'ERR_INTERNET_DISCONNECTED') {
      return 'No internet connection. Please check your network.';
    }
    return 'Network error. Please check your connection and try again.';
  }

  if (error.response?.data?.errors && typeof error.response.data.errors === 'object') {
    const errors = error.response.data.errors;
    const firstError = Object.values(errors)[0];
    if (Array.isArray(firstError) && firstError.length > 0) {
      return firstError[0] as string;
    }
    return 'Please check the form for errors.';
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  const status = error.response?.status;
  if (status === 404) {
    return 'Resource not found.';
  }
  if (status === 403) {
    return 'You do not have permission to perform this action.';
  }
  if (status === 500) {
    return 'Server error. Please try again later.';
  }
  if (status === 503) {
    return 'Service temporarily unavailable. Please try again later.';
  }

  return 'Something went wrong. Please try again.';
};

export const getFieldErrors = (error: any): Record<string, string[]> => {
  if (error.response?.data?.errors && typeof error.response.data.errors === 'object') {
    return error.response.data.errors as Record<string, string[]>;
  }
  return {};
};

