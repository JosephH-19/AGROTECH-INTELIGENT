export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => {
        console.log('Service Worker registrado correctamente.');
      })
      .catch((error) => {
        console.warn('Error al registrar Service Worker:', error);
      });
  }
};
