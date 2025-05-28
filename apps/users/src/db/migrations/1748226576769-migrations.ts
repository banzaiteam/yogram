import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1748226576769 implements MigrationInterface {
    name = 'Migrations1748226576769'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."providers_type_enum" AS ENUM('google', 'github')
        `);
        await queryRunner.query(`
            CREATE TABLE "providers" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" date NOT NULL DEFAULT now(),
                "updatedAt" date NOT NULL DEFAULT now(),
                "deletedAt" date,
                "type" "public"."providers_type_enum" NOT NULL,
                "providerId" integer,
                "email" character varying,
                "username" character varying,
                "userId" uuid,
                CONSTRAINT "PK_af13fc2ebf382fe0dad2e4793aa" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "providers"
            ADD CONSTRAINT "FK_b0a257f97e76b698c4935b27d7d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "providers" DROP CONSTRAINT "FK_b0a257f97e76b698c4935b27d7d"
        `);
        await queryRunner.query(`
            DROP TABLE "providers"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."providers_type_enum"
        `);
    }

}
