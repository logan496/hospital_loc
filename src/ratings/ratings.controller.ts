import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Évaluations')
@Controller('ratings')
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une évaluation pour un service' })
  @ApiResponse({ status: 201, description: 'Évaluation créée avec succès' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 404, description: 'Service non trouvé' })
  @ApiResponse({ status: 409, description: 'Vous avez déjà noté ce service' })
  create(@Req() req, @Body() createRatingDto: CreateRatingDto) {
    return this.ratingsService.create(req.user.id, createRatingDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier sa propre évaluation' })
  @ApiParam({ name: 'id', description: "ID de l'évaluation" })
  @ApiResponse({ status: 200, description: 'Évaluation modifiée avec succès' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({
    status: 403,
    description: 'Vous ne pouvez modifier que vos propres évaluations',
  })
  @ApiResponse({ status: 404, description: 'Évaluation non trouvée' })
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateRatingDto: UpdateRatingDto,
  ) {
    return this.ratingsService.update(req.user.id, id, updateRatingDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer sa propre évaluation' })
  @ApiParam({ name: 'id', description: "ID de l'évaluation" })
  @ApiResponse({ status: 200, description: 'Évaluation supprimée avec succès' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({
    status: 403,
    description: 'Vous ne pouvez supprimer que vos propres évaluations',
  })
  @ApiResponse({ status: 404, description: 'Évaluation non trouvée' })
  delete(@Req() req, @Param('id') id: string) {
    return this.ratingsService.delete(req.user.id, id);
  }

  @Get('service/:serviceId')
  @ApiOperation({ summary: "Obtenir les évaluations d'un service" })
  @ApiParam({ name: 'serviceId', description: 'ID du service' })
  @ApiResponse({ status: 200, description: 'Liste des évaluations' })
  findByService(
    @Param('serviceId') serviceId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.ratingsService.findByService(serviceId, +page, +limit);
  }
}
