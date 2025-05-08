import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1746732126900 implements MigrationInterface {
    name = 'Migrations1746732126900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "address" character varying NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "address"
        `);
    }

}
