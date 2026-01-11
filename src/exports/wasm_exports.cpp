#include "wasm_exports.h"
#include "../core/avg_engine.h"
#include <cstring>
#include <cstdlib>

using namespace avg;

// Global engine instance
static AVGEngine* g_engine = nullptr;

// Global audio callbacks
static AudioPlayBGMCallback g_audio_play_bgm = nullptr;
static AudioPlaySECallback g_audio_play_se = nullptr;
static AudioStopBGMCallback g_audio_stop_bgm = nullptr;

// Helper to allocate and copy string
static char* allocateString(const std::string& str) {
    if (str.empty()) {
        return nullptr;
    }
    char* result = static_cast<char*>(malloc(str.length() + 1));
    if (result) {
        std::strcpy(result, str.c_str());
    }
    return result;
}

extern "C" {

int avg_init() {
    if (g_engine) {
        return 1; // Already initialized
    }

    g_engine = new AVGEngine();
    return g_engine->init() ? 1 : 0;
}

void avg_shutdown() {
    if (g_engine) {
        g_engine->shutdown();
        delete g_engine;
        g_engine = nullptr;
    }
}

int avg_load_script(const char* jsonData) {
    if (!g_engine || !jsonData) {
        return 0;
    }

    return g_engine->loadScript(jsonData) ? 1 : 0;
}

int avg_goto_node(const char* nodeId) {
    if (!g_engine || !nodeId) {
        return 0;
    }

    return g_engine->gotoNode(nodeId) ? 1 : 0;
}

int avg_select_choice(int choiceIndex) {
    if (!g_engine) {
        return 0;
    }

    return g_engine->selectChoice(choiceIndex) ? 1 : 0;
}

int avg_go_back() {
    if (!g_engine) {
        return 0;
    }

    return g_engine->goBack() ? 1 : 0;
}

int avg_can_go_back() {
    if (!g_engine) {
        return 0;
    }

    return g_engine->canGoBack() ? 1 : 0;
}

const char* avg_get_current_node_id() {
    if (!g_engine) {
        return nullptr;
    }

    static std::string nodeId;
    nodeId = g_engine->getCurrentNodeId();
    return nodeId.c_str();
}

const char* avg_get_node_type() {
    if (!g_engine) {
        return nullptr;
    }

    const DialogueNode* node = g_engine->getCurrentNode();
    if (!node) {
        return nullptr;
    }

    switch (node->type) {
        case NodeType::DIALOGUE: return "dialogue";
        case NodeType::CHOICE: return "choice";
        case NodeType::SCENE: return "scene";
        case NodeType::END: return "end";
        default: return "unknown";
    }
}

const char* avg_get_speaker() {
    if (!g_engine) {
        return nullptr;
    }

    const DialogueNode* node = g_engine->getCurrentNode();
    if (!node) {
        return nullptr;
    }

    return node->speaker.c_str();
}

const char* avg_get_text() {
    if (!g_engine) {
        return nullptr;
    }

    const DialogueNode* node = g_engine->getCurrentNode();
    if (!node) {
        return nullptr;
    }

    return node->text.c_str();
}

const char* avg_get_next_node_id() {
    if (!g_engine) {
        return nullptr;
    }

    const DialogueNode* node = g_engine->getCurrentNode();
    if (!node) {
        return nullptr;
    }

    return node->nextNodeId.c_str();
}

int avg_get_choice_count() {
    if (!g_engine) {
        return 0;
    }

    const DialogueNode* node = g_engine->getCurrentNode();
    if (!node) {
        return 0;
    }

    return static_cast<int>(node->choices.size());
}

const char* avg_get_choice_text(int index) {
    if (!g_engine) {
        return nullptr;
    }

    const DialogueNode* node = g_engine->getCurrentNode();
    if (!node || index < 0 || index >= static_cast<int>(node->choices.size())) {
        return nullptr;
    }

    return node->choices[index].text.c_str();
}

const char* avg_get_choice_next(int index) {
    if (!g_engine) {
        return nullptr;
    }

    const DialogueNode* node = g_engine->getCurrentNode();
    if (!node || index < 0 || index >= static_cast<int>(node->choices.size())) {
        return nullptr;
    }

    return node->choices[index].nextNodeId.c_str();
}

const char* avg_get_background() {
    if (!g_engine) {
        return nullptr;
    }

    const DialogueNode* node = g_engine->getCurrentNode();
    if (!node) {
        return nullptr;
    }

    return node->background.c_str();
}

const char* avg_get_character() {
    if (!g_engine) {
        return nullptr;
    }

    const DialogueNode* node = g_engine->getCurrentNode();
    if (!node) {
        return nullptr;
    }

    return node->character.c_str();
}

const char* avg_get_expression() {
    if (!g_engine) {
        return nullptr;
    }

    const DialogueNode* node = g_engine->getCurrentNode();
    if (!node) {
        return nullptr;
    }

    return node->characterExpression.c_str();
}

const char* avg_get_bgm() {
    if (!g_engine) {
        return nullptr;
    }

    const DialogueNode* node = g_engine->getCurrentNode();
    if (!node) {
        return nullptr;
    }

    return node->bgm.c_str();
}

const char* avg_get_sound_effect() {
    if (!g_engine) {
        return nullptr;
    }

    const DialogueNode* node = g_engine->getCurrentNode();
    if (!node) {
        return nullptr;
    }

    return node->soundEffect.c_str();
}

void avg_set_variable(const char* name, int value) {
    if (!g_engine || !name) {
        return;
    }

    g_engine->setVariable(name, value);
}

int avg_get_variable(const char* name) {
    if (!g_engine || !name) {
        return 0;
    }

    return g_engine->getVariable(name);
}

const char* avg_save_state() {
    if (!g_engine) {
        return nullptr;
    }

    static std::string saveData;
    saveData = g_engine->saveState();
    return saveData.c_str();
}

int avg_load_state(const char* saveData) {
    if (!g_engine || !saveData) {
        return 0;
    }

    return g_engine->loadState(saveData) ? 1 : 0;
}

void avg_reset() {
    if (!g_engine) {
        return;
    }

    g_engine->reset();
}

void avg_free_string(char* str) {
    if (str) {
        free(str);
    }
}

void avg_set_audio_play_bgm_callback(AudioPlayBGMCallback callback) {
    g_audio_play_bgm = callback;
}

void avg_set_audio_play_se_callback(AudioPlaySECallback callback) {
    g_audio_play_se = callback;
}

void avg_set_audio_stop_bgm_callback(AudioStopBGMCallback callback) {
    g_audio_stop_bgm = callback;
}

void avg_trigger_audio_from_node() {
    if (!g_engine) {
        return;
    }

    const DialogueNode* node = g_engine->getCurrentNode();
    if (!node) {
        return;
    }

    // Trigger BGM playback if BGM is set
    if (!node->bgm.empty() && g_audio_play_bgm) {
        g_audio_play_bgm(node->bgm.c_str(), 1); // 1 = loop enabled
    }

    // Trigger sound effect playback if SE is set
    if (!node->soundEffect.empty() && g_audio_play_se) {
        g_audio_play_se(node->soundEffect.c_str());
    }
}

} // extern "C"
