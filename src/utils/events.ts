export class MessagesEvent extends Event {
  public detail: { length: number }

  constructor(eventType: string, length: number) {
    super(eventType)
    this.detail = { length }
  }
}

export class LocalStorageSetEvent extends Event {
  public detail: { key: string, value: string }

  constructor(eventType: string, key: string, value: string) {
    super(eventType)
    this.detail = { key, value }
  }
}
