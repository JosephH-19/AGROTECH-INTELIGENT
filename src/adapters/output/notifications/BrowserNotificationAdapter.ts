export class BrowserNotificationAdapter {
  async notify(message: string): Promise<void> {
    // Placeholder: esta clase se encargará de las notificaciones del adaptador.
    if ('Notification' in window) {
      new Notification('AgroTech', { body: message });
    }
  }
}
