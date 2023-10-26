import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';
import path from 'path';

@Injectable()
export class FileService {
  async readFile(filePath: string): Promise<Buffer> {
    try {
      const fileContent = await fs.readFile(filePath);
      return fileContent;
    } catch (error) {
      throw new Error(`Error reading file: ${error.message}`);
    }
  }

  async readFolder(filePath: string) {
    try {
      const dir = await fs.readdir(filePath);
      return dir;
    } catch (error) {
      throw new NotFoundException(`can not found folder${filePath}`);
    }
  }

  async uploadFileToLocalServer(
    fileContent: Buffer | string,
    fileName: string,
  ): Promise<string> {
    const currentScriptPath = path.dirname(
      require.resolve('../../src/main.ts'), // 현재 실행 중인 TypeScript 파일의 경로
    );
    const modifiedPath = currentScriptPath.replace(/\\src$/, ''); // '\src' 부분을 빈 문자열로 대체
    const uploadsDirectory = path.join(modifiedPath, 'upload'); // 내부 서버의 uploads 폴더 경로

    try {
      // uploads 폴더가 없으면 생성
      await fs.mkdir(uploadsDirectory, { recursive: true });

      // 파일 저장 경로
      const filePath = path.join(uploadsDirectory, fileName);
      // 파일 저장
      await fs.writeFile(filePath, fileContent);

      const relativePath = path.relative(modifiedPath, filePath);
      console.log('relativePath = ', relativePath);
      return relativePath; // 저장된 파일의 경로 반환
    } catch (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }
  }
}

// controller에서 file 업로드 기본 형태
// @ApiOperation({ summary: '파일 업로드 하기' })
// @ApiConsumes('multipart/form-data')
// @ApiBody({
//   schema: {
//     type: 'object',
//     properties: {
//       file: {
//         type: 'string',
//         format: 'binary',
//       },
//     },
//   },
// })
// @Post('upload')
// @UseInterceptors(FileInterceptor('file'))
// uploadFile(@UploadedFile() file: Express.Multer.File) {
//   console.log(file);
// }
