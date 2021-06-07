export default async function createRequest(options) {
  const baseUrl = 'https://ahj-helpdesk-backend.herokuapp.com/';
  const requestUrl = baseUrl + options.url;
  const response = await fetch(requestUrl, {
    method: options.method || 'GET',
    body: options.body,
  });

  return response.json();
}
