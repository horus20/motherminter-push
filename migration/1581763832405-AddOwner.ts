import {MigrationInterface, QueryRunner} from "typeorm";

export class AddOwner1581763832405 implements MigrationInterface {
    name = 'AddOwner1581763832405'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `warehouse` ADD `owner` varchar(42) NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `warehouse` DROP COLUMN `owner`", undefined);
    }

}
