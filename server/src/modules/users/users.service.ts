import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { daysUntil } from '../../common/utils/date.util';

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  create(data: any) { return this.repo.create(data); }
  findByEmail(email: string) { return this.repo.findByEmail(email); }
  updateProfile(id: string, dto: any) { return this.repo.update(id, dto); }

  async findOne(id: string) {
    const u = await this.repo.findById(id);
    if (!u) return null;
    const { passwordHash, ...rest } = u;
    return { ...rest, dDay: daysUntil(u.examDate) };
  }

  async changePassword(id: string, current: string, next: string) {
    const u = await this.repo.findById(id);
    if (!u) throw new NotFoundException('User not found');
    const ok = await bcrypt.compare(current, u.passwordHash);
    if (!ok) throw new NotFoundException('current password mismatch');
    const passwordHash = await bcrypt.hash(next, 10);
    await this.repo.update(id, { passwordHash });
    return { ok: true };
  }

  /**
   * Self-deletion of the user's own account.
   *
   * Implements DPDP §12 (right to erasure) and matches the Privacy Policy's
   * promise of permanent purge. Hard delete via UsersRepository.hardDelete —
   * Attempt / WrongNote / Mock / Mastery / DailyActivity / WeeklyReport /
   * tokens are wiped, cascade-marked tables (Consent, DeviceToken, Concept
   * progress, etc.) follow, AnalyticsEvent.userId is anonymised. AdminAccessLog
   * is intentionally retained for the legal audit window.
   *
   * The earlier soft-delete approach (deletedAt + email shadowing) preserved
   * analytics but violated the "purge within 30 days" commitment in
   * PRIVACY_POLICY.md §6 and the Play 2024 deletion policy.
   */
  async deleteSelf(id: string) {
    const result = await this.repo.hardDelete(id);
    if (!result) throw new NotFoundException('User not found');
    return { ok: true, deletedAt: result.deletedAt };
  }

  /**
   * GDPR Art. 20 / Play Data Safety — 사용자 자기데이터 export.
   * passwordHash 등 보안 필드는 제거하고 JSON 으로 반환.
   */
  async exportSelf(id: string) {
    const data = await this.repo.exportAll(id);
    if (!data) throw new NotFoundException('User not found');
    const { passwordHash, ...rest } = data;
    return {
      generatedAt: new Date().toISOString(),
      schemaVersion: '1.0',
      user: rest,
    };
  }
}
