
self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {
      title: "💅 Ágatha Nail Estudio",
      body: event.data ? event.data.text() : "Tenés una nueva notificación."
    };
  }

  const title = data.title || "💅 Ágatha Nail Estudio";

  const options = {
    body: data.body || "Tenés una nueva notificación.",
    tag: data.tag || "agatha-notification",
    data: {
      url: data.url || data.data?.url || "./"
    },
    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data?.url || "./",
    self.location.origin
  ).href;

  event.waitUntil(
    self.clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then((clients) => {
      for (const client of clients) {
        if (client.url.startsWith(self.location.origin) && "focus" in client) {
          return client.focus().then(() => client.navigate(targetUrl));
        }
      }

      return self.clients.openWindow(targetUrl);
    })
  );
});
