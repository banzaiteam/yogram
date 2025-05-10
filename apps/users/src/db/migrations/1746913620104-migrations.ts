import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1746913620104 implements MigrationInterface {
    name = 'Migrations1746913620104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "profiles" DROP COLUMN "new"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "profiles"
            ADD "new" uuid NOT NULL
        `);
    }

}
