export class IDFactory {
  private static counter: number = 0;

  public static create(): number {
    return IDFactory.counter++;
  }
}
