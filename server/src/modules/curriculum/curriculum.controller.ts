import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentLang, Lang } from '../../common/i18n/current-lang.decorator';

@UseGuards(JwtAuthGuard)
@Controller('curriculum')
export class CurriculumController {
  constructor(private readonly service: CurriculumService) {}

  @Get()
  tree(@CurrentLang() lang: Lang, @Query('grade') grade?: string) {
    return this.service.tree(lang, grade);
  }

  /** 가입한 학년에 맞는 단원만 — UnitPicker 용 */
  @Get('units')
  units(
    @CurrentUser('id') userId: string,
    @CurrentLang() lang: Lang,
    @Query('grade') grade?: string,
  ) {
    return this.service.unitsForUser(userId, lang, grade);
  }

  /** Curriculum metadata catalog (H8/Option C — multi-country index).
   *
   *  `?country=KR` → 한국 사용가능 과정 (중1~고3 × 과목) Curriculum row 리스트
   *  `?country=IN` → 인도 Class 7~12 NCERT 과정 리스트
   *  country 미지정 → isActive=true 모든 row
   *
   *  Frontend 사용 예 (Phase 후속): 새 가입자 onboarding 에서 country 선택 후
   *  이 endpoint 로 그 국가 사용가능 과정 목록을 받아 picker 노출. 또는
   *  Learn/Home 화면에서 현재 사용자가 속한 과정 라벨을 가져옴 (chapter
   *  카드 위 "고2 대수" 같은 표시).
   */
  @Get('catalog')
  catalog(@Query('country') country?: string) {
    return this.service.catalog(country);
  }
}
