
//  * Vérifie si le mot de passe respecte les critères de sécurité :
//  * - Au moins une majuscule
//  * - Au moins une minuscule
//  * - Au moins un chiffre
//  * - Au moins un caractère spécial
//  * - Au moins 6 caractères
 
export function validatePassword(password: string): boolean {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/.test(password);
}
