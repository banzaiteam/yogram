import { MigrationInterface, QueryRunner } from "typeorm";

export class Users11760074944209 implements MigrationInterface {
    name = 'Users11760074944209'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "profiles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" date NOT NULL DEFAULT now(),
                "updatedAt" date NOT NULL DEFAULT now(),
                "deletedAt" date,
                "username" character varying(30) NOT NULL,
                "aboutMe" character varying(300),
                "user_id" uuid,
                CONSTRAINT "UQ_d1ea35db5be7c08520d70dc03f8" UNIQUE ("username"),
                CONSTRAINT "REL_9e432b7df0d182f8d292902d1a" UNIQUE ("user_id"),
                CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id")
            )
        `);
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
                "providerId" character varying,
                "email" character varying,
                "username" character varying,
                "userId" uuid,
                CONSTRAINT "PK_af13fc2ebf382fe0dad2e4793aa" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" date NOT NULL DEFAULT now(),
                "updatedAt" date NOT NULL DEFAULT now(),
                "deletedAt" date,
                "email" character varying NOT NULL,
                "password" character varying,
                "verified" boolean NOT NULL,
                "url" character varying,
                "firstName" character varying,
                "lastName" character varying,
                "country" character varying,
                "city" character varying,
                "birthdate" date,
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "subscriber" (
                "subscriberId" uuid NOT NULL,
                "subscriberUrl" character varying,
                "subscriberUsername" character varying NOT NULL,
                "subscribedId" uuid NOT NULL,
                "subscribedUrl" character varying,
                "subscribedUsername" character varying NOT NULL,
                CONSTRAINT "PK_d391d99b92f49e4ce744e323511" PRIMARY KEY ("subscriberId", "subscribedId")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles"
            ADD CONSTRAINT "FK_9e432b7df0d182f8d292902d1a2" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
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
            ALTER TABLE "profiles" DROP CONSTRAINT "FK_9e432b7df0d182f8d292902d1a2"
        `);
        await queryRunner.query(`
            DROP TABLE "subscriber"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP TABLE "providers"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."providers_type_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "profiles"
        `);
    }

}
