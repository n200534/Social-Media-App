import os
import sys
from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

# 👇 Add your app root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# 👇 Load environment variables
from dotenv import load_dotenv
load_dotenv()

# ✅ Alembic config object — DEFINE THIS FIRST
config = context.config

# ✅ Set DB URL from .env
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL is None:
    raise Exception("DATABASE_URL not set in .env")
config.set_main_option("sqlalchemy.url", DATABASE_URL)

# 📁 Import your models to register them with Alembic
from app.core.database import Base
from app.models.user import User
from app.models.post import Post
from app.models.likes import Like
from app.models.follows import Follow
from app.models.comments import Comment
from app.models.message import Message

# 📦 Metadata for Alembic to detect changes
target_metadata = Base.metadata

# --- Alembic boilerplate below here stays the same ---
def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url, target_metadata=target_metadata, literal_binds=True, dialect_opts={"paramstyle": "named"}
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
