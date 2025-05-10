import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1746913516296 implements MigrationInterface {
    name = 'Migrations1746913516296'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "users" (
                "user_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "firstName" character varying(30) NOT NULL,
                "lastName" character varying(30) NOT NULL,
                "birthdate" date NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying(30) NOT NULL,
                "description" text,
                "country" character varying NOT NULL,
                "city" character varying NOT NULL,
                "verified" boolean NOT NULL,
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "profiles" (
                "profile_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "username" character varying(30) NOT NULL,
                "new" uuid NOT NULL,
                "user_id" uuid,
                CONSTRAINT "REL_9e432b7df0d182f8d292902d1a" UNIQUE ("user_id"),
                CONSTRAINT "PK_6a23df60690da92fd263eca2e93" PRIMARY KEY ("profile_id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles"
            ADD CONSTRAINT "FK_9e432b7df0d182f8d292902d1a2" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "profiles" DROP CONSTRAINT "FK_9e432b7df0d182f8d292902d1a2"
        `);
        await queryRunner.query(`
            DROP TABLE "profiles"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
    }

}
