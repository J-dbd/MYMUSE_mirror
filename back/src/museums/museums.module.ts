import { Module } from '@nestjs/common';
import { Museum, MuseumSchema } from './museum.schema';
import { MuseumController } from './museums.controller';
import { MuseumService } from './museums.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Museum.name, schema: MuseumSchema }]),
  ],
  controllers: [MuseumController],
  providers: [MuseumService],
})
export class MuseumModule {}
