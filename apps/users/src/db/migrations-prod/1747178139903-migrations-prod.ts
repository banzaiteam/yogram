import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationsProd1747178139903 implements MigrationInterface {
    name = 'MigrationsProd1747178139903'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "password"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "password" character varying NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "password"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "password" character varying(30) NOT NULL
        `);
    }

}
