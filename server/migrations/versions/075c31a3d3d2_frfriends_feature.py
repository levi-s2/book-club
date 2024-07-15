"""frfriends feature

Revision ID: 075c31a3d3d2
Revises: 548bee1c6cd5
Create Date: 2024-07-15 17:17:06.192266

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '075c31a3d3d2'
down_revision = '548bee1c6cd5'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('friends',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('friend_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['friend_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('user_id', 'friend_id')
    )
    op.add_column('users', sa.Column('profile_image_url', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users', 'profile_image_url')
    op.drop_table('friends')
    # ### end Alembic commands ###
