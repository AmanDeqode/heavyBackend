import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { HashDto } from './dto/hash.dto';
import { HashService } from './hash.service';

@Controller('hash')
export class HashController {
  constructor(private readonly hashService: HashService) {}

  @Get('/:hex')
  hexStatus(@Param('hex') hex: string) {
    console.log('called');
    return this.hashService.getHashInfo(hex);
  }

  @Post('/upload')
  uploadData(@Body() hashDto: HashDto) {
    return this.hashService.uploadData(hashDto);
  }
}
