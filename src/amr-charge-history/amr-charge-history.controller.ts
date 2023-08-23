import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AmrChargeHistoryService } from './amr-charge-history.service';
import { CreateAmrChargeHistoryDto } from './dto/create-amr-charge-history.dto';
import { UpdateAmrChargeHistoryDto } from './dto/update-amr-charge-history.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { BasicqueryparamDto } from '../lib/dto/basicqueryparam.dto';
import { AmrChargeHistory } from './entities/amr-charge-history.entity';

@Controller('amr-charge-history')
@ApiTags('[Amr 충전이력]amr-charge-history')
export class AmrChargeHistoryController {
  constructor(
    private readonly amrChargeHistoryService: AmrChargeHistoryService,
  ) {}

  @Post()
  create(@Body() createAmrChargeHistoryDto: CreateAmrChargeHistoryDto) {
    return this.amrChargeHistoryService.create(createAmrChargeHistoryDto);
  }

  @ApiQuery({ name: 'chargeStartFrom', required: false, type: 'Date' })
  @ApiQuery({ name: 'chargeStartTo', required: false, type: 'Date' })
  @ApiQuery({ name: 'chargeEndFrom', required: false, type: 'Date' })
  @ApiQuery({ name: 'chargeEndTo', required: false, type: 'Date' })
  @ApiQuery({ name: 'soc', required: false, type: 'string' })
  @ApiQuery({ name: 'soh', required: false, type: 'string' })
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get()
  findAll(
    @Query()
    query: AmrChargeHistory &
      BasicqueryparamDto & {
        chargeStartFrom: Date;
        chargeStartTo: Date;
        chargeEndFrom: Date;
        chargeEndTo: Date;
      },
  ) {
    return this.amrChargeHistoryService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.amrChargeHistoryService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAmrChargeHistoryDto: UpdateAmrChargeHistoryDto,
  ) {
    return this.amrChargeHistoryService.update(+id, updateAmrChargeHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.amrChargeHistoryService.remove(+id);
  }
}
