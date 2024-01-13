// Establish a cache name
const CACHE_NAME = 'api';

const cachedUrls = [
  "https://catfact.ninja/fact"
]

/**
 * Check if cached API data is still valid
 * @param  {Object}  response The response object
 * @return {Boolean}          If true, cached data is valid
 */
var isValid = function (response) {
  if (!response) return false;
  var fetched = response.headers.get('sw-fetched-on');
  if (fetched && (parseFloat(fetched) + (1000 * 60 * 60 * 2)) > new Date().getTime()) return true;
  return false;
};


function cloneResponse(response, extraHeaders) {
  if (!response) {
    return Promise.resolve()
  }

  var init = {
    status: response.status,
    statusText: response.statusText,
    headers: extraHeaders || {},
  }

  response.headers.forEach(function (val, key) {
    init.headers[key] = val
  })

  return response.blob().then(function (blob) {
    return new Response(blob, init)
  })
}

self.addEventListener('message', async (event) => {
  if (event.data && event.data.type === 'INVALIDATE_CACHE_ENTRY') {
    const cache = await caches.open(CACHE_NAME)
    cache.keys().then((keys) => {
      keys.forEach((request, index, array) => {
        if (request.url === event.data.req.url && request.method === event.data.req.method) {
          cache.delete(request);
          self.clients.matchAll({
            includeUncontrolled: true,
            type: 'window',
          }).then((clients) => {
            if (clients && clients.length) {
              // Send a response - the clients
              // array is ordered by last focused
              clients[0].postMessage({
                type: 'CACHE_ENTRY_INVALIDATED',
                req: event.data.req,
              });
            }
          });
        }
      });
    });
  }
});

self.addEventListener('fetch', async (event) => {
  if (event.type === 'fetch' && cachedUrls.includes(event.request.url)) {
    if (event.request.cache === 'default') {
      event.respondWith(caches.open(CACHE_NAME).then(async cache => {
        try {
          const cachedResponse = await cache.match(event.request.url)

          // If there's a cached API and it's still valid, use it
          // if (isValid(cachedResponse)) {
          if (cachedResponse) {
            return cachedResponse;
          }
          const fetchedResponse = await fetch(event.request)

          //  Add the network response to the cache for later visits
          // var copy = fetchedResponse.clone();
          // var headers = new Headers(copy.headers);
          // headers.append('sw-fetched-on', new Date().getTime());
          // const body = await copy.blob()
          // cache.put(event.request, new Response(body, {
          //     status: copy.status,
          //     statusText: copy.statusText,
          //     headers: headers
          //   }));
          cache.put(event.request, fetchedResponse.clone())

          return fetchedResponse
        } catch (err) {
          // Otherwise, make a fresh API call
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || caches.match('/offline.json');
          });
        }
      }))
    } else {
      event.respondWith(caches.open(CACHE_NAME).then((cache) => {
        // Go to the network first
        return fetch(event.request.url).then((fetchedResponse) => {
          cloneResponse(fetchedResponse, {'sw-fetched-on': new Date().getTime()}).then(clonedResponse => {
            cache.put(event.request, cloneResponse);
          })

          return fetchedResponse;
        }).catch(() => {
          // If the network is unavailable, get
          return cache.match(event.request.url);
        });
      }));

    }
  }
});

