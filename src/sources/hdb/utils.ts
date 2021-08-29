/**
 * Extract the address from the raw address,
 * Removes the substring ',Singapore'
 * Returns null if none found
 */
export function cleanupAddress(address: string): string {
  const removeText = ',Singapore';
  return address.split(removeText)[0] ?? address;
}

/**
 * Stops anything from being processed
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
