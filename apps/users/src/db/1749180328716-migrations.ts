import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1749180328716 implements MigrationInterface {
    name = 'Migrations1749180328716'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "providers" DROP COLUMN "providerId"
        `);
        await queryRunner.query(`
            ALTER TABLE "providers"
            ADD "providerId" character varying
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "providers" DROP COLUMN "providerId"
        `);
        await queryRunner.query(`
            ALTER TABLE "providers"
            ADD "providerId" numeric
        `);
    }

}
