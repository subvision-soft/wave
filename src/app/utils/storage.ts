export function getSize(string: string): number {
  const byteSize = new TextEncoder().encode(string).length;
  return byteSize / (1024 * 1024);

}
