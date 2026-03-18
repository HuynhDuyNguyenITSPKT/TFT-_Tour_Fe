export function getErrorMessage(error, fallback = 'Có lỗi xảy ra, vui lòng thử lại.') {
  const responseData = error?.response?.data;

  if (typeof responseData === 'string' && responseData.trim()) {
    return responseData;
  }

  if (responseData?.message) {
    return responseData.message;
  }

  if (error?.message) {
    return error.message;
  }

  return fallback;
}
