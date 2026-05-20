import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class MockExamsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // The Study tab's "chapter test" feature reuses MockExamResult under
  // MockExam.type === 'MINI'. It's a learning tool, not a mock score — keep
  // it out of trajectory / recent / summary aggregates so the score graph,
  // best/avg/improvement metrics, and dashboard's expectedGrade reflect only
  // real exams (REAL / RECOMMENDED / WRONG_REDO / DIAGNOSTIC).
  private readonly EXCLUDE_FROM_MOCK_STATS = { type: { not: 'MINI' as const } };

  findTrajectory(userId: string, count: number) {
    return this.prisma.mockExamResult.findMany({
      where: { userId, mockExam: this.EXCLUDE_FROM_MOCK_STATS },
      orderBy: { takenAt: 'asc' },
      take: count,
      include: { mockExam: true },
    });
  }

  findRecent(userId: string, count: number) {
    return this.prisma.mockExamResult.findMany({
      where: { userId, mockExam: this.EXCLUDE_FROM_MOCK_STATS },
      orderBy: { takenAt: 'desc' },
      take: count,
      include: { mockExam: true },
    });
  }

  saveResult(id: string, data: any) {
    return this.prisma.mockExamResult.update({ where: { id }, data });
  }

  /**
   * 응시 시작: MockExam(메타) + MockExamResult(빈 결과) 동시 생성.
   * 각 응시는 새 record (재현 가능성·통계 무결성 위해).
   */
  async createSession(userId: string, params: { name: string; type: any; totalProblems: number; totalMinutes: number }) {
    const exam = await this.prisma.mockExam.create({
      data: {
        name: params.name, type: params.type,
        totalProblems: params.totalProblems, totalMinutes: params.totalMinutes,
      },
    });
    const result = await this.prisma.mockExamResult.create({
      data: {
        userId, mockExamId: exam.id,
        score: 0, grade: 9, percentile: 0, durationMin: 0,
      },
    });
    return { exam, result };
  }
}
