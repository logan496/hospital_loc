import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { HospitalsService } from './hospitals.service';
import { SearchHospitalsDto } from './dto/search-hospitals.dto';

@ApiTags('Hôpitaux')
@Controller('hospitals')
export class HospitalsController {
  constructor(private hospitalsService: HospitalsService) {}

  @Get()
  @ApiOperation({ summary: 'Rechercher des hôpitaux à proximité' })
  @ApiResponse({ status: 200, description: 'Liste des hôpitaux trouvés' })
  search(@Query() searchDto: SearchHospitalsDto) {
    return this.hospitalsService.searchNearby(searchDto);
  }

  @Get(':id')
  @ApiOperation({ summary: "Obtenir les détails d'un hôpital" })
  @ApiParam({ name: 'id', description: "ID de l'hôpital" })
  @ApiResponse({ status: 200, description: "Détails de l'hôpital" })
  @ApiResponse({ status: 404, description: 'Hôpital non trouvé' })
  findOne(@Param('id') id: string) {
    return this.hospitalsService.findOne(id);
  }

  @Get(':id/services')
  @ApiOperation({ summary: "Obtenir les services d'un hôpital" })
  @ApiParam({ name: 'id', description: "ID de l'hôpital" })
  @ApiResponse({ status: 200, description: 'Liste des services' })
  @ApiResponse({ status: 404, description: 'Hôpital non trouvé' })
  getServices(@Param('id') id: string) {
    return this.hospitalsService.getServices(id);
  }
}
