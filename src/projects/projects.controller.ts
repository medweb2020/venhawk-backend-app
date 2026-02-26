import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
  ParseIntPipe,
  Get,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectRecommendationsResponseDto } from './dto/project-recommendations-response.dto';
import { VendorListingFiltersDto } from '../vendors/dto/vendor-listing-filters.dto';

@Controller('api/projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    // Extract Auth0 user ID from JWT token
    const auth0UserId = req.user.userId; // This comes from the JWT token
    return this.projectsService.create(createProjectDto, auth0UserId);
  }

  @Post(':projectId/recommendations')
  async generateRecommendations(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Request() req,
  ): Promise<ProjectRecommendationsResponseDto> {
    const auth0UserId = req.user.userId;
    return this.projectsService.generateRecommendations(projectId, auth0UserId);
  }

  @Get(':projectId/recommendations')
  async getRecommendations(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Query() filters: VendorListingFiltersDto,
    @Request() req,
  ): Promise<ProjectRecommendationsResponseDto> {
    const auth0UserId = req.user.userId;
    return this.projectsService.getRecommendations(
      projectId,
      auth0UserId,
      filters,
    );
  }
}
