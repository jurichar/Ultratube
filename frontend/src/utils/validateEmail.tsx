export function validateEmail(mail: string): boolean {
  const regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
  return regex.test(mail);
}
