#include "game_state.h"
#include "../utils/simple_json.h"
#include <cstring>

namespace avg {

GameState::GameState() {
}

GameState::~GameState() {
}

void GameState::setCurrentNode(const std::string& nodeId) {
    currentNodeId = nodeId;
}

std::string GameState::getCurrentNodeId() const {
    return currentNodeId;
}

const DialogueNode* GameState::getCurrentNode() const {
    auto it = nodes.find(currentNodeId);
    if (it != nodes.end()) {
        return &it->second;
    }
    return nullptr;
}

bool GameState::loadScript(const char* jsonData) {
    return parseScript(jsonData);
}

bool GameState::addNode(const DialogueNode& node) {
    nodes[node.id] = node;
    return true;
}

const DialogueNode* GameState::getNode(const std::string& nodeId) const {
    auto it = nodes.find(nodeId);
    if (it != nodes.end()) {
        return &it->second;
    }
    return nullptr;
}

void GameState::setVariable(const std::string& name, int value) {
    variables[name] = value;
}

int GameState::getVariable(const std::string& name) const {
    auto it = variables.find(name);
    if (it != variables.end()) {
        return it->second;
    }
    return 0;
}

bool GameState::hasVariable(const std::string& name) const {
    return variables.find(name) != variables.end();
}

void GameState::pushHistory(const std::string& nodeId) {
    history.push_back(nodeId);
}

std::string GameState::popHistory() {
    if (history.empty()) {
        return "";
    }
    std::string nodeId = history.back();
    history.pop_back();
    return nodeId;
}

bool GameState::canGoBack() const {
    return !history.empty();
}

std::string GameState::serialize() const {
    // Simple serialization format
    std::string result = "{";
    result += "\"currentNode\":\"" + currentNodeId + "\",";
    result += "\"variables\":{";

    bool first = true;
    for (const auto& pair : variables) {
        if (!first) result += ",";
        result += "\"" + pair.first + "\":" + std::to_string(pair.second);
        first = false;
    }
    result += "},";

    result += "\"history\":[";
    first = true;
    for (const auto& nodeId : history) {
        if (!first) result += ",";
        result += "\"" + nodeId + "\"";
        first = false;
    }
    result += "]";
    result += "}";

    return result;
}

bool GameState::deserialize(const char* data) {
    // Parse JSON and restore state
    SimpleJSON json;
    if (!json.parse(data)) {
        return false;
    }

    // Restore current node
    std::string nodeId = json.getString("currentNode");
    if (!nodeId.empty()) {
        currentNodeId = nodeId;
    }

    // Restore variables - they are stored as "variables.varName": value
    variables.clear();
    std::vector<std::string> varKeys = json.getObjectKeys("variables");
    for (const auto& varName : varKeys) {
        std::string fullKey = "variables." + varName;
        int value = json.getInt(fullKey);
        variables[varName] = value;
    }

    // Restore history array
    history.clear();
    int historyCount = json.getArraySize("history");
    for (int i = 0; i < historyCount; i++) {
        std::string historyKey = "history[" + std::to_string(i) + "]";
        std::string historyNode = json.getString(historyKey);
        if (!historyNode.empty()) {
            history.push_back(historyNode);
        }
    }

    return true;
}

void GameState::reset() {
    currentNodeId.clear();
    variables.clear();
    history.clear();
}

bool GameState::parseScript(const char* jsonData) {
    SimpleJSON json;
    if (!json.parse(jsonData)) {
        return false;
    }

    // Parse nodes array
    int nodeCount = json.getArraySize("nodes");
    for (int i = 0; i < nodeCount; i++) {
        DialogueNode node;

        // Get node object
        std::string nodeKey = "nodes[" + std::to_string(i) + "]";

        node.id = json.getString(nodeKey + ".id");
        std::string typeStr = json.getString(nodeKey + ".type");

        if (typeStr == "dialogue") {
            node.type = NodeType::DIALOGUE;
        } else if (typeStr == "choice") {
            node.type = NodeType::CHOICE;
        } else if (typeStr == "scene") {
            node.type = NodeType::SCENE;
        } else if (typeStr == "end") {
            node.type = NodeType::END;
        }

        node.speaker = json.getString(nodeKey + ".speaker");
        node.text = json.getString(nodeKey + ".text");
        node.nextNodeId = json.getString(nodeKey + ".next");

        // Parse choices if present
        int choiceCount = json.getArraySize(nodeKey + ".choices");
        for (int j = 0; j < choiceCount; j++) {
            std::string choiceKey = nodeKey + ".choices[" + std::to_string(j) + "]";
            Choice choice;
            choice.text = json.getString(choiceKey + ".text");
            choice.nextNodeId = json.getString(choiceKey + ".next");
            node.choices.push_back(choice);
        }

        // Scene data
        node.background = json.getString(nodeKey + ".background");
        node.character = json.getString(nodeKey + ".character");
        node.characterExpression = json.getString(nodeKey + ".expression");
        node.bgm = json.getString(nodeKey + ".bgm");
        node.soundEffect = json.getString(nodeKey + ".se");

        addNode(node);

        // Set first node as current if not set
        if (currentNodeId.empty() && i == 0) {
            currentNodeId = node.id;
        }
    }

    return true;
}

} // namespace avg
