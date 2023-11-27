import { Injectable } from '@nestjs/common';
import { CreateBasicDto } from './dto/create-basic.dto';
import { UpdateBasicDto } from './dto/update-basic.dto';
import sql from 'mssql';
import { Vms3D } from '../vms/entities/vms.entity';

@Injectable()
export class BasicService {
  create(createBasicDto: CreateBasicDto) {
    return 'This action adds a new basic';
  }
  async sendInsertQueryAtMssql() {
    const insertQuery = `insert into VWMS_AWB_RESULT(AWB_NUMBER, VWMS_ID) values('tttttttttttttttt', 'qwe')`;
    const searchResult = await this.selectQuery(insertQuery);
    return searchResult;
  }

  async sendSelectQueryAtMssql() {
    const selectQuery = `select top(1) * from VWMS_3D_RESULT_DATA order by CREATE_DATE desc;`;
    // const selectQuery = `select top(1) * from VWMS_2D_RAW_DATA order by CREATE_DATE desc;`;
    // const selectQuery = `select top(1) * from VWMS_AWB_RESULT order by RECEIVED_DATE desc;`;
    // const selectQuery = `select top(1) * from VWMS_AWB_HISTORY order by OUT_DATE desc;`
    return await this.selectQuery(selectQuery);
  }

  private async selectQuery(query: string) {
    try {
      // config object를 이용하여 SQL Server에 연결
      const pool = await sql.connect({
        server: process.env.DIMOA_DATABASE_HOST,
        port: +process.env.DIMOA_DATABASE_PORT,
        user: process.env.DIMOA_DATABASE_USER,
        password: process.env.DIMOA_DATABASE_PASS,
        database: process.env.DIMOA_DATABASE_NAME,
        options: {
          encrypt: false,
        },
      });

      // query 메소드를 이용하여 쿼리 실행
      const result = await pool.request().query<Vms3D>(query);

      console.log(result);
      return result?.recordset[0];
    } catch (err) {
      // 에러 처리
      console.error('SQL error', err);
    }
  }

  findAll() {
    return `This action returns all basic`;
  }

  findOne(id: number) {
    return `This action returns a #${id} basic`;
  }

  update(id: number, updateBasicDto: UpdateBasicDto) {
    return `This action updates a #${id} basic`;
  }

  remove(id: number) {
    return `This action removes a #${id} basic`;
  }
}
