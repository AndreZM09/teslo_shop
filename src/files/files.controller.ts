import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Res, UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { BadRequestException } from '@nestjs/common/exceptions';
import { diskStorage } from 'multer';
import { fileFilter } from './helpers/fileFilter.helper';
import { fileNamer } from './helpers/fileNamer.helper';
import { Response } from "express";
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files - Get and upload')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService,
              private readonly configService:ConfigService) {}

  @Get('product/:imageName')
  findProductImage(@Res()res:Response, @Param('imageName')imageName:string) {
    const path=this.filesService.getStaticProductImage(imageName)

    res.sendFile(path)
  }

  @Post('product')
  @UseInterceptors(FileInterceptor('file',{fileFilter:fileFilter, storage:diskStorage({destination:'./static/products',filename:fileNamer})}))
  uploadProductImage(@UploadedFile() file:Express.Multer.File) {
      
      if(!file){
        throw new BadRequestException('Make sure that the file is an image')
      }

      const secureUrl=`${this.configService.get('HOST_API')}/files/product/${file.filename}`
      
    return {secureUrl}
  }
}
