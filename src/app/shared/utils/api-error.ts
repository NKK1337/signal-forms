// Turns the API's 400 error body into one readable message.
// Body shape: { title, detail, errors: { fieldName: ['message', ...] } }
export function apiErrorMessage(err: unknown, fallback: string): string {
  const body = (err as { error?: any })?.error;

  if (body?.errors && typeof body.errors === 'object') {
    const first = (Object.values(body.errors) as string[][]).flat()[0];
    if (first) return String(first);
  }

  return body?.detail ?? body?.title ?? fallback;
}
