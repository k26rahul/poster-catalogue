async function request(method, path, payload) {
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
    throw new Error('Network request failed.');
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
}

export const http = {
  get: path => request('GET', path),
  post: (path, payload) => request('POST', path, payload),
  put: (path, payload) => request('PUT', path, payload),
  del: path => request('DELETE', path),
};
