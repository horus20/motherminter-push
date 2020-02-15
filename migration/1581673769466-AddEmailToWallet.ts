import {MigrationInterface, QueryRunner} from "typeorm";

export class AddEmailToWallet1581673769466 implements MigrationInterface {
    name = 'AddEmailToWallet1581673769466'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `wallet` ADD `email` varchar(512) NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `wallet` DROP COLUMN `email`", undefined);
    }

}
