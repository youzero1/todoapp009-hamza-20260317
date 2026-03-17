import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Todo } from '../entity/Todo';
import path from 'path';

const DATABASE_PATH = process.env.DATABASE_PATH || './data/todos.db';

// Resolve relative paths from the project root (process.cwd())
const resolvedDbPath = path.isAbsolute(DATABASE_PATH)
  ? DATABASE_PATH
  : path.join(process.cwd(), DATABASE_PATH);

declare global {
  // eslint-disable-next-line no-var
  var _dataSource: DataSource | undefined;
}

let dataSource: DataSource;

if (process.env.NODE_ENV === 'production') {
  dataSource = new DataSource({
    type: 'better-sqlite3',
    database: resolvedDbPath,
    synchronize: true,
    logging: false,
    entities: [Todo],
  });
} else {
  // In development, use a global variable to preserve the DataSource across hot-reloads
  if (!global._dataSource) {
    global._dataSource = new DataSource({
      type: 'better-sqlite3',
      database: resolvedDbPath,
      synchronize: true,
      logging: false,
      entities: [Todo],
    });
  }
  dataSource = global._dataSource;
}

export async function getDataSource(): Promise<DataSource> {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  return dataSource;
}

export { Todo };
