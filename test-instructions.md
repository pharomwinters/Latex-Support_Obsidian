# Testing Your LaTeX Plugin

Your plugin has been updated and deployed! Here's how to test it:

## 🔄 **First: Restart Obsidian**
1. Close Obsidian completely
2. Reopen Obsidian 
3. Make sure the "LaTeX Support" plugin is enabled in Settings → Community Plugins

## 📝 **Test 1: Manual LaTeX View**
Since automatic .tex file opening might not work initially, let's test manually:

1. **Create a test file**: Create `test.tex` with this content:
   ```latex
   \documentclass{article}
   \begin{document}
   Hello LaTeX World!
   \end{document}
   ```

2. **Open with LaTeX view**:
   - Press `Ctrl+P` (Command Palette)
   - Type "Open LaTeX file" 
   - Select the command
   - OR use the new ribbon icon

## 📝 **Test 2: Check Plugin Loading**
1. Press `F12` (or `Ctrl+Shift+I`) to open Developer Tools
2. Look in the Console tab for any errors related to "LaTeX" or your plugin
3. If you see errors, please share them!

## 📝 **Test 3: Settings Panel**
1. Go to Settings → Community Plugins → LaTeX Support
2. Check if the settings panel opens without errors
3. Try changing some settings

## 📝 **Test 4: Compilation (if Tectonic is installed)**
1. Open a .tex file (or use the command to open it in LaTeX view)
2. Press `Ctrl+Shift+L` to compile
3. Check if a PDF is generated in the output folder

## 🐛 **If .tex files still don't open automatically:**

Try this workaround:
1. Right-click on a .tex file in the file explorer
2. Select "Open with..." if available
3. OR use the command palette: "Open LaTeX file"

## 📊 **What to Look For:**
- ✅ LaTeX syntax highlighting in the editor
- ✅ Settings panel works
- ✅ Ribbon icon appears
- ✅ Commands appear in command palette
- ✅ Compilation works (if Tectonic installed)

## 🆘 **If Something's Wrong:**
Share any error messages from the Developer Console! 