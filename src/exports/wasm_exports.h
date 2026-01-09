#ifndef WASM_EXPORTS_H
#define WASM_EXPORTS_H

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#define WASM_EXPORT EMSCRIPTEN_KEEPALIVE
#else
#define WASM_EXPORT
#endif

#ifdef __cplusplus
extern "C" {
#endif

// Engine lifecycle
WASM_EXPORT int avg_init();
WASM_EXPORT void avg_shutdown();

// Script loading
WASM_EXPORT int avg_load_script(const char* jsonData);

// Navigation
WASM_EXPORT int avg_goto_node(const char* nodeId);
WASM_EXPORT int avg_select_choice(int choiceIndex);
WASM_EXPORT int avg_go_back();
WASM_EXPORT int avg_can_go_back();

// Current node access
WASM_EXPORT const char* avg_get_current_node_id();
WASM_EXPORT const char* avg_get_node_type();
WASM_EXPORT const char* avg_get_speaker();
WASM_EXPORT const char* avg_get_text();
WASM_EXPORT const char* avg_get_next_node_id();
WASM_EXPORT int avg_get_choice_count();
WASM_EXPORT const char* avg_get_choice_text(int index);
WASM_EXPORT const char* avg_get_choice_next(int index);

// Scene data
WASM_EXPORT const char* avg_get_background();
WASM_EXPORT const char* avg_get_character();
WASM_EXPORT const char* avg_get_expression();
WASM_EXPORT const char* avg_get_bgm();
WASM_EXPORT const char* avg_get_sound_effect();

// Variables
WASM_EXPORT void avg_set_variable(const char* name, int value);
WASM_EXPORT int avg_get_variable(const char* name);

// Save/Load
WASM_EXPORT const char* avg_save_state();
WASM_EXPORT int avg_load_state(const char* saveData);

// Reset
WASM_EXPORT void avg_reset();

// Memory management
WASM_EXPORT void avg_free_string(char* str);

#ifdef __cplusplus
}
#endif

#endif // WASM_EXPORTS_H
