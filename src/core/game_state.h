#ifndef GAME_STATE_H
#define GAME_STATE_H

#include <string>
#include <unordered_map>
#include <vector>
#include "dialogue_node.h"

namespace avg {

class GameState {
public:
    GameState();
    ~GameState();

    // Navigation
    void setCurrentNode(const std::string& nodeId);
    std::string getCurrentNodeId() const;
    const DialogueNode* getCurrentNode() const;

    // Script management
    bool loadScript(const char* jsonData);
    bool addNode(const DialogueNode& node);
    const DialogueNode* getNode(const std::string& nodeId) const;

    // Variables (for game logic)
    void setVariable(const std::string& name, int value);
    int getVariable(const std::string& name) const;
    bool hasVariable(const std::string& name) const;

    // History
    void pushHistory(const std::string& nodeId);
    std::string popHistory();
    bool canGoBack() const;

    // Save/Load state
    std::string serialize() const;
    bool deserialize(const char* data);

    // Reset
    void reset();

private:
    std::string currentNodeId;
    std::unordered_map<std::string, DialogueNode> nodes;
    std::unordered_map<std::string, int> variables;
    std::vector<std::string> history;

    bool parseScript(const char* jsonData);
};

} // namespace avg

#endif // GAME_STATE_H
