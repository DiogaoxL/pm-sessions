import { AdminRepository } from '../repositories/admin.repository';

export class AuthService {
  private adminRepo = new AdminRepository();

  /**
   * Validates if a user with the given email is an admin and links their auth_user_id.
   * If auth_user_id is already linked, verifies that it matches the current authUserId.
   * If there is a mismatch, prints a security warning to console.error.
   */
  async validateAndRegisterAdmin(email: string, authUserId: string): Promise<boolean> {
    const timestamp = new Date().toISOString();
    const admin = await this.adminRepo.findByEmail(email);
    if (!admin) {
      console.info(
        `[AUTH] Unauthorized login attempt\n` +
          `email: ${email}\n` +
          `authUserId: ${authUserId}\n` +
          `timestamp: ${timestamp}`,
      );
      return false;
    }

    // If it's the first login, the auth_user_id won't be set yet
    if (!admin.auth_user_id) {
      await this.adminRepo.linkAuthUser(email, authUserId);
    } else if (admin.auth_user_id !== authUserId) {
      console.warn(
        `[SECURITY] Admin account already linked to another auth user\n` +
          `email: ${email}\n` +
          `storedAuthUserId: ${admin.auth_user_id}\n` +
          `currentAuthUserId: ${authUserId}\n` +
          `timestamp: ${timestamp}`,
      );
      return false;
    }

    console.info(
      `[AUTH] Authorized login\n` +
        `email: ${email}\n` +
        `authUserId: ${authUserId}\n` +
        `timestamp: ${timestamp}`,
    );
    return true;
  }
}
