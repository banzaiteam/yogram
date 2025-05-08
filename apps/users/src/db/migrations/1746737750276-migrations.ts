import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1746737750276 implements MigrationInterface {
    name = 'Migrations1746737750276'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "profiles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" date NOT NULL DEFAULT now(),
                "updateAt" date NOT NULL DEFAULT now(),
                "deletedAt" date,
                "username" character varying(30) NOT NULL,
                "user_id" uuid NOT NULL,
                CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" date NOT NULL DEFAULT now(),
                "updateAt" date NOT NULL DEFAULT now(),
                "deletedAt" date,
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
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP TABLE "profiles"
        `);
    }

}
