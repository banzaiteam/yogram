import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTable1749194721369 implements MigrationInterface {
    name = 'InitTable1749194721369'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "posts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" date NOT NULL DEFAULT now(),
                "updatedAt" date NOT NULL DEFAULT now(),
                "deletedAt" date,
                "userId" character varying(50) NOT NULL,
                "isPublished" boolean NOT NULL DEFAULT false,
                "description" character varying(500) NOT NULL,
                CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "files" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" date NOT NULL DEFAULT now(),
                "updatedAt" date NOT NULL DEFAULT now(),
                "deletedAt" date,
                "fileName" character varying(50) NOT NULL,
                "url" character varying(200) NOT NULL,
                "metatype" character varying,
                "postId" character varying,
                CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "files"
        `);
        await queryRunner.query(`
            DROP TABLE "posts"
        `);
    }

}
