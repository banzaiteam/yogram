import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsersAboutme1750497013118 implements MigrationInterface {
    name = 'AddUsersAboutme1750497013118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "profiles"
            ADD "aboutMe" character varying(300)
        `);
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
        await queryRunner.query(`
            ALTER TABLE "profiles" DROP COLUMN "aboutMe"
        `);
    }

}
