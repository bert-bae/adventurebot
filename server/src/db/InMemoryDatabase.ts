export class InMemoryDatabase {
  private db: Record<string, unknown>;
  constructor() {
    this.db = {};
  }

  public add(key, value) {
    this.db[key] = value;
  }

  public update(key, value) {
    this.db[key] = value;
  }

  public get(key) {
    return this.db[key];
  }
}
