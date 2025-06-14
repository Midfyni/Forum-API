/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('likes', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        is_liked: {
            type: 'BOOLEAN',
            notNull: true,
            default: true,
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        comment_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
    });

    pgm.addConstraint('likes', 'fk_likes.user_id_to_users.id', {
        foreignKeys: {
            columns: 'user_id',
            references: 'users(id)',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        },
    });

    pgm.addConstraint('likes', 'fk_likes.comment_id_to_comments.id', {
        foreignKeys: {
            columns: 'comment_id',
            references: 'comments(id)',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('likes');
};
