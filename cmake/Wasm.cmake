# WebAssembly build configuration for Emscripten
# This file defines a function to apply WASM-specific settings to targets

# List of all exported C functions (must match wasm_exports.h)
set(AVG_EXPORTED_FUNCTIONS
    "_avg_init"
    "_avg_shutdown"
    "_avg_load_script"
    "_avg_goto_node"
    "_avg_select_choice"
    "_avg_go_back"
    "_avg_can_go_back"
    "_avg_get_current_node_id"
    "_avg_get_node_type"
    "_avg_get_speaker"
    "_avg_get_text"
    "_avg_get_next_node_id"
    "_avg_get_choice_count"
    "_avg_get_choice_text"
    "_avg_get_choice_next"
    "_avg_get_background"
    "_avg_get_character"
    "_avg_get_expression"
    "_avg_get_bgm"
    "_avg_get_sound_effect"
    "_avg_set_variable"
    "_avg_get_variable"
    "_avg_save_state"
    "_avg_load_state"
    "_avg_reset"
    "_avg_free_string"
    "_avg_set_audio_play_bgm_callback"
    "_avg_set_audio_play_se_callback"
    "_avg_set_audio_stop_bgm_callback"
    "_avg_trigger_audio_from_node"
    "_malloc"
    "_free"
)

# Runtime methods to export
set(AVG_EXPORTED_RUNTIME_METHODS
    "ccall"
    "cwrap"
    "UTF8ToString"
    "stringToUTF8"
    "lengthBytesUTF8"
    "addFunction"
)

# Convert lists to JSON array format for Emscripten
string(REPLACE ";" "','" EXPORTED_FUNCTIONS_STR "${AVG_EXPORTED_FUNCTIONS}")
set(EXPORTED_FUNCTIONS_JSON "['${EXPORTED_FUNCTIONS_STR}']")

string(REPLACE ";" "','" EXPORTED_RUNTIME_STR "${AVG_EXPORTED_RUNTIME_METHODS}")
set(EXPORTED_RUNTIME_JSON "['${EXPORTED_RUNTIME_STR}']")

# Function to apply WASM settings to a target
function(apply_wasm_settings TARGET_NAME)
    if(NOT EMSCRIPTEN)
        message(WARNING "apply_wasm_settings called but EMSCRIPTEN is not defined")
        return()
    endif()

    # Compiler options (apply to compilation units)
    target_compile_options(${TARGET_NAME} PRIVATE
        -fno-exceptions
        -fno-rtti
        $<$<CONFIG:Release>:-O3>
        $<$<CONFIG:Debug>:-O0 -g>
        $<$<CONFIG:RelWithDebInfo>:-O2 -g>
    )

    # Linker options (apply to final executable)
    target_link_options(${TARGET_NAME} PRIVATE
        # Core WASM settings
        "SHELL:-s WASM=1"
        "SHELL:-s ALLOW_MEMORY_GROWTH=1"
        "SHELL:-s MODULARIZE=1"
        "SHELL:-s EXPORT_NAME='AVGEngineModule'"
        "SHELL:-s ENVIRONMENT=web"

        # Memory settings
        "SHELL:-s INITIAL_MEMORY=16777216"   # 16MB
        "SHELL:-s MAXIMUM_MEMORY=134217728"  # 128MB

        # Function table settings (needed for addFunction)
        "SHELL:-s ALLOW_TABLE_GROWTH=1"
        "SHELL:-s RESERVED_FUNCTION_POINTERS=20"

        # Export functions
        "SHELL:-s EXPORTED_FUNCTIONS=${EXPORTED_FUNCTIONS_JSON}"
        "SHELL:-s EXPORTED_RUNTIME_METHODS=${EXPORTED_RUNTIME_JSON}"

        # Build type specific
        $<$<CONFIG:Release>:SHELL:-s ASSERTIONS=0>
        $<$<CONFIG:Release>:-O3>
        $<$<CONFIG:Debug>:SHELL:-s ASSERTIONS=1>
        $<$<CONFIG:Debug>:SHELL:-s SAFE_HEAP=1>
        $<$<CONFIG:Debug>:-O0>
        $<$<CONFIG:Debug>:-g>
    )

    message(STATUS "Applied WASM settings to target: ${TARGET_NAME}")
    message(STATUS "  Exported functions: ${AVG_EXPORTED_FUNCTIONS}")
endfunction()
