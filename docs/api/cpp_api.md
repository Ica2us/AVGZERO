# C++ API Reference

## AVGEngine Class

### Initialization

```cpp
bool init()
```
Initializes the engine. Must be called before any other operations.

**Returns:** `true` if successful, `false` otherwise.

```cpp
void shutdown()
```
Shuts down the engine and frees resources.

### Script Management

```cpp
bool loadScript(const char* jsonData)
```
Loads a game script from JSON data.

**Parameters:**
- `jsonData`: JSON string containing the game script

**Returns:** `true` if successful, `false` otherwise.

### Navigation

```cpp
bool gotoNode(const char* nodeId)
```
Navigate to a specific node by ID.

**Parameters:**
- `nodeId`: ID of the target node

**Returns:** `true` if successful, `false` otherwise.

```cpp
bool selectChoice(int choiceIndex)
```
Select a choice and advance to the corresponding node.

**Parameters:**
- `choiceIndex`: Index of the choice (0-based)

**Returns:** `true` if successful, `false` otherwise.

```cpp
bool goBack()
```
Go back to the previous node in history.

**Returns:** `true` if successful, `false` otherwise.

```cpp
bool canGoBack() const
```
Check if going back is possible.

**Returns:** `true` if history is not empty, `false` otherwise.

### Data Access

```cpp
const DialogueNode* getCurrentNode() const
```
Get the current dialogue node.

**Returns:** Pointer to current node, or `nullptr` if none.

```cpp
std::string getCurrentNodeId() const
```
Get the ID of the current node.

**Returns:** Node ID string.

### Variables

```cpp
void setVariable(const char* name, int value)
```
Set a game variable.

**Parameters:**
- `name`: Variable name
- `value`: Variable value

```cpp
int getVariable(const char* name) const
```
Get a game variable value.

**Parameters:**
- `name`: Variable name

**Returns:** Variable value, or 0 if not found.

### Save/Load

```cpp
std::string saveState() const
```
Serialize the current game state to JSON.

**Returns:** JSON string containing the save data.

```cpp
bool loadState(const char* saveData)
```
Load game state from JSON.

**Parameters:**
- `saveData`: JSON string containing save data

**Returns:** `true` if successful, `false` otherwise.

### Reset

```cpp
void reset()
```
Reset the engine to initial state.

## DialogueNode Structure

```cpp
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
};
```

### NodeType Enum

```cpp
enum class NodeType {
    DIALOGUE,  // Regular dialogue
    CHOICE,    // Player choice
    SCENE,     // Scene change
    END        // End of game
};
```

### Choice Structure

```cpp
struct Choice {
    std::string text;
    std::string nextNodeId;
};
```

## WASM Exported Functions

These functions are exported for JavaScript:

```c
int avg_init()
int avg_shutdown()
int avg_load_script(const char* jsonData)
int avg_goto_node(const char* nodeId)
int avg_select_choice(int choiceIndex)
int avg_go_back()
int avg_can_go_back()
const char* avg_get_current_node_id()
const char* avg_get_node_type()
const char* avg_get_speaker()
const char* avg_get_text()
const char* avg_get_next_node_id()
int avg_get_choice_count()
const char* avg_get_choice_text(int index)
const char* avg_get_choice_next(int index)
const char* avg_get_background()
const char* avg_get_character()
const char* avg_get_expression()
const char* avg_get_bgm()
const char* avg_get_sound_effect()
void avg_set_variable(const char* name, int value)
int avg_get_variable(const char* name)
const char* avg_save_state()
int avg_load_state(const char* saveData)
void avg_reset()
```

**Note:** Functions returning `int` return 1 for success, 0 for failure.
