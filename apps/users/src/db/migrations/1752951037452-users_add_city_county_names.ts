import { MigrationInterface, QueryRunner } from "typeorm";

export class UsersAddCityCountyNames1752951037452 implements MigrationInterface {
    name = 'UsersAddCityCountyNames1752951037452'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "firstName" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "lastName" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "country" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "city" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "birthdate" date
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "birthdate"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "city"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "country"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "lastName"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "firstName"
        `);
    }

}
