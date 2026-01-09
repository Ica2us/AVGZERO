#ifndef AVG_ENGINE_H
#define AVG_ENGINE_H

#include "game_state.h"
#include <string>

namespace avg {

class AVGEngine {
public:
    AVGEngine();
    ~AVGEngine();

    // Initialization
    bool init();
    void shutdown();

    // Script loading
    bool loadScript(const char* jsonData);

    // Navigation
    bool gotoNode(const char* nodeId);
    bool selectChoice(int choiceIndex);
    bool goBack();
    bool canGoBack() const;

    // Current node access
    const DialogueNode* getCurrentNode() const;
    std::string getCurrentNodeId() const;

    // Variables
    void setVariable(const char* name, int value);
    int getVariable(const char* name) const;

    // Save/Load
    std::string saveState() const;
    bool loadState(const char* saveData);

    // Reset
    void reset();

    GameState& getGameState() { return gameState; }
    const GameState& getGameState() const { return gameState; }

private:
    GameState gameState;
    bool initialized;
};

} // namespace avg

#endif // AVG_ENGINE_H
