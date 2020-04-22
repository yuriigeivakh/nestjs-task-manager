import { Test } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UnauthorizedException } from '@nestjs/common';

const mockTaskRepository = () => ({
    findOne: jest.fn(),
});

describe('Jwt strategy', () => {
    describe('validate', () => {
        let jwtStrategy;
        let userRepository;
        const user = {username: 'user'};

        beforeEach(async () => {
            const module = await Test.createTestingModule({
                providers: [
                    JwtStrategy,
                    { provide: UserRepository, useFactory: mockTaskRepository }
                ]
            }).compile();

            jwtStrategy = await module.get(JwtStrategy);
            userRepository = await module.get(UserRepository);
        });

        it('should validates and return user if its found', async () => {
            userRepository.findOne.mockResolvedValue(user);
            const result = await jwtStrategy.validate(user);
            expect(result).toEqual(user);
        });

        it('should return UnauthorizedException when user is not found', async () => {
            userRepository.findOne.mockResolvedValue(false);
            expect(jwtStrategy.validate(user)).rejects.toThrow(UnauthorizedException);
        });
    });
});