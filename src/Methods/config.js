import { invoke } from "@tauri-apps/api/tauri";

export const getConfig = async () => {
    return await invoke("get_config", {});
}

export const setConfig = async (config) => {
    if(!config.primary_color) return;
    return await invoke("set_config", {config});
}

export const getAverageColor = async () => {
    const {primary_color, secondary_color} = await getConfig();
    return hexColorAverage(primary_color,secondary_color);
}

