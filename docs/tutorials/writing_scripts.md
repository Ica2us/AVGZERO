# Writing Game Scripts

This guide explains how to write game scripts for the AVG Engine.

## Script Format

Scripts are written in JSON format with a list of nodes.

## Basic Structure

```json
{
  "title": "My Game",
  "version": "1.0.0",
  "startNode": "start",
  "nodes": [
    // Node definitions here
  ]
}
```

## Node Types

### Dialogue Node

Regular dialogue with text and speaker.

```json
{
  "id": "node1",
  "type": "dialogue",
  "speaker": "Character Name",
  "text": "This is what the character says.",
  "next": "node2"
}
```

### Choice Node

Present choices to the player.

```json
{
  "id": "choice1",
  "type": "choice",
  "text": "What will you do?",
  "choices": [
    {
      "text": "Option 1",
      "next": "node_option1"
    },
    {
      "text": "Option 2",
      "next": "node_option2"
    }
  ]
}
```

### Scene Node

Change scene without dialogue.

```json
{
  "id": "scene1",
  "type": "scene",
  "background": "new_background.jpg",
  "bgm": "new_music.mp3",
  "next": "node3"
}
```

### End Node

Mark the end of the game.

```json
{
  "id": "ending",
  "type": "end",
  "text": "The End"
}
```

## Node Properties

### Common Properties

- `id` (required): Unique identifier for the node
- `type` (required): Node type (dialogue, choice, scene, end)
- `next` (optional): ID of the next node

### Dialogue Properties

- `speaker`: Character name
- `text`: Dialogue text

### Visual Properties

- `background`: Background image filename
- `character`: Character sprite folder name
- `expression`: Character expression (normal, happy, sad, etc.)

### Audio Properties

- `bgm`: Background music filename (loops)
- `se`: Sound effect filename (plays once)

## Example: Complete Scene

```json
{
  "id": "morning_scene",
  "type": "dialogue",
  "speaker": "Protagonist",
  "text": "It's a beautiful morning!",
  "background": "bedroom.jpg",
  "character": "protagonist",
  "expression": "happy",
  "bgm": "morning_theme.mp3",
  "se": "bird_chirp.mp3",
  "next": "get_up"
}
```

## Branching Narratives

### Simple Branch

```json
{
  "id": "choice_breakfast",
  "type": "choice",
  "text": "What will you eat?",
  "choices": [
    {
      "text": "Toast",
      "next": "ate_toast"
    },
    {
      "text": "Cereal",
      "next": "ate_cereal"
    }
  ]
}
```

### Converging Paths

After different choices, paths can converge:

```json
// After eating toast
{
  "id": "ate_toast",
  "type": "dialogue",
  "text": "The toast was delicious!",
  "next": "go_to_school"
}

// After eating cereal
{
  "id": "ate_cereal",
  "type": "dialogue",
  "text": "The cereal was crunchy!",
  "next": "go_to_school"
}

// Common next node
{
  "id": "go_to_school",
  "type": "dialogue",
  "text": "Time to go to school.",
  "next": "school_scene"
}
```

## Best Practices

### 1. Use Descriptive IDs

Good:
```json
"id": "chapter1_morning_wake_up"
```

Bad:
```json
"id": "node1"
```

### 2. Plan Your Story Graph

Draw a flowchart before writing the script:

```
[Start] -> [Wake Up] -> [Choice: Breakfast]
                            ├-> [Toast] ----┐
                            └-> [Cereal] ---┤
                                            ↓
                                    [Go to School]
```

### 3. Keep Text Concise

- One or two sentences per dialogue node
- Split long monologues into multiple nodes
- Use choices to keep players engaged

### 4. Consistent Naming

```json
// Characters
"speaker": "Protagonist"  // Always capitalized
"character": "protagonist"  // Always lowercase

// Files
"background": "school_classroom.jpg"  // Descriptive names
"bgm": "theme_school.mp3"
```

### 5. Test Thoroughly

- Play through all branches
- Verify all node IDs exist
- Check that images/audio files are present
- Ensure no dead ends (except END nodes)

## Advanced Features

### Multiple Endings

```json
{
  "id": "final_choice",
  "type": "choice",
  "text": "This is your last chance...",
  "choices": [
    {"text": "Go left", "next": "ending_good"},
    {"text": "Go right", "next": "ending_bad"}
  ]
}

{
  "id": "ending_good",
  "type": "dialogue",
  "text": "You made the right choice! Good Ending.",
  "next": "end"
}

{
  "id": "ending_bad",
  "type": "dialogue",
  "text": "Oh no! Bad Ending.",
  "next": "end"
}
```

### Character Expressions

Create folders for each character with different expressions:

```
characters/
  protagonist/
    normal.png
    happy.png
    sad.png
    angry.png
    surprised.png
```

Then reference them:

```json
{
  "character": "protagonist",
  "expression": "happy"
}
```

## Validation

Use the script validator tool (coming soon) to check for:
- Missing node IDs
- Invalid references
- Orphaned nodes
- Missing assets

## Example: Complete Short Story

See `web/assets/data/script.json` for a complete example.

## Next Steps

- Learn about [Building for WASM](building_wasm.md)
- Explore the [JavaScript API](../api/js_api.md)
- Add custom UI elements
