/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('replies', {
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
        comment_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        is_deleted: {
            type: 'BOOLEAN',
            notNull: true,
        },
    });

    pgm.addConstraint('replies', 'fk_replies.comment_id_to_comments.id', {
        foreignKeys: {
            columns: 'comment_id',
            references: 'comments(id)',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        },
    });

    pgm.addConstraint('replies', 'fk_replies.user_id_to_users.id', {
        foreignKeys: {
            columns: 'user_id',
            references: 'users(id)',
            onDelete: 'cascade',  
            onUpdate: 'cascade', 
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('replies');
};
