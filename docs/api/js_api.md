# JavaScript API Reference

## AVGEngine Class

### Initialization

```javascript
async init(wasmPath)
```
Initialize the engine with the WASM module.

**Parameters:**
- `wasmPath`: Path to the WASM file

**Returns:** `Promise<boolean>` - true if successful

**Example:**
```javascript
await avgEngine.init('build/wasm/avg_engine.wasm');
```

### Script Management

```javascript
async loadScript(jsonData)
```
Load a game script.

**Parameters:**
- `jsonData`: JSON object or string

**Returns:** `Promise<boolean>` - true if successful

### Navigation

```javascript
gotoNode(nodeId)
```
Navigate to a specific node.

```javascript
selectChoice(choiceIndex)
```
Select a choice.

```javascript
goBack()
```
Go back to previous node.

```javascript
canGoBack()
```
Check if can go back.

### Data Access

```javascript
getCurrentNode()
```
Get current node data.

**Returns:** Object with node properties:
```javascript
{
  id: string,
  type: string,
  speaker: string,
  text: string,
  nextNodeId: string,
  background: string,
  character: string,
  expression: string,
  bgm: string,
  soundEffect: string,
  choices: Array<{text: string, nextNodeId: string}>
}
```

## Game Class

### Methods

```javascript
async init()
```
Initialize the game.

```javascript
async start()
```
Start the game.

```javascript
showMenu()
```
Show the menu.

```javascript
hideMenu()
```
Hide the menu.

```javascript
quickSave()
```
Quick save to slot 0.

```javascript
quickLoad()
```
Quick load from slot 0.

## AssetLoader

```javascript
async loadImage(url)
```
Load an image.

```javascript
async loadAudio(url)
```
Load audio.

```javascript
async loadJSON(url)
```
Load JSON data.

## AudioManager

```javascript
async playBGM(url, loop = true)
```
Play background music.

```javascript
stopBGM()
```
Stop background music.

```javascript
async playSE(url)
```
Play sound effect.

```javascript
setBGMVolume(volume)
```
Set BGM volume (0-1).

```javascript
setSEVolume(volume)
```
Set SE volume (0-1).

## EventBus

```javascript
on(eventName, callback)
```
Subscribe to event.

```javascript
emit(eventName, data)
```
Emit event.

**Events:**
- `'scene-loaded'` - Scene loaded
- `'node-changed'` - Node changed
- `'choice-selected'` - Choice selected

## SaveSystem

```javascript
save(slotIndex, gameState)
```
Save to specific slot.

```javascript
load(slotIndex)
```
Load from specific slot.

```javascript
quickSave()
```
Quick save.

```javascript
quickLoad()
```
Quick load.

```javascript
getAllSaves()
```
Get all save slots info.
