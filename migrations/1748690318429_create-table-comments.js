/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('comments', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        content: {
            type: 'VARCHAR',
            notNull: true,
        },
        date: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        thread_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        is_deleted: {
            type: 'BOOLEAN',
            notNull: true,
        },
    });

    pgm.addConstraint('comments', 'fk_comments.thread_id_to_threads.id', {
        foreignKeys: {
            columns: 'thread_id',
            references: 'threads(id)',
            onDelete: 'cascade',  // optional: deletes comments when thread is deleted
            onUpdate: 'cascade',  // optional: updates if thread.id changes
        },
    });

    pgm.addConstraint('comments', 'fk_comments.user_id_to_users.id', {
        foreignKeys: {
            columns: 'user_id',
            references: 'users(id)',
            onDelete: 'cascade',  // optional: deletes comments when thread is deleted
            onUpdate: 'cascade',  // optional: updates if thread.id changes
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('comments');
};
