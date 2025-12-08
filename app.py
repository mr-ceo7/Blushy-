import os
import logging
from flask import Flask, jsonify
from blushy.models import db
from blushy.routes import api_bp, pages_bp
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy import event
from sqlalchemy.exc import SQLAlchemyError

# --- Basic File-based Logging Setup ---
# In a production environment, consider a more robust logging solution.
logging.basicConfig(filename='sql.log', level=logging.INFO,
                    format='%(asctime)s - %(message)s')

# --- Global State ---
# This is a simplified approach. For production, consider using a more
# robust solution like a dedicated state manager or a caching service (e.g., Redis).
PRIMARY_DB_UP = True

# --- Database Health Check ---
def check_primary_db():
    """
    Periodically checks the health of the primary database.
    If the database is down, it switches to the fallback. If it's back up,
    it triggers data synchronization.
    """
    global PRIMARY_DB_UP
    try:
        # A simple query to check the database connection.
        with app.app_context():
            db.session.execute('SELECT 1')
        if not PRIMARY_DB_UP:
            logging.info("Primary database is back online. Starting data synchronization...")
            sync_data_from_fallback_to_primary()
        PRIMARY_DB_UP = True
    except SQLAlchemyError as e:
        if PRIMARY_DB_UP:
            logging.error(f"Primary database is down: {e}")
        PRIMARY_DB_UP = False

# --- Data Synchronization ---
def sync_data_from_fallback_to_primary():
    """
    Reads the SQL log file and executes the queries on the primary database.
    This is a critical operation and should be handled with care.
    """
    try:
        with app.app_context(), open('sql.log', 'r+') as f:
            for line in f:
                # Execute each SQL command on the primary database.
                db.session.execute(line.strip())
            db.session.commit()
            # Clear the log file after successful synchronization.
            f.truncate(0)
        logging.info("Data synchronization successful.")
    except Exception as e:
        logging.error(f"Data synchronization failed: {e}")

# --- Application Factory ---
def create_app():
    """Creates and configures the Flask application."""
    app = Flask(__name__)

    # --- Dynamic Database Configuration ---
    if PRIMARY_DB_UP:
        database_url = os.environ.get('DATABASE_URL', 'sqlite:///blushy.db')
        if database_url.startswith("postgres://"):
            database_url = database_url.replace("postgres://", "postgresql://", 1)
        app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    else:
        # Fallback to a local SQLite database.
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///fallback.db'

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JSON_SORT_KEYS'] = False

    # --- Database and Blueprints Initialization ---
    db.init_app(app)
    app.register_blueprint(api_bp)
    app.register_blueprint(pages_bp)

    # --- Health Check Endpoint ---
    @app.route('/health')
    def health_check():
        return jsonify({'status': 'ok', 'primary_db_up': PRIMARY_DB_UP})

    # --- Table Creation and Scheduler ---
    with app.app_context():
        db.create_all()
        
        # --- SQL Query Logging ---
        @event.listens_for(db.engine, "before_cursor_execute")
        def before_cursor_execute(conn, cursor, statement, parameters, context, executemany):
            """
            Logs every SQL query to a file if the primary database is down.
            This is essential for data synchronization.
            """
            if not PRIMARY_DB_UP:
                logging.info(statement)

    # The scheduler runs in the background to check the database status.
    scheduler = BackgroundScheduler()
    scheduler.add_job(check_primary_db, 'interval', seconds=60)
    scheduler.start()

    return app

app = create_app()

# --- Main Entry Point ---
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
