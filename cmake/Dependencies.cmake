# Dependencies configuration

# Add third-party libraries here

# Example: nlohmann JSON
set(JSON_INCLUDE_DIR "${CMAKE_SOURCE_DIR}/third_party/json/nlohmann")
if(EXISTS ${JSON_INCLUDE_DIR})
    message(STATUS "Found nlohmann/json at ${JSON_INCLUDE_DIR}")
else()
    message(WARNING "nlohmann/json not found. Using custom simple JSON parser.")
endif()
