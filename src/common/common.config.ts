import * as dotenv from 'dotenv';

const result: dotenv.DotenvConfigOutput = dotenv.config();

if (result.error) {
  throw result.error;
}

const { NODE_ENV, DB_CONNECTION_STRING, JWT_SECRET } = process.env;

export class CommonConfig {
  public static NODE_ENV: string = NODE_ENV as string;
  public static DB_CONNECTION_STRING: string = DB_CONNECTION_STRING as string;
  public static JWT_SECRET: string = JWT_SECRET as string;
}
