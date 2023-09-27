import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { SimulatorResultService } from './simulator-result.service';
import { CreateSimulatorResultDto } from './dto/create-simulator-result.dto';
import { UpdateSimulatorResultDto } from './dto/update-simulator-result.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { SimulatorResult } from './entities/simulator-result.entity';
import { PsApiRequest } from './dto/ps-input.dto';
import {
  awbInPalletRackResultRequest,
  userSelectInput,
} from './dto/user-select-input.dto';
import { TransactionInterceptor } from '../lib/interceptor/transaction.interfacepter';
import { TransactionManager } from '../lib/decorator/transaction.decorator';
import { EntityManager } from 'typeorm';

@Controller('simulator-result')
@ApiTags('[시뮬레이터 결과]simulator-result')
export class SimulatorResultController {
  constructor(
    private readonly simulatorResultService: SimulatorResultService,
  ) {}

  @ApiOperation({
    summary: '[사용x] 이 api는 ps의 호출을 하지 않음',
    description:
      'UldCode: uld의 코드, simulation: 시뮬레이션=ture, 커넥티드=false',
  })
  @Post()
  create(@Body() createSimulatorResultDto: CreateSimulatorResultDto) {
    return this.simulatorResultService.create(createSimulatorResultDto);
  }

  // @ApiOperation({
  //   summary: '패키지 시뮬레이터를 사용해서 asrs, uld 작업지시 만들기',
  // })
  // @Post('/make-order/with/ps')
  // createOrderByPs(@Body() body: PsApiRequest) {
  //   return this.simulatorResultService.createOrderByResult(body);
  // }

  @ApiOperation({
    summary: '[4개가 채워진 후 1개 뽑고 싶을 때] uld 작업지시 만들기',
    description:
      'UldCode: uld의 코드, simulation: 시뮬레이션=ture, 커넥티드=false',
  })
  @ApiBody({ type: userSelectInput })
  @Post('/make-build-up-order-order/with/ps')
  createBuildUpOrderBySimulatorResult(@Body() body: userSelectInput) {
    return this.simulatorResultService.createBuildUpOrderBySimulatorResult(
      body,
    );
  }

  @ApiOperation({
    summary:
      '[최초에 안착대 4개 다 비어있을 시] asrs작업지시 만들기, build-up-order 같이만들기 ',
    description:
      'UldCode: uld의 코드, simulation: 시뮬레이션=ture, 커넥티드=false',
  })
  @ApiBody({ type: PsApiRequest })
  @UseInterceptors(TransactionInterceptor)
  @Post('/make-asrs-out-order/with/ps')
  createAsrsOutOrderBySimulatorResult(
    @Body() body: PsApiRequest,
    @TransactionManager() queryRunnerManager: EntityManager,
  ) {
    return this.simulatorResultService.createAsrsOutOrderBySimulatorResult(
      body,
      queryRunnerManager,
    );
  }

  @ApiOperation({
    summary: 'uld를 새롭게 설정하는 reboot',
    description: 'uld를 새롭게 설정하는 reboot',
  })
  @ApiBody({ type: PsApiRequest })
  @Post('/reboot')
  reboot(@Body() body: PsApiRequest) {
    return this.simulatorResultService.reboot(body);
  }

  @ApiOperation({
    summary: '현재 안착대에 추천도를 보여주는 것',
    description: '현재 안착대에 추천도를 보여주는 것',
  })
  @ApiBody({ type: awbInPalletRackResultRequest })
  @Post('/getAWBinPalletRack')
  getAWBinPalletRack(@Body() body: userSelectInput) {
    return this.simulatorResultService.getAWBinPalletRack(body);
  }

  @ApiQuery({ name: 'Uld', required: false, type: 'number' })
  @ApiQuery({ name: 'loadRate', required: false })
  @ApiQuery({ name: 'version', required: false })
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get()
  findAll(@Query() query: SimulatorResult & BasicQueryParamDto) {
    return this.simulatorResultService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.simulatorResultService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSimulatorResultDto: UpdateSimulatorResultDto,
  ) {
    return this.simulatorResultService.update(+id, updateSimulatorResultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.simulatorResultService.remove(+id);
  }
}
