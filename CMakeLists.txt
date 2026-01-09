cmake_minimum_required(VERSION 3.20)
project(AVGEngine)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Include CMake modules
list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_SOURCE_DIR}/cmake")
include(cmake/CompilerFlags.cmake)

# Build options
option(BUILD_WASM "Build for WebAssembly" ON)
option(BUILD_TESTS "Build tests" OFF)

# Source files
set(CORE_SOURCES
    src/core/avg_engine.cpp
    src/core/game_state.cpp
    src/utils/simple_json.cpp
    src/utils/string_utils.cpp
    src/memory/allocator.cpp
    src/exports/wasm_exports.cpp
)

if(BUILD_WASM)
    include(cmake/Wasm.cmake)

    add_executable(avg_engine ${CORE_SOURCES})

    target_include_directories(avg_engine PRIVATE
        ${CMAKE_CURRENT_SOURCE_DIR}/src
        ${CMAKE_CURRENT_SOURCE_DIR}/third_party
    )

    # Emscripten outputs .js (which loads .wasm)
    set_target_properties(avg_engine PROPERTIES
        SUFFIX ".js"
        RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}"
    )
else()
    # Native build
    add_executable(avg_engine ${CORE_SOURCES} src/main.cpp)

    target_include_directories(avg_engine PRIVATE
        ${CMAKE_CURRENT_SOURCE_DIR}/src
        ${CMAKE_CURRENT_SOURCE_DIR}/third_party
    )
endif()

# Tests
if(BUILD_TESTS)
    add_subdirectory(tests/cpp)
endif()
