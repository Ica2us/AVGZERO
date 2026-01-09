#ifndef DIALOGUE_NODE_H
#define DIALOGUE_NODE_H

#include <string>
#include <vector>

namespace avg {

enum class NodeType {
    DIALOGUE,
    CHOICE,
    SCENE,
    END
};

struct Choice {
    std::string text;
    std::string nextNodeId;

    Choice() = default;
    Choice(const std::string& t, const std::string& next)
        : text(t), nextNodeId(next) {}
};

struct DialogueNode {
    std::string id;
    NodeType type;
    std::string speaker;
    std::string text;
    std::string nextNodeId;
    std::vector<Choice> choices;

    // Scene information
    std::string background;
    std::string character;
    std::string characterExpression;
    std::string bgm;
    std::string soundEffect;

    DialogueNode() : type(NodeType::DIALOGUE) {}
};

} // namespace avg

#endif // DIALOGUE_NODE_H
