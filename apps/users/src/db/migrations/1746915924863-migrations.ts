import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1746915924863 implements MigrationInterface {
    name = 'Migrations1746915924863'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "profiles" DROP CONSTRAINT "FK_9e432b7df0d182f8d292902d1a2"
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles" DROP CONSTRAINT "PK_6a23df60690da92fd263eca2e93"
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles" DROP COLUMN "profile_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "PK_96aac72f1574b88752e9fb00089"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "user_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles"
            ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles"
            ADD CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id")
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles"
            ADD "createdAt" date NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles"
            ADD "updatedAt" date NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles"
            ADD "deletedAt" date
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "createdAt" date NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "updatedAt" date NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "deletedAt" date
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles"
            ADD CONSTRAINT "FK_9e432b7df0d182f8d292902d1a2" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "profiles" DROP CONSTRAINT "FK_9e432b7df0d182f8d292902d1a2"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "deletedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "updatedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "createdAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles" DROP COLUMN "deletedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles" DROP COLUMN "updatedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles" DROP COLUMN "createdAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles" DROP CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e"
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "user_id" uuid NOT NULL DEFAULT uuid_generate_v4()
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles"
            ADD "profile_id" uuid NOT NULL DEFAULT uuid_generate_v4()
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles"
            ADD CONSTRAINT "PK_6a23df60690da92fd263eca2e93" PRIMARY KEY ("profile_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles"
            ADD CONSTRAINT "FK_9e432b7df0d182f8d292902d1a2" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
