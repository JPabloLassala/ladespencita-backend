import { Inject, Injectable } from "@nestjs/common";
import { QueryTypes, Sequelize } from "sequelize";
import { DB_CONNECTION } from "src/constants";

@Injectable()
export class DatabaseService {
  constructor(@Inject(DB_CONNECTION) private readonly sequelize: Sequelize) {}

  async getNextId(tableName: string, columnName: string): Promise<number> {
    const result = await this.sequelize.query<{ nextval: number }>(
      `SELECT nextval(pg_get_serial_sequence('${tableName}', '${columnName}'))`,
      {
        type: QueryTypes.SELECT,
      },
    );

    return result[0].nextval;
  }
}
