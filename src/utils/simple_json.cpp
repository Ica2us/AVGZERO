#include "simple_json.h"
#include <cstring>
#include <cctype>

namespace avg {

SimpleJSON::SimpleJSON() {
}

SimpleJSON::~SimpleJSON() {
}

bool SimpleJSON::parse(const char* jsonString) {
    if (!jsonString) {
        return false;
    }

    clear();
    const char* ptr = jsonString;
    skipWhitespace(ptr);

    if (*ptr != '{') {
        return false;
    }

    return parseObject(ptr, "");
}

std::string SimpleJSON::getString(const std::string& key) const {
    auto it = data.find(key);
    if (it != data.end()) {
        return unescapeString(it->second);
    }
    return "";
}

int SimpleJSON::getInt(const std::string& key) const {
    auto it = data.find(key);
    if (it != data.end()) {
        // Parse integer without exceptions
        const std::string& str = it->second;
        if (str.empty()) return 0;

        int result = 0;
        int sign = 1;
        size_t i = 0;

        if (str[0] == '-') {
            sign = -1;
            i = 1;
        } else if (str[0] == '+') {
            i = 1;
        }

        for (; i < str.length(); i++) {
            if (str[i] < '0' || str[i] > '9') break;
            result = result * 10 + (str[i] - '0');
        }

        return sign * result;
    }
    return 0;
}

bool SimpleJSON::getBool(const std::string& key) const {
    auto it = data.find(key);
    if (it != data.end()) {
        return it->second == "true";
    }
    return false;
}

int SimpleJSON::getArraySize(const std::string& key) const {
    int count = 0;
    std::string prefix = key + "[";
    for (const auto& pair : data) {
        if (pair.first.find(prefix) == 0) {
            // Only count direct array elements, not nested properties
            std::string suffix = pair.first.substr(prefix.length());
            // Check if this is a direct element (ends with ] or has ]. after the index)
            size_t bracketPos = suffix.find(']');
            if (bracketPos != std::string::npos) {
                std::string indexStr = suffix.substr(0, bracketPos);
                // Verify it's a number
                bool isNumber = !indexStr.empty();
                for (char c : indexStr) {
                    if (!std::isdigit(c)) {
                        isNumber = false;
                        break;
                    }
                }
                if (isNumber) {
                    int index = std::stoi(indexStr);
                    if (index >= count) {
                        count = index + 1;
                    }
                }
            }
        }
    }
    return count;
}

std::vector<std::string> SimpleJSON::getObjectKeys(const std::string& prefix) const {
    std::vector<std::string> keys;
    std::string searchPrefix = prefix.empty() ? "" : prefix + ".";

    for (const auto& pair : data) {
        if (searchPrefix.empty() || pair.first.find(searchPrefix) == 0) {
            std::string keyPart = pair.first.substr(searchPrefix.length());
            // Extract just the first key part (before any . or [)
            size_t dotPos = keyPart.find('.');
            size_t bracketPos = keyPart.find('[');
            size_t endPos = std::min(dotPos, bracketPos);
            if (endPos == std::string::npos) {
                endPos = keyPart.length();
            }
            std::string key = keyPart.substr(0, endPos);

            // Only add if it's a direct child and not already in the list
            if (!key.empty()) {
                bool found = false;
                for (const auto& k : keys) {
                    if (k == key) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    keys.push_back(key);
                }
            }
        }
    }

    return keys;
}

void SimpleJSON::clear() {
    data.clear();
}

void SimpleJSON::skipWhitespace(const char*& ptr) {
    while (*ptr && std::isspace(*ptr)) {
        ptr++;
    }
}

bool SimpleJSON::parseObject(const char*& ptr, const std::string& prefix) {
    if (*ptr != '{') {
        return false;
    }
    ptr++; // skip '{'

    skipWhitespace(ptr);

    while (*ptr && *ptr != '}') {
        skipWhitespace(ptr);

        // Parse key
        std::string key;
        if (!parseString(ptr, key)) {
            return false;
        }

        skipWhitespace(ptr);

        if (*ptr != ':') {
            return false;
        }
        ptr++; // skip ':'

        skipWhitespace(ptr);

        // Build full key path
        std::string fullKey = prefix.empty() ? key : prefix + "." + key;

        // Parse value
        if (*ptr == '{') {
            if (!parseObject(ptr, fullKey)) {
                return false;
            }
        } else if (*ptr == '[') {
            if (!parseArray(ptr, fullKey)) {
                return false;
            }
        } else {
            std::string value;
            if (!parseValue(ptr, value)) {
                return false;
            }
            data[fullKey] = value;
        }

        skipWhitespace(ptr);

        if (*ptr == ',') {
            ptr++;
        } else if (*ptr != '}') {
            return false;
        }
    }

    if (*ptr != '}') {
        return false;
    }
    ptr++; // skip '}'

    return true;
}

bool SimpleJSON::parseArray(const char*& ptr, const std::string& prefix) {
    if (*ptr != '[') {
        return false;
    }
    ptr++; // skip '['

    skipWhitespace(ptr);

    int index = 0;
    while (*ptr && *ptr != ']') {
        skipWhitespace(ptr);

        std::string indexKey = prefix + "[" + std::to_string(index) + "]";

        if (*ptr == '{') {
            if (!parseObject(ptr, indexKey)) {
                return false;
            }
        } else if (*ptr == '[') {
            if (!parseArray(ptr, indexKey)) {
                return false;
            }
        } else {
            std::string value;
            if (!parseValue(ptr, value)) {
                return false;
            }
            data[indexKey] = value;
        }

        index++;
        skipWhitespace(ptr);

        if (*ptr == ',') {
            ptr++;
        } else if (*ptr != ']') {
            return false;
        }
    }

    if (*ptr != ']') {
        return false;
    }
    ptr++; // skip ']'

    return true;
}

bool SimpleJSON::parseValue(const char*& ptr, std::string& value) {
    skipWhitespace(ptr);

    if (*ptr == '"') {
        return parseString(ptr, value);
    } else if (*ptr == '-' || std::isdigit(*ptr)) {
        return parseNumber(ptr, value);
    } else if (std::strncmp(ptr, "true", 4) == 0) {
        value = "true";
        ptr += 4;
        return true;
    } else if (std::strncmp(ptr, "false", 5) == 0) {
        value = "false";
        ptr += 5;
        return true;
    } else if (std::strncmp(ptr, "null", 4) == 0) {
        value = "";
        ptr += 4;
        return true;
    }

    return false;
}

bool SimpleJSON::parseString(const char*& ptr, std::string& value) {
    if (*ptr != '"') {
        return false;
    }
    ptr++; // skip '"'

    value.clear();
    while (*ptr && *ptr != '"') {
        if (*ptr == '\\') {
            ptr++;
            if (!*ptr) return false;

            switch (*ptr) {
                case '"': value += '"'; break;
                case '\\': value += '\\'; break;
                case '/': value += '/'; break;
                case 'b': value += '\b'; break;
                case 'f': value += '\f'; break;
                case 'n': value += '\n'; break;
                case 'r': value += '\r'; break;
                case 't': value += '\t'; break;
                default: value += *ptr; break;
            }
        } else {
            value += *ptr;
        }
        ptr++;
    }

    if (*ptr != '"') {
        return false;
    }
    ptr++; // skip '"'

    return true;
}

bool SimpleJSON::parseNumber(const char*& ptr, std::string& value) {
    value.clear();

    if (*ptr == '-') {
        value += *ptr++;
    }

    if (!std::isdigit(*ptr)) {
        return false;
    }

    while (*ptr && std::isdigit(*ptr)) {
        value += *ptr++;
    }

    if (*ptr == '.') {
        value += *ptr++;
        while (*ptr && std::isdigit(*ptr)) {
            value += *ptr++;
        }
    }

    if (*ptr == 'e' || *ptr == 'E') {
        value += *ptr++;
        if (*ptr == '+' || *ptr == '-') {
            value += *ptr++;
        }
        while (*ptr && std::isdigit(*ptr)) {
            value += *ptr++;
        }
    }

    return true;
}

std::string SimpleJSON::unescapeString(const std::string& str) const {
    // String is already unescaped during parsing
    return str;
}

} // namespace avg
