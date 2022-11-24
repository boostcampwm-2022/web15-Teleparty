export class Chat {
  message: string;
  senderId: string;
  id: string;

  constructor(senderId: string, message: string) {
    this.message = message;
    this.senderId = senderId;
    this.id = senderId + Date.now();
  }
}
