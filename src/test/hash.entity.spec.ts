import { Test, TestingModule } from '@nestjs/testing';
import { HashController } from '../api/hash/hash.controller';
import { HashService } from '../api/hash/hash.service';
import { HashDto } from '../api/hash/dto/hash.dto';

describe('HashController', () => {
  let controller: HashController;
  let service: HashService;
  //   const mockService = {
  //     create: jest.fn((HashDto) => {
  //       return {
  //         ...HashDto,
  //       };
  //     }),
  //   };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HashController],
      providers: [
        {
          provide: HashService,
          useValue: {
            uploadData: jest.fn().mockImplementation((hash: HashDto) =>
              Promise.resolve({
                message: 'Record has been inserted successfully',
                providedHex: hash.inputHex,
              }),
            ),
            getHashInfo: jest.fn().mockImplementation((hex: string) =>
              Promise.resolve({
                createdAt: '2022-08-19T07:49:06.056Z',
                id: '94b16649-3578-4b1d-8264-89493c2d4b3a',
                input_hex: hex,
                ip_address: '183.182.86.138',
                last_process_nonce: '0',
                nonce: '0',
                output_hex: null,
                status: 'pending',
                updatedAt: '2022-08-19T07:49:06.056Z',
              }),
            ),
          },
        },
      ],
    }).compile();
    controller = module.get<HashController>(HashController);
    service = module.get<HashService>(HashService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should store the hex', () => {
    expect(
      controller.uploadData({
        inputHex:
          '54e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107',
        ipAddress: '183.182.86.138',
      }),
    ).resolves.toEqual({
      message: 'Record has been inserted successfully',
      providedHex:
        '54e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107',
    });
  });

  it('should get hex', async () => {
    await expect(
      controller.hexStatus(
        '54e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107',
      ),
    ).resolves.toEqual({
      id: '94b16649-3578-4b1d-8264-89493c2d4b3a',
      input_hex:
        '54e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107',
      nonce: '0',
      last_process_nonce: '0',
      ip_address: '183.182.86.138',
      output_hex: null,
      status: 'pending',
      createdAt: '2022-08-19T07:49:06.056Z',
      updatedAt: '2022-08-19T07:49:06.056Z',
    });
  });
});
