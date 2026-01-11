cmake_minimum_required(VERSION 3.20)
project(AVGEngine VERSION 1.0.0 LANGUAGES CXX)

# C++ Standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Export compile commands for IDE support
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# Build options
option(BUILD_WASM "Build for WebAssembly using Emscripten" ON)
option(BUILD_TESTS "Build unit tests" OFF)
option(BUILD_SHARED_LIBS "Build shared libraries" OFF)

# Output directories
set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib)
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)

# Include CMake modules
list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_SOURCE_DIR}/cmake")

# Source files
set(CORE_SOURCES
    src/core/avg_engine.cpp
    src/core/game_state.cpp
    src/utils/simple_json.cpp
    src/utils/string_utils.cpp
    src/memory/allocator.cpp
)

set(CORE_HEADERS
    src/core/avg_engine.h
    src/core/game_state.h
    src/core/dialogue_node.h
    src/utils/simple_json.h
    src/utils/string_utils.h
    src/memory/allocator.h
)

# WASM exports (only for WASM build)
set(WASM_SOURCES
    src/exports/wasm_exports.cpp
)

set(WASM_HEADERS
    src/exports/wasm_exports.h
)

# Platform detection
if(EMSCRIPTEN)
    message(STATUS "Building for WebAssembly with Emscripten")
    set(BUILD_WASM ON)
endif()

if(BUILD_WASM)
    # Include WASM-specific configuration
    include(cmake/Wasm.cmake)

    # Create WASM executable
    add_executable(avg_engine ${CORE_SOURCES} ${WASM_SOURCES})

    target_include_directories(avg_engine PRIVATE
        ${CMAKE_CURRENT_SOURCE_DIR}/src
        ${CMAKE_CURRENT_SOURCE_DIR}/third_party
    )

    # Apply WASM-specific settings
    if(EMSCRIPTEN)
        apply_wasm_settings(avg_engine)
    endif()

    # Output settings for WASM
    set_target_properties(avg_engine PROPERTIES
        OUTPUT_NAME "avg_engine"
        SUFFIX ".js"
        RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}"
    )

else()
    # Native build - create static library
    add_library(avg_engine_lib STATIC ${CORE_SOURCES})

    target_include_directories(avg_engine_lib PUBLIC
        $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/src>
        $<INSTALL_INTERFACE:include>
    )

    # Compiler warnings for native build
    if(CMAKE_CXX_COMPILER_ID MATCHES "Clang|GNU")
        target_compile_options(avg_engine_lib PRIVATE
            -Wall -Wextra -Wpedantic -Wno-unused-parameter
        )
    elseif(MSVC)
        target_compile_options(avg_engine_lib PRIVATE
            /W4 /wd4100
        )
        target_compile_definitions(avg_engine_lib PRIVATE
            _CRT_SECURE_NO_WARNINGS
        )
    endif()

    # Create native test executable if main.cpp exists
    if(EXISTS "${CMAKE_CURRENT_SOURCE_DIR}/src/main.cpp")
        add_executable(avg_engine src/main.cpp)
        target_link_libraries(avg_engine PRIVATE avg_engine_lib)
    endif()
endif()

# Tests
if(BUILD_TESTS AND EXISTS "${CMAKE_CURRENT_SOURCE_DIR}/tests/cpp")
    enable_testing()
    add_subdirectory(tests/cpp)
endif()

# Install targets (for native build)
if(NOT BUILD_WASM)
    install(TARGETS avg_engine_lib
        ARCHIVE DESTINATION lib
        LIBRARY DESTINATION lib
        RUNTIME DESTINATION bin
    )

    install(FILES ${CORE_HEADERS}
        DESTINATION include/avg
    )
endif()

# Print configuration summary
message(STATUS "")
message(STATUS "AVG Engine Configuration:")
message(STATUS "  Version:      ${PROJECT_VERSION}")
message(STATUS "  Build Type:   ${CMAKE_BUILD_TYPE}")
message(STATUS "  Build WASM:   ${BUILD_WASM}")
message(STATUS "  Build Tests:  ${BUILD_TESTS}")
message(STATUS "  CMAKE BINARY DIR: ${CMAKE_BINARY_DIR}")
message(STATUS "  Compiler:     ${CMAKE_CXX_COMPILER_ID} ${CMAKE_CXX_COMPILER_VERSION}")
message(STATUS "")
