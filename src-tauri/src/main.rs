// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod database;
mod state;
mod config;

use state::{AppState, ServiceAccess};
use tauri::{State, Manager, AppHandle};
use database::Note;
use config::FrontendConfig;
use std::fs;


#[tauri::command]
fn get_notes(app_handle: AppHandle) -> Vec<Note> {
    let notes = app_handle.db(|db| database::get_all_notes(db)).unwrap();
    notes
}

#[tauri::command]
fn search_notes(app_handle: AppHandle, keyword: Option<String>) -> Vec<Note> {
    let notes = if let Some(kw) = keyword {
        app_handle
            .db(|db| database::get_notes_by_keyword(&kw, db))
            .unwrap()
    } else {
        app_handle.db(|db| database::get_all_notes(db)).unwrap()
    };

    notes
}

#[tauri::command]
fn unpin_all(app_handle: AppHandle) -> Vec<Note> {
    app_handle.db(|db| database::unpin_notes(db)).unwrap();
    let notes = app_handle.db(|db| database::get_all_notes(db)).unwrap();
    notes
}


#[tauri::command]
fn upsert_note(app_handle: AppHandle, note: Note, which: i32) -> Vec<Note> {
    if which == 1 {
        app_handle.db(|db| database::insert_note(&note, db)).unwrap();
    } else {
        app_handle.db(|db| database::update_note(&note, db)).unwrap();
    }

    let notes = app_handle.db(|db| database::get_all_notes(db)).unwrap();
    notes
}

#[tauri::command]
fn delete_note(app_handle: AppHandle, id: u64) -> Vec<Note> {
    app_handle.db(|db| database::remove_note(id, db)).unwrap();
    let notes = app_handle.db(|db| database::get_all_notes(db)).unwrap();
    notes
}

#[tauri::command]
fn delete_notes(app_handle: AppHandle) {
    app_handle.db(|db| database::clear_notes(db)).unwrap();
}


#[tauri::command]
fn get_config(app_handle: AppHandle) -> FrontendConfig {

    let app_dir = app_handle.path_resolver().app_data_dir().expect("The app data directory should exist.");
    fs::create_dir_all(&app_dir).expect("The app data directory should be created.");
    let config_file_path = app_dir.join("config.json").display().to_string();

    let frontend_config = if let Ok(config) = FrontendConfig::from_file(&config_file_path) {
        config
    } else {
        FrontendConfig::new("#DCC9B6", "#6D4C3D")
    };
    frontend_config
}

#[tauri::command]
fn set_config(app_handle: AppHandle, config : FrontendConfig) -> FrontendConfig {

    let app_dir = app_handle.path_resolver().app_data_dir().expect("The app data directory should exist.");
    fs::create_dir_all(&app_dir).expect("The app data directory should be created.");
    let config_file_path = app_dir.join("config.json");

    let serialized_config = serde_json::to_string_pretty(&config).unwrap();
    fs::write(config_file_path, serialized_config).expect("Unable to write to config file");
    config
}


fn main() {
    tauri::Builder::default()
        .manage(AppState { db: Default::default() })
        .invoke_handler(tauri::generate_handler![get_notes, search_notes, upsert_note, delete_note, delete_notes, unpin_all, get_config, set_config])
        .setup(|app| {
            let handle = app.handle();

            let app_state: State<AppState> = handle.state();
            let db = database::initialize_database(&handle).expect("Database initialize should succeed");
            *app_state.db.lock().unwrap() = Some(db);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}