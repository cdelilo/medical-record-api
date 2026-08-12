import {
  Table,
  TableForeignKey,
  TableIndex,
  type MigrationInterface,
  type QueryRunner,
} from 'typeorm'

export class CreateAppointments1786211264714 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'appointments',
        columns: [
          {
            name: 'id',
            type: 'char',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'patient_id',
            type: 'char',
            length: '36',
            isNullable: false,
          },
          {
            name: 'scheduled_at',
            type: 'datetime',
            isNullable: false,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    )

    await queryRunner.createForeignKey(
      'appointments',
      new TableForeignKey({
        name: 'FK_appointments_patient',
        columnNames: ['patient_id'],
        referencedTableName: 'patients',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    )

    await queryRunner.createIndex(
      'appointments',
      new TableIndex({
        name: 'UQ_appointments_scheduled_at',
        columnNames: ['scheduled_at'],
        isUnique: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('appointments')
  }
}
