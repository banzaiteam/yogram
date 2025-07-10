import { MigrationInterface, QueryRunner } from "typeorm";

export class UsersAddUrlAboutMe1750678191331 implements MigrationInterface {
    name = 'UsersAddUrlAboutMe1750678191331'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "profiles"
            ADD "aboutMe" character varying(300)
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "url" character varying
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "url"
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles" DROP COLUMN "aboutMe"
        `);
    }

}
