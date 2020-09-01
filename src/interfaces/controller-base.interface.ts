import { Router } from 'express';

export interface IControllerBase {
  path: string;
  router: Router;
  initRoutes(): unknown;
}
