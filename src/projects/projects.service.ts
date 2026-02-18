import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { ClientIndustry } from './entities/client-industry.entity';
import { ProjectCategory } from './entities/project-category.entity';
import { ProjectFile } from '../files/entities/project-file.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { CreateProjectResponseDto } from './dto/create-project-response.dto';
import { UsersService } from '../users/users.service';
import { VendorsService } from '../vendors/vendors.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(ClientIndustry)
    private clientIndustriesRepository: Repository<ClientIndustry>,
    @InjectRepository(ProjectCategory)
    private projectCategoriesRepository: Repository<ProjectCategory>,
    @InjectRepository(ProjectFile)
    private projectFilesRepository: Repository<ProjectFile>,
    private usersService: UsersService,
    private vendorsService: VendorsService,
  ) {}

  async create(createProjectDto: CreateProjectDto, auth0UserId: string): Promise<CreateProjectResponseDto> {
    // 1. Lookup user by Auth0 ID
    const user = await this.usersService.findByAuth0Id(auth0UserId);
    if (!user) {
      throw new NotFoundException(`User with Auth0 ID '${auth0UserId}' not found. Please sync user first.`);
    }

    // 2. Lookup client industry ID
    const clientIndustry = await this.clientIndustriesRepository.findOne({
      where: { value: createProjectDto.clientIndustry },
    });

    if (!clientIndustry) {
      throw new NotFoundException(`Client industry '${createProjectDto.clientIndustry}' not found`);
    }

    // 3. Lookup project category ID
    const projectCategory = await this.projectCategoriesRepository.findOne({
      where: { value: createProjectDto.projectCategory },
    });

    if (!projectCategory) {
      throw new NotFoundException(`Project category '${createProjectDto.projectCategory}' not found`);
    }

    // 4. Validate budget ranges
    if (createProjectDto.budgetType === 'range') {
      const minBudget = parseFloat(createProjectDto.minBudget.replace(/,/g, ''));
      const maxBudget = parseFloat(createProjectDto.maxBudget.replace(/,/g, ''));

      if (maxBudget < minBudget) {
        throw new BadRequestException('maxBudget must be greater than or equal to minBudget');
      }
    }

    // 5. Transform data for database
    const projectData: Partial<Project> = {
      user_id: user.id,
      project_title: createProjectDto.projectTitle,
      system_name: createProjectDto.systemName,
      client_industry_id: clientIndustry.id,
      project_category_id: projectCategory.id,
      project_category_custom: createProjectDto.projectCategory === 'other' ? createProjectDto.projectCategoryOther : null,
      project_objective: createProjectDto.projectObjective,
      business_requirements: createProjectDto.businessRequirements,
      technical_requirements: createProjectDto.technicalRequirements || null,
      start_date: createProjectDto.startDate,
      end_date: createProjectDto.endDate || null,
      flexible_dates: createProjectDto.flexibleDates || false,
      budget_type: createProjectDto.budgetType,
      budget_currency: 'USD',
      status: createProjectDto.status,
    };

    // 6. Set budget fields based on budget type
    if (createProjectDto.budgetType === 'single') {
      projectData.budget_amount = parseFloat(createProjectDto.totalBudget.replace(/,/g, ''));
      projectData.budget_min = null;
      projectData.budget_max = null;
    } else if (createProjectDto.budgetType === 'range') {
      projectData.budget_amount = null;
      projectData.budget_min = parseFloat(createProjectDto.minBudget.replace(/,/g, ''));
      projectData.budget_max = parseFloat(createProjectDto.maxBudget.replace(/,/g, ''));
    }

    // 7. Set submitted_at timestamp if status is submitted
    if (createProjectDto.status === 'submitted') {
      projectData.submitted_at = new Date();
    } else {
      projectData.submitted_at = null;
    }

    // 8. Create and save project
    const project = this.projectsRepository.create(projectData);
    const savedProject = await this.projectsRepository.save(project);

    // 9. Save file URLs to project_files table if provided
    if (createProjectDto.fileUrls && createProjectDto.fileUrls.length > 0) {
      const fileRecords = createProjectDto.fileUrls.map((fileUrl) => {
        // Extract filename from URL (last part after /)
        const urlParts = fileUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];

        return this.projectFilesRepository.create({
          project_id: savedProject.id,
          file_url: fileUrl,
          file_name: fileName,
          file_size: 0, // Size not available from URL
          mime_type: 'application/octet-stream', // Generic MIME type
        });
      });

      await this.projectFilesRepository.save(fileRecords);
      console.log(`✅ Saved ${fileRecords.length} file(s) for project ${savedProject.id}`);
    }

    // 10. Find matching vendors based on project criteria
    const matchedVendors = await this.vendorsService.findMatchingVendors(
      createProjectDto.projectCategory,
      createProjectDto.systemName,
      projectData.budget_min,
      projectData.budget_max,
      projectData.budget_amount,
      createProjectDto.startDate,
      createProjectDto.endDate,
    );

    // 11. Return project with matched vendors
    return {
      project: {
        id: savedProject.id,
        project_title: savedProject.project_title,
        system_name: savedProject.system_name,
        status: savedProject.status,
        created_at: savedProject.created_at,
      },
      matchedVendors,
    };
  }
}
