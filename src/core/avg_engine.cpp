#include "avg_engine.h"

namespace avg {

AVGEngine::AVGEngine() : initialized(false) {
}

AVGEngine::~AVGEngine() {
    shutdown();
}

bool AVGEngine::init() {
    if (initialized) {
        return true;
    }

    initialized = true;
    return true;
}

void AVGEngine::shutdown() {
    if (!initialized) {
        return;
    }

    gameState.reset();
    initialized = false;
}

bool AVGEngine::loadScript(const char* jsonData) {
    if (!initialized) {
        return false;
    }

    return gameState.loadScript(jsonData);
}

bool AVGEngine::gotoNode(const char* nodeId) {
    if (!initialized || !nodeId) {
        return false;
    }

    const DialogueNode* node = gameState.getNode(nodeId);
    if (!node) {
        return false;
    }

    // Save current node to history
    std::string currentId = gameState.getCurrentNodeId();
    if (!currentId.empty()) {
        gameState.pushHistory(currentId);
    }

    gameState.setCurrentNode(nodeId);
    return true;
}

bool AVGEngine::selectChoice(int choiceIndex) {
    if (!initialized) {
        return false;
    }

    const DialogueNode* currentNode = gameState.getCurrentNode();
    if (!currentNode) {
        return false;
    }

    if (choiceIndex < 0 || choiceIndex >= static_cast<int>(currentNode->choices.size())) {
        return false;
    }

    const Choice& choice = currentNode->choices[choiceIndex];
    return gotoNode(choice.nextNodeId.c_str());
}

bool AVGEngine::goBack() {
    if (!initialized) {
        return false;
    }

    std::string previousNodeId = gameState.popHistory();
    if (previousNodeId.empty()) {
        return false;
    }

    gameState.setCurrentNode(previousNodeId);
    return true;
}

bool AVGEngine::canGoBack() const {
    return gameState.canGoBack();
}

const DialogueNode* AVGEngine::getCurrentNode() const {
    if (!initialized) {
        return nullptr;
    }

    return gameState.getCurrentNode();
}

std::string AVGEngine::getCurrentNodeId() const {
    if (!initialized) {
        return "";
    }

    return gameState.getCurrentNodeId();
}

void AVGEngine::setVariable(const char* name, int value) {
    if (!initialized || !name) {
        return;
    }

    gameState.setVariable(name, value);
}

int AVGEngine::getVariable(const char* name) const {
    if (!initialized || !name) {
        return 0;
    }

    return gameState.getVariable(name);
}

std::string AVGEngine::saveState() const {
    if (!initialized) {
        return "";
    }

    return gameState.serialize();
}

bool AVGEngine::loadState(const char* saveData) {
    if (!initialized || !saveData) {
        return false;
    }

    return gameState.deserialize(saveData);
}

void AVGEngine::reset() {
    if (!initialized) {
        return;
    }

    gameState.reset();
}

} // namespace avg
