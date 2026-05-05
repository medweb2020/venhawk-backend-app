import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { SystemResolverService } from './services/system-resolver.service';
import { ResolveSystemDto } from './dto/resolve-system.dto';
import { ResolveSystemResponseDto, SystemListItemDto, SystemSearchResultDto } from './dto/system-response.dto';

/**
 * Public endpoints — no auth required.
 * The SmartSystemPicker needs /search pre-login on the intake form.
 * LLM cap (100/day) protects /resolve from abuse.
 */
@Controller('api/systems')
export class SystemsController {
  constructor(private readonly resolver: SystemResolverService) {}

  /**
   * GET /api/systems
   * List all active canonical systems (for bulk picker / admin).
   */
  @Get()
  listSystems(): SystemListItemDto[] {
    return this.resolver.listAll().map((s) => ({
      id: s.id,
      canonicalName: s.canonical_name,
      productFamily: s.product_family,
      vendorOwner: s.vendor_owner,
      category: s.category,
      aliases: s.aliases,
      isActive: true,
    }));
  }

  /**
   * GET /api/systems/search?q=<query>
   * Fuzzy autocomplete — Tiers 1–3 only (no LLM). Max 5 results.
   * Safe for high-frequency autocomplete calls.
   */
  @Get('search')
  searchSystems(@Query('q') q: string): SystemSearchResultDto[] {
    if (!q || q.trim().length < 1) {
      return [];
    }
    return this.resolver.searchSystems(q);
  }

  /**
   * POST /api/systems/resolve
   * Full 5-tier resolution including Tier-4 LLM if needed.
   * Returns single resolved system or candidate list (ambiguous/unresolved).
   */
  @Post('resolve')
  async resolveSystem(
    @Body() dto: ResolveSystemDto,
  ): Promise<ResolveSystemResponseDto> {
    if (!dto?.input?.trim()) {
      throw new BadRequestException('input must be a non-empty string');
    }
    return this.resolver.resolve(dto.input);
  }
}
