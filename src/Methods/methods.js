import { invoke } from "@tauri-apps/api/tauri";

export const upsertNote = async (note, which) => {
  return await invoke("upsert_note", {note, which});
}

export const deleteNote = async (id) => {
  return await invoke("delete_note", {id});
}

export const getNotes = async () => {
  return await invoke("get_notes", {});
}

export const deleteNotes = async () => {
  await invoke("delete_notes", {});
}

export const unpinNotes = async () => {
  return await invoke("unpin_all", {});
}

export const searchNotes = async (keyword) => {
  return await invoke("search_notes", {keyword});
}
