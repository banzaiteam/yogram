import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationsProd1747175619918 implements MigrationInterface {
    name = 'MigrationsProd1747175619918'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "firstName"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "lastName"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "birthdate"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "description"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "country"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "city"
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles"
            ADD CONSTRAINT "UQ_d1ea35db5be7c08520d70dc03f8" UNIQUE ("username")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "profiles" DROP CONSTRAINT "UQ_d1ea35db5be7c08520d70dc03f8"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "city" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "country" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "description" text
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "birthdate" date NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "lastName" character varying(30) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "firstName" character varying(30) NOT NULL
        `);
    }

}
