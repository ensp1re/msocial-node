export function generateSessionSecret() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
  const length = 32; // Длина секрета (можно изменить по вашему усмотрению)
  let secret = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    secret += characters[randomIndex];
  }

  return secret;
}