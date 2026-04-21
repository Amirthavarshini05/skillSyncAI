import sqlite3

def migrate():
    try:
        conn = sqlite3.connect('skillsync.db')
        cursor = conn.cursor()
        
        print("Starting migration...")
        
        # Check if is_verified already exists
        cursor.execute("PRAGMA table_info(users)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'is_verified' not in columns:
            print("Adding column 'is_verified' to 'users' table...")
            cursor.execute("ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT 0")
        else:
            print("'is_verified' column already exists.")
            
        if 'otp_code' not in columns:
            print("Adding column 'otp_code' to 'users' table...")
            cursor.execute("ALTER TABLE users ADD COLUMN otp_code TEXT")
        else:
            print("'otp_code' column already exists.")
            
        conn.commit()
        conn.close()
        print("Migration completed successfully!")
        
    except Exception as e:
        print(f"Error during migration: {e}")

if __name__ == "__main__":
    migrate()
