#ifndef SIMPLE_JSON_H
#define SIMPLE_JSON_H

#include <string>
#include <unordered_map>
#include <vector>

namespace avg {

// Simple JSON parser for basic needs
// This is a minimal implementation for parsing game scripts
class SimpleJSON {
public:
    SimpleJSON();
    ~SimpleJSON();

    bool parse(const char* jsonString);

    std::string getString(const std::string& key) const;
    int getInt(const std::string& key) const;
    bool getBool(const std::string& key) const;
    int getArraySize(const std::string& key) const;
    std::vector<std::string> getObjectKeys(const std::string& prefix) const;

    void clear();

private:
    std::unordered_map<std::string, std::string> data;

    void skipWhitespace(const char*& ptr);
    bool parseObject(const char*& ptr, const std::string& prefix);
    bool parseArray(const char*& ptr, const std::string& prefix);
    bool parseValue(const char*& ptr, std::string& value);
    bool parseString(const char*& ptr, std::string& value);
    bool parseNumber(const char*& ptr, std::string& value);
    std::string unescapeString(const std::string& str) const;
};

} // namespace avg

#endif // SIMPLE_JSON_H
