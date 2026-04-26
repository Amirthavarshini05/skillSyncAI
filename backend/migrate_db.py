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
            
        # Check if skills_learned exists in roadmaps
        cursor.execute("PRAGMA table_info(roadmaps)")
        roadmaps_columns = [column[1] for column in cursor.fetchall()]
        
        if 'skills_learned' not in roadmaps_columns:
            print("Adding column 'skills_learned' to 'roadmaps' table...")
            cursor.execute("ALTER TABLE roadmaps ADD COLUMN skills_learned JSON")
        else:
            print("'skills_learned' column already exists in roadmaps.")
            
        # Check if new columns exist in student_profiles
        cursor.execute("PRAGMA table_info(student_profiles)")
        student_profiles_columns = [column[1] for column in cursor.fetchall()]
        
        if 'resume_path' not in student_profiles_columns:
            print("Adding column 'resume_path' to 'student_profiles' table...")
            cursor.execute("ALTER TABLE student_profiles ADD COLUMN resume_path TEXT")
            
        if 'resume_data' not in student_profiles_columns:
            print("Adding column 'resume_data' to 'student_profiles' table...")
            cursor.execute("ALTER TABLE student_profiles ADD COLUMN resume_data JSON")
            
        if 'roadmap_progress' not in student_profiles_columns:
            print("Adding column 'roadmap_progress' to 'student_profiles' table...")
            cursor.execute("ALTER TABLE student_profiles ADD COLUMN roadmap_progress JSON")
            
        conn.commit()
        conn.close()
        print("Migration completed successfully!")
        
    except Exception as e:
        print(f"Error during migration: {e}")

if __name__ == "__main__":
    migrate()
