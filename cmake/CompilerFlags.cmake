# Compiler flags configuration
# This file sets up compiler-specific flags and warnings

# Function to apply common compiler settings to a target
function(apply_compiler_settings TARGET_NAME)
    # Warning flags
    if(CMAKE_CXX_COMPILER_ID MATCHES "Clang|GNU")
        target_compile_options(${TARGET_NAME} PRIVATE
            -Wall
            -Wextra
            -Wpedantic
            -Wno-unused-parameter
            -Wconversion
            -Wsign-conversion
        )
    elseif(CMAKE_CXX_COMPILER_ID STREQUAL "MSVC")
        target_compile_options(${TARGET_NAME} PRIVATE
            /W4           # High warning level
            /wd4100       # Unreferenced formal parameter
            /wd4244       # Conversion warnings
            /permissive-  # Strict conformance
        )
        target_compile_definitions(${TARGET_NAME} PRIVATE
            _CRT_SECURE_NO_WARNINGS
            NOMINMAX      # Prevent min/max macros
        )
    endif()
endfunction()

# Print compiler info
message(STATUS "C++ Compiler: ${CMAKE_CXX_COMPILER_ID} ${CMAKE_CXX_COMPILER_VERSION}")
message(STATUS "Build Type: ${CMAKE_BUILD_TYPE}")
