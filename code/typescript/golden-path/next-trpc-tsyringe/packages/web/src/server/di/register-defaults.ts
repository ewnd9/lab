import { container } from 'tsyringe';
import { db } from '../db';
import { DatabaseService } from '../db/database-service';

const databaseService = new DatabaseService(db);
container.register(DatabaseService, { useValue: databaseService });
