#ifndef STRING_UTILS_H
#define STRING_UTILS_H

#include <string>
#include <vector>

namespace avg {
namespace string_utils {

// String manipulation utilities
std::string trim(const std::string& str);
std::string toLower(const std::string& str);
std::string toUpper(const std::string& str);

// String splitting
std::vector<std::string> split(const std::string& str, char delimiter);
std::vector<std::string> split(const std::string& str, const std::string& delimiter);

// String joining
std::string join(const std::vector<std::string>& strings, const std::string& delimiter);

// String checking
bool startsWith(const std::string& str, const std::string& prefix);
bool endsWith(const std::string& str, const std::string& suffix);
bool contains(const std::string& str, const std::string& substr);

// String replacement
std::string replace(const std::string& str, const std::string& from, const std::string& to);
std::string replaceAll(const std::string& str, const std::string& from, const std::string& to);

// Encoding/Decoding
std::string urlEncode(const std::string& str);
std::string urlDecode(const std::string& str);

} // namespace string_utils
} // namespace avg

#endif // STRING_UTILS_H
