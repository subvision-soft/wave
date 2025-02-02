export function getSize(string: string): number {
  const byteSize = new TextEncoder().encode(string).length;
  //1024 * 1024 = 1048576
  return byteSize / (1048576);
}
