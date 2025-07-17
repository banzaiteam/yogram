import { MigrationInterface, QueryRunner } from "typeorm";

export class UsersAddSubscribersId1752687073788 implements MigrationInterface {
    name = 'UsersAddSubscribersId1752687073788'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "subscriber" (
                "subscriberId" uuid NOT NULL,
                "subscribedId" uuid NOT NULL,
                CONSTRAINT "PK_d391d99b92f49e4ce744e323511" PRIMARY KEY ("subscriberId", "subscribedId")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "subscriber"
        `);
    }

}
