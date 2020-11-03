import status from 'http-status';

import { UserService } from '../services/user.service';
import { UserController } from './user.controller';

const interceptor: any = {
  mockRequest: () => {
    const req: any = {};
    req.body = jest.fn().mockReturnValue(req);
    req.params = jest.fn().mockReturnValue(req);
    req.query = jest.fn().mockReturnValue(req);
    return req;
  },

  mockResponse: () => {
    const res: any = {};
    res.send = jest.fn().mockImplementation(data => {
      res.data = data;
    });
    res.status = jest.fn().mockReturnValue(res);
    res.sendStatus = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  },
  mockNext: () => jest.fn(),
};

const password: string = 'autotestpass';
const login: string = `autotestuser${Date.now()}`;

let user: any = {
  login,
  password,
  age: 20,
  isDeleted: false,
};

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    userController = new UserController('test', userService);
  });

  describe('createUser', () => {
    it('should 201 and return correct value', async () => {
      const req: any = interceptor.mockRequest();
      const res: any = interceptor.mockResponse();
      req.body = user;

      await userController.createUser(req, res);

      const data: any = await res.data;
      user = data;

      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(status.CREATED);
    });
  });

  describe('login', () => {
    it('should 200', async () => {
      const req: any = interceptor.mockRequest();
      const res: any = interceptor.mockResponse();
      req.body = {
        username: login,
        password,
      };

      await userController.login(req, res);

      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(status.OK);
    });

    it('should 401', async () => {
      const req: any = interceptor.mockRequest();
      const res: any = interceptor.mockResponse();
      req.body = {
        username: user.login,
        password: user.password,
      };

      await userController.login(req, res);

      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(status.UNAUTHORIZED);
    });
  });

  describe('getUserById', () => {
    it('should 404 and return correct value', async () => {
      const req: any = interceptor.mockRequest();
      const res: any = interceptor.mockResponse();
      req.params.id = null;

      await userController.getUserById(req, res);

      expect(res.sendStatus).toHaveBeenCalledWith(status.NOT_FOUND);
    });

    it('should 200 and return correct value', async () => {
      const req: any = interceptor.mockRequest();
      const res: any = interceptor.mockResponse();
      req.params.id = user.id;

      await userController.getUserById(req, res);

      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(status.OK);
    });
  });

  describe('getUserList', () => {
    it(`should 200 and return correct value for substr "${user.login.slice(0, 12)}"`, async () => {
      const req: any = interceptor.mockRequest();
      const res: any = interceptor.mockResponse();
      req.query.loginSubstring = user.login.slice(0, 12);

      await userController.getUserList(req, res);

      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(status.OK);
    });
  });

  describe('deleteUser', () => {
    it('should 201 and return correct value', async () => {
      const req: any = interceptor.mockRequest();
      const res: any = interceptor.mockResponse();
      req.params.id = user.id;

      await userController.deleteUser(req, res);

      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(status.NO_CONTENT);
    });
  });
});
