export class MessagesEvent extends Event {
  public detail: { length: number }

  constructor(eventType: string, length: number) {
    super(eventType)
    this.detail = { length }
  }
}
