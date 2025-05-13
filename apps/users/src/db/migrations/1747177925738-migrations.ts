import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1747177925738 implements MigrationInterface {
    name = 'Migrations1747177925738'

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
