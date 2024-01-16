import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseIdListPipe implements PipeTransform {
  transform(value: string): number[] {
    if (!value) return [];

    return value.split(',').map((idStr) => {
      const id = parseInt(idStr, 10);
      if (isNaN(id)) {
        throw new BadRequestException(`Invalid ID: ${idStr}`);
      }
      return id;
    });
  }
}
