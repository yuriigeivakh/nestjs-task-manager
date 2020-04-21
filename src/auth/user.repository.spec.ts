import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn(),
    getTaskById: jest.fn(),
    save: jest.fn(),
});

const mockCredentials = {
    username: 'testuser',
    password: 'password',
};

describe('User repository', () => {
    let userRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserRepository,
            ]
        }).compile();

        userRepository = await module.get(UserRepository);
    });

    describe('signUp', () => {
        let save;

        beforeEach(() => {
            save = jest.fn();
            userRepository.create = jest.fn().mockReturnValue({ save });
        });

        it('should succesfully sign up the user', async () => {
            save.mockResolvedValue(true);
            expect(userRepository.signUp(mockCredentials)).resolves.not.toThrow();
        });

        it('should throws an exeption as username already exists', async () => {
            save.mockRejectedValue({code: '23505'});
            expect(userRepository.signUp(mockCredentials)).rejects.toThrow(ConflictException);
        });

        it('should throws an unhandled exeption', async () => {
            save.mockRejectedValue({});
            expect(userRepository.signUp(mockCredentials)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('validateUserPassword', () => {
        let user;
        beforeEach(() => {
            userRepository.findOne = jest.fn();
            user = new User();
            user.username = mockCredentials.username;
            user.validatePassword = jest.fn();
        });

        it('should return he username as validation is succesfull', async () => {
            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(true);
            const result = await userRepository.validatePassword(mockCredentials);
            expect(result).toEqual(mockCredentials.username);
        });

        it('should return null as user cannot be found', async () => {
            userRepository.findOne.mockResolvedValue(null);
            const result = await userRepository.validatePassword(mockCredentials);
            expect(user.validatePassword).not.toHaveBeenCalled();
            expect(result).toBeNull();
        });

        it('should return null as password is invalid', async () => {
            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockReturnValue(false);
            const result = await userRepository.validatePassword(mockCredentials);
            expect(result).toBeNull();
        });
    });

    describe('hashPassword', () => {
        it('should calls bcrypt hash to generate hash', async () => {
            bcrypt.hash = jest.fn().mockResolvedValue('hash');
            const result = await userRepository.hashPassword('testPassword', 'testSalt');
            expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSalt');
            expect(result).toEqual('hash');
        });
    });
});