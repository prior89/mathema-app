import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CountryCode, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { GuardianConsentService } from '../guardian-consent/guardian-consent.service';
import { daysUntil } from '../../common/utils/date.util';
import { BCRYPT_COST } from '../../common/utils/auth-constants';
import { assertPasswordNotBreached } from '../../common/utils/password-breach';

@Injectable()
export class UsersService {
  constructor(
    private readonly repo: UsersRepository,
    private readonly guardianConsent: GuardianConsentService,
  ) {}

  create(data: any) { return this.repo.create(data); }
  findByEmail(email: string) { return this.repo.findByEmail(email); }

  async updateProfile(id: string, dto: {
    name?: string;
    gradeLevel?: string;
    studyGoal?: string;
    role?: string;
    pushRemindersEnabled?: boolean;
    birthDate?: string;
    country?: string;
  }) {
    const user = await this.repo.findById(id);
    if (!user) throw new NotFoundException('User not found');

    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.gradeLevel !== undefined) data.gradeLevel = dto.gradeLevel;
    if (dto.studyGoal !== undefined) data.studyGoal = dto.studyGoal;
    if (dto.pushRemindersEnabled !== undefined) {
      data.pushRemindersEnabled = dto.pushRemindersEnabled;
    }

    if (dto.birthDate !== undefined) {
      // DOB is locked only after verifiable guardian consent is recorded —
      // the consent is anchored to that exact birth date. Before VERIFIED,
      // allow corrections so a mis-tapped age picker is not a permanent
      // dead-end. The change re-runs ensurePendingForStudent below to
      // re-evaluate the gate against the new age.
      if (user.birthDate && user.guardianConsentVerifiedAt) {
        throw new ForbiddenException({
          code: 'birth_date_immutable',
          message: 'Date of birth cannot be changed after guardian consent is verified.',
        });
      }
      data.birthDate = new Date(dto.birthDate);
    }

    if (dto.role !== undefined) {
      this.assertRolePatchAllowed(user.role, dto.role as UserRole);
      data.role = dto.role;
    }

    const countryChanging = dto.country !== undefined && dto.country !== user.country;
    if (countryChanging) {
      data.country = dto.country;
    }

    if (Object.keys(data).length === 0) return this.findOne(id);
    await this.repo.update(id, data);
    const effectiveCountry = (dto.country ?? user.country) as CountryCode;
    if (user.role === UserRole.STUDENT && (dto.birthDate || countryChanging)) {
      await this.guardianConsent.ensurePendingForStudent({
        studentUserId: id,
        country: effectiveCountry,
      });
    }
    return this.findOne(id);
  }

  /** v1.1: only STUDENT self-assignment; PARENT/TEACHER require invite flow (PR-27). */
  private assertRolePatchAllowed(currentRole: UserRole, requested: UserRole) {
    if (requested === 'PARENT' || requested === 'TEACHER') {
      throw new ForbiddenException({
        code: 'role_elevation_blocked',
        message: 'Parent and teacher accounts require an invite flow. Student role only for now.',
      });
    }
    if (requested === 'ADMIN') {
      throw new ForbiddenException({
        code: 'role_elevation_blocked',
        message: 'Admin role cannot be self-assigned.',
      });
    }
    // Only STUDENT remains as a patchable role; non-student accounts cannot change role.
    if (currentRole !== 'STUDENT') {
      throw new ForbiddenException({
        code: 'role_change_blocked',
        message: 'Role changes are restricted for this account.',
      });
    }
  }

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
    await assertPasswordNotBreached(next);
    const passwordHash = await bcrypt.hash(next, BCRYPT_COST);
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
