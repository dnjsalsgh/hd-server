import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';
import path from 'path';

@Injectable()
export class FileService {
  private readonly currentScriptPath: string;
  private readonly modifiedPath: string;
  private readonly uploadsDirectory: string;
  private readonly csvDirectory: string;

  constructor() {
    this.currentScriptPath = path.dirname(require.resolve('../../src/main.ts'));
    this.modifiedPath = this.currentScriptPath.replace(/\\src$/, '');
    this.uploadsDirectory = path.join(this.modifiedPath, 'upload');
    this.csvDirectory = path.join(this.modifiedPath, 'csv');
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
      return relativePath; // 저장된 파일의 상대경로 반환(서버의 정적자원 반환을 위해)
    } catch (error) {
      await this.handleError(error);
    }
  }

  async makeCsvFile(fileContent: Buffer | string, fileName: string) {
    try {
      // uploads 폴더가 없으면 생성
      await fs.mkdir(this.csvDirectory, { recursive: true });

      // 파일 저장 경로
      const filePath = path.join(this.csvDirectory, fileName);

      // 파일 저장
      await fs.writeFile(filePath, fileContent);
    } catch (error) {
      // await this.handleError(error);
    }
  }

  jsonToCSV(jsonData: Array<Record<string, unknown>>): string {
    const titles = Object.keys(jsonData[0]);

    const csvRows = jsonData.map((row) => {
      return titles.map((title) => row[title]).join(',');
    });

    return [titles.join(','), ...csvRows].join('\r\n');
  }
}
