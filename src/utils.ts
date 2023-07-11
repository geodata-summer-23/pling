export const maxChars = (text: string, n: number) => {
  return text.length > n + 2 ? text.slice(0, n) + '..' : text
}
