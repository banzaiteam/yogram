import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsersUrl1750528020327 implements MigrationInterface {
    name = 'AddUsersUrl1750528020327'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "url" character varying
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "url"
        `);
    }

}
