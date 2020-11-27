self.addEventListener('install', (event) => {
  console.log('%c%s', 'color: lime', 'SERVICE_WORKER installed!', event);

  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('%c%s', 'color: lime', 'SERVICE_WORKER activated!', event);
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', async (event) => {
  console.log('%c%s', 'color: lime', `SERVICE_WORKER got a message from ${event.source.url} [${event.source.id}]!`, event);

  // const senderId = event.source.id;
  // const allClients = await self.clients.matchAll();
  // const client = allClients.find(({ id }) => id === senderId);

  // client.postMessage({
  //   clientId: senderId,
  //   recievedMessage: event.data,
  //   message: 'Hi there!',
  // });

  const parsedData = JSON.parse(event.data);

  if (parsedData.type === 'subscribe') {
    const options = {
      userVisibleOnly: true,
      applicationServerKey: parsedData.data.applicationServerKey,
    };

    let subscription;

    try {
      subscription = await self.registration.pushManager.subscribe(options);

      console.log(subscription);
      console.log(JSON.stringify(subscription));
    } catch (e) {
      console.error(e);

      return;
    }

    console.log(subscription);

    const response = await fetch('http://localhost:8888/api/push-subscriptions', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(subscription),
    });

    const data = await response.json();
    console.log(data);

    const senderId = event.source.id;
    const allClients = await self.clients.matchAll();
    const client = allClients.find(({ id }) => id === senderId);

    client.postMessage({
      type: 'subscribe',
      success: true,
      subscriptionId: data.public_id,
    });
  }
});
