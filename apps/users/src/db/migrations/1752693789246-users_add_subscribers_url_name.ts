import { MigrationInterface, QueryRunner } from "typeorm";

export class UsersAddSubscribersUrlName1752693789246 implements MigrationInterface {
    name = 'UsersAddSubscribersUrlName1752693789246'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "subscriber"
            ADD "subscriberUrl" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "subscriber"
            ADD "subscriberUsername" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "subscriber"
            ADD "subscribedUrl" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "subscriber"
            ADD "subscribedUsername" character varying NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "subscriber" DROP COLUMN "subscribedUsername"
        `);
        await queryRunner.query(`
            ALTER TABLE "subscriber" DROP COLUMN "subscribedUrl"
        `);
        await queryRunner.query(`
            ALTER TABLE "subscriber" DROP COLUMN "subscriberUsername"
        `);
        await queryRunner.query(`
            ALTER TABLE "subscriber" DROP COLUMN "subscriberUrl"
        `);
    }

}
