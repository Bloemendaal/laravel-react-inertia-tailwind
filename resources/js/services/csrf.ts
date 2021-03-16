const csrf = (): string => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

export default csrf();
