import { globalStore } from '@/stores/globalStore';

async function request(method, path, payload) {
  globalStore.startLoading();
  try {
    const options = {
      method,
      headers: {},
      credentials: 'include',
    };

    if (payload !== undefined) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(payload);
    }

    let res;
    try {
      res = await fetch(path, options);
    } catch (e) {
      // Network completely unavailable
      throw new Error('⚠️ Network unavailable. Please check your internet connection.');
    }

    // Handle service worker offline response (503)
    if (res.status === 503) {
      let errorData;
      try {
        errorData = await res.json();
      } catch {
        errorData = { message: 'Service unavailable' };
      }
      if (errorData.error === 'offline') {
        throw new Error(
          '⚠️ Network unavailable. Resource not found in cache. Please connect to the internet to load this content.',
        );
      }
      throw new Error(errorData.message || 'Service unavailable');
    }

    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error('Invalid server response (expected JSON).');
    }

    if (!res.ok) {
      const message = data?.message || `${res.status} ${res.statusText}`;
      throw new Error(message);
    }

    return data;
  } catch (e) {
    globalStore.setError(e);
    throw e;
  } finally {
    globalStore.stopLoading();
  }
}

export const http = {
  get: path => request('GET', path),
  post: (path, payload) => request('POST', path, payload),
  put: (path, payload) => request('PUT', path, payload),
  del: path => request('DELETE', path),
};
