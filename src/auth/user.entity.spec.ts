import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

describe('User entity', () => {
    describe('Validate password', () => {
        let user;
        beforeEach(() => {
            user = new User();
            user.salt = jest.fn();
            user.password = 'password';
            bcrypt.hash = jest.fn();
        });

        it('should return true as valid password', async () => {
            bcrypt.hash = jest.fn().mockResolvedValue('password');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result = await user.validatePassword('password');
            expect(result).toBeTruthy();
        });

        it('should return false as invalid password', async () => {
            bcrypt.hash = jest.fn().mockResolvedValue('uncorrect password');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result = await user.validatePassword('password');
            expect(result).toBeFalsy();
        });
    });
});