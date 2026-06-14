// MICKEY — entry point. Keeps the Windows console hidden in release builds.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    mickey_lib::run()
}
