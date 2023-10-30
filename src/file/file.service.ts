import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';
import path from 'path';

@Injectable()
export class FileService {
  private readonly currentScriptPath: string;
  private readonly modifiedPath: string;
  private readonly uploadsDirectory: string;

  constructor() {
    this.currentScriptPath = path.dirname(require.resolve('../../src/main.ts'));
    this.modifiedPath = this.currentScriptPath.replace(/\\src$/, '');
    this.uploadsDirectory = path.join(this.modifiedPath, 'upload');
  }

  private async handleError(error: any) {
    if (error.code === 'ENOENT') {
      throw new NotFoundException(`File or directory not found`);
    } else {
      throw new Error(`Error processing file or directory: ${error.message}`);
    }
  }

  async readFile(filePath: string): Promise<Buffer> {
    try {
      const fileContent = await fs.readFile(filePath);
      return fileContent;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async readFolder(filePath: string) {
    try {
      const dir = await fs.readdir(filePath);
      return dir;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async uploadFileToLocalServer(
    fileContent: Buffer | string,
    fileName: string,
  ): Promise<string> {
    try {
      // uploads 폴더가 없으면 생성
      await fs.mkdir(this.uploadsDirectory, { recursive: true });

      // 파일 저장 경로
      const filePath = path.join(this.uploadsDirectory, fileName);

      // 파일 저장
      await fs.writeFile(filePath, fileContent);

      const relativePath = path.relative(this.modifiedPath, filePath);

      return relativePath; // 저장된 파일의 경로 반환
    } catch (error) {
      await this.handleError(error);
    }
  }
}
