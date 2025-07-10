import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPostsDeleteOutbox1750856578953 implements MigrationInterface {
    name = 'AddPostsDeleteOutbox1750856578953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "posts-delete-outbox" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "entityId" uuid NOT NULL,
                "pathToFiles" character varying NOT NULL,
                "bucketName" character varying NOT NULL,
                "entityStatus" boolean NOT NULL,
                "filesStatus" boolean NOT NULL,
                CONSTRAINT "PK_5cbc10116911366c13a671f9f37" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "posts-delete-outbox"
        `);
    }

}
