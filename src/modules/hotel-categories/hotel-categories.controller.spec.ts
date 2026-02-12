import { Test, TestingModule } from '@nestjs/testing';
import { HotelCategoriesController } from './hotel-categories.controller';

describe('HotelCategoriesController', () => {
  let controller: HotelCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HotelCategoriesController],
    }).compile();

    controller = module.get<HotelCategoriesController>(HotelCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
