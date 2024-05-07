export function validatePassword(psswd: string) {
  if (psswd.length < 8) {
    return false;
  }
  if (/[A-Z]/.test(psswd) && /[0-9]/.test(psswd) && /[!@#$%^&*(),.?":{}|<>]/.test(psswd)) {
    return true;
  }
  return false;
}
