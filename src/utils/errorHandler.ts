import { AxiosError } from 'axios';
import Toast from 'react-native-toast-message';
import { Strings } from '../constants';

export type AppError = {
  message: string;
  statusCode?: number;
  type: 'network' | 'timeout' | 'unauthorized' | 'forbidden' | 'validation' | 'server' | 'unknown';
};

export const parseError = (error: unknown): AppError => {
  if (error instanceof AxiosError) {
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return { message: Strings.timeoutError, type: 'timeout' };
      }
      return { message: Strings.networkError, type: 'network' };
    }

    const { status, data } = error.response;
    const message: string = data?.message ?? Strings.serverError;

    switch (status) {
      case 401:
        return { message: Strings.unauthorizedError, statusCode: 401, type: 'unauthorized' };
      case 403:
        return { message: Strings.forbiddenError, statusCode: 403, type: 'forbidden' };
      case 422:
      case 400:
        return { message, statusCode: status, type: 'validation' };
      case 500:
      case 502:
      case 503:
        return { message: Strings.serverError, statusCode: status, type: 'server' };
      default:
        return { message, statusCode: status, type: 'unknown' };
    }
  }

  if (error instanceof Error) {
    return { message: error.message, type: 'unknown' };
  }

  return { message: Strings.unknownError, type: 'unknown' };
};

export const showErrorToast = (error: unknown): void => {
  const appError = parseError(error);
  Toast.show({
    type: 'error',
    text1: 'Error',
    text2: appError.message,
    visibilityTime: 3000,
    position: 'top',
  });
};

export const showSuccessToast = (message: string): void => {
  Toast.show({
    type: 'success',
    text1: 'Success',
    text2: message,
    visibilityTime: 3000,
    position: 'top',
  });
};

export const showInfoToast = (message: string): void => {
  Toast.show({
    type: 'info',
    text1: 'Info',
    text2: message,
    visibilityTime: 3000,
    position: 'top',
  });
};
