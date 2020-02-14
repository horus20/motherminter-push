import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAccount1581665088258 implements MigrationInterface {
    name = 'AddAccount1581665088258'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `account` (`id` int NOT NULL AUTO_INCREMENT, `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `email` varchar(512) NULL, `password` varchar(64) NULL, `brand` varchar(255) NULL, `logo` text NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `company` ADD `accountId` int NULL", undefined);
        await queryRunner.query("ALTER TABLE `company` ADD CONSTRAINT `FK_6a1f21580eb0731c7322c08d7df` FOREIGN KEY (`accountId`) REFERENCES `account`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `company` DROP FOREIGN KEY `FK_6a1f21580eb0731c7322c08d7df`", undefined);
        await queryRunner.query("ALTER TABLE `company` DROP COLUMN `accountId`", undefined);
        await queryRunner.query("DROP TABLE `account`", undefined);
    }

}
