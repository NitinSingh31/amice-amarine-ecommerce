export function cn(...inputs: any[]): string {
  return inputs
    .flat(Infinity)
    .filter((x) => typeof x === 'string' && x.trim().length > 0)
    .join(' ');
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
