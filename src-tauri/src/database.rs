use rusqlite::{Connection, named_params};
use tauri::AppHandle;
use std::fs;

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct Note {
    pub id: Option<u64>,
    pub title: String,
    pub text: String,
    pub tag: String,
    pub date: String,
    pub pinned: bool, 
}

const CURRENT_DB_VERSION: u32 = 1;

pub fn initialize_database(app_handle: &AppHandle) -> Result<Connection, rusqlite::Error> {
    let app_dir = app_handle.path_resolver().app_data_dir().expect("The app data directory should exist.");
    fs::create_dir_all(&app_dir).expect("The app data directory should be created.");
    let sqlite_path = app_dir.join("pronotes_db.sqlite");

    let mut db = Connection::open(sqlite_path)?;

    let mut user_pragma = db.prepare("PRAGMA user_version")?;
    let existing_user_version: u32 = user_pragma.query_row([], |row| { Ok(row.get(0)?) })?;
    drop(user_pragma);

    upgrade_database_if_needed(&mut db, existing_user_version)?;

    Ok(db)
}

pub fn upgrade_database_if_needed(db: &mut Connection, existing_version: u32) -> Result<(), rusqlite::Error> {
    if existing_version < CURRENT_DB_VERSION {
        db.pragma_update(None, "journal_mode", "WAL")?;

        let tx = db.transaction()?;

        tx.pragma_update(None, "user_version", CURRENT_DB_VERSION)?;

        tx.execute_batch(
            "
            CREATE TABLE notes (
                id INTEGER PRIMARY KEY,
                title TEXT,
                text TEXT,
                tag TEXT,
                date TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime')),
                pinned INTEGER DEFAULT 0
            );
            "
        )?;

        tx.commit()?;
    }

    Ok(())
}

pub fn insert_note(note: &Note, db: &Connection) -> Result<(), rusqlite::Error> {
    let mut statement = db.prepare("INSERT INTO notes (title, text, tag, date, pinned) VALUES (@title, @text, @tag, @date, @pinned)")?;
    statement.execute(named_params! {
        "@title": &note.title,
        "@text": &note.text,
        "@tag": &note.tag,
        "@date": &note.date,
        "@pinned": note.pinned,
    })?;

    Ok(())
}


pub fn update_note(note: &Note, db: &Connection) -> Result<(), rusqlite::Error> {
    let mut statement = db.prepare("
        UPDATE notes
        SET title = @title, text = @text, tag = @tag, date = @date, pinned = @pinned
        WHERE id = @id;
    ")?;
    statement.execute(named_params! {
        "@id": &note.id,
        "@title": &note.title,
        "@text": &note.text,
        "@tag": &note.tag,
        "@date": &note.date,
        "@pinned": note.pinned,
    })?;

    Ok(())
}

pub fn unpin_notes(db: &Connection) -> Result<(), rusqlite::Error> {
    let mut statement = db.prepare("
        UPDATE notes
        SET pinned = @pinned;
    ")?;
    statement.execute(named_params! {"@pinned": false})?;

    Ok(())
}


pub fn remove_note(id : u64, db: &Connection) ->Result<(), rusqlite::Error> {
    let mut statement = db.prepare("
        DELETE FROM notes
        WHERE id = @id;
    ")?;
    statement.execute(named_params! {"@id": id})?;

    Ok(())
}

pub fn clear_notes(db: &Connection) ->Result<(), rusqlite::Error> {
    let mut statement = db.prepare("DELETE FROM notes")?;
    statement.execute(named_params! {})?;
    Ok(())
}



pub fn get_all_notes(db: &Connection) -> Result<Vec<Note>, rusqlite::Error> {
    let mut statement = db.prepare("SELECT * FROM notes")?;
    let mut rows = statement.query([])?;
    let mut notes = Vec::new();

    while let Some(row) = rows.next()? {
        let id: Option<u64> = row.get("id")?;
        let title: String = row.get("title")?;
        let text: String = row.get("text")?;
        let tag: String = row.get("tag")?;
        let date: String = row.get("date")?;
        let pinned: bool = row.get("pinned")?;

        let note = Note {
            id,
            title,
            text,
            tag,
            date,
            pinned,
        };

        notes.push(note);
    }

    Ok(notes)
}

pub fn get_notes_by_keyword(keyword: &str, db: &Connection) -> Result<Vec<Note>, rusqlite::Error> {
    let mut statement = db.prepare(
        "SELECT * FROM notes
        WHERE title LIKE @kw OR text LIKE @kw OR tag LIKE @kw OR date LIKE @kw"
    )?;

    let keyword_param = format!("%{}%", keyword);

    let mut rows = statement.query(named_params! {"@kw": keyword_param})?;
    let mut notes = Vec::new();

    while let Some(row) = rows.next()? {
        let id: Option<u64> = row.get("id")?;
        let title: String = row.get("title")?;
        let text: String = row.get("text")?;
        let tag: String = row.get("tag")?;
        let date: String = row.get("date")?;
        let pinned: bool = row.get("pinned")?;

        let note = Note {
            id,
            title,
            text,
            tag,
            date,
            pinned,
        };

        notes.push(note);
    }

    Ok(notes)
}