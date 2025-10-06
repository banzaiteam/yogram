import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1759510078952 implements MigrationInterface {
    name = 'Init1759510078952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "posts-delete-outbox" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" date NOT NULL DEFAULT now(),
                "updatedAt" date NOT NULL DEFAULT now(),
                "deletedAt" date,
                "pathToFiles" character varying NOT NULL,
                "bucketName" character varying NOT NULL,
                "entityDeleted" boolean NOT NULL DEFAULT false,
                "filesDeleted" boolean NOT NULL DEFAULT false,
                CONSTRAINT "PK_5cbc10116911366c13a671f9f37" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."files_status_enum" AS ENUM('pending', 'ready')
        `);
        await queryRunner.query(`
            CREATE TABLE "files" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" date NOT NULL DEFAULT now(),
                "updatedAt" date NOT NULL DEFAULT now(),
                "deletedAt" date,
                "fileName" character varying(100) NOT NULL,
                "url" character varying(200),
                "metatype" character varying,
                "status" "public"."files_status_enum" NOT NULL DEFAULT 'pending',
                "postId" uuid,
                CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "comments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" date NOT NULL DEFAULT now(),
                "updatedAt" date NOT NULL DEFAULT now(),
                "deletedAt" date,
                "userId" uuid NOT NULL,
                "text" character varying(300) NOT NULL,
                "likes" integer NOT NULL DEFAULT '0',
                "parentId" uuid,
                "post_id" uuid,
                CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "posts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" date NOT NULL DEFAULT now(),
                "updatedAt" date NOT NULL DEFAULT now(),
                "deletedAt" date,
                "userId" character varying(50) NOT NULL,
                "isPublished" boolean NOT NULL DEFAULT false,
                "description" character varying(500),
                CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "files"
            ADD CONSTRAINT "FK_3d97c727c9f600ceff4ab57cd6d" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "comments"
            ADD CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "comments"
            ADD CONSTRAINT "FK_8770bd9030a3d13c5f79a7d2e81" FOREIGN KEY ("parentId") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "comments" DROP CONSTRAINT "FK_8770bd9030a3d13c5f79a7d2e81"
        `);
        await queryRunner.query(`
            ALTER TABLE "comments" DROP CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5"
        `);
        await queryRunner.query(`
            ALTER TABLE "files" DROP CONSTRAINT "FK_3d97c727c9f600ceff4ab57cd6d"
        `);
        await queryRunner.query(`
            DROP TABLE "posts"
        `);
        await queryRunner.query(`
            DROP TABLE "comments"
        `);
        await queryRunner.query(`
            DROP TABLE "files"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."files_status_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "posts-delete-outbox"
        `);
    }

}
