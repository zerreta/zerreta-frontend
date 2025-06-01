import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Box, Container, Grid, Typography, Button, Paper, Card, CardContent,
  CircularProgress, IconButton, Tooltip
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CodeIcon from '@mui/icons-material/Code';
import ExtensionIcon from '@mui/icons-material/Extension';
import JavascriptIcon from '@mui/icons-material/Javascript';
import StorageIcon from '@mui/icons-material/Storage';
import FlagIcon from '@mui/icons-material/Flag';
import StopIcon from '@mui/icons-material/Stop';
import PetsIcon from '@mui/icons-material/Pets';
import SettingsIcon from '@mui/icons-material/Settings';
import MicIcon from '@mui/icons-material/Mic';
import ImageIcon from '@mui/icons-material/Image';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';
// Import the sidebar context
import { useSidebar } from '../context/SidebarContext';
// Import Prism.js for syntax highlighting
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css'; // Dark theme that resembles VS Code
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-sql';

// Import Blockly
import * as Blockly from 'blockly';
import 'blockly/blocks';
import * as BlocklyJS from 'blockly/javascript';
import 'blockly/python';

// Add console logs to verify imports
console.log("Blockly imported:", Boolean(Blockly));
console.log("Blockly.Blocks imported:", Boolean(Blockly.Blocks));
console.log("BlocklyJS imported:", Boolean(BlocklyJS));
console.log("BlocklyJS structure:", Object.keys(BlocklyJS));
console.log("JavaScript generator available:", Boolean(BlocklyJS.javascriptGenerator));

// Add some global styles for Blockly

// Global styles to ensure Blockly SVG elements display properly
const blocklyStyles = css`
  .blocklyToolboxDiv {
    background-color: #f9f9f9 !important;
    border-right: 1px solid #ddd;
    overflow-x: visible !important;
    overflow-y: auto !important;
    position: absolute;
    z-index: 70;
    transition: transform 0.3s ease;
  }
  
  .blocklyToolboxDiv.hidden {
    transform: translateX(-100%);
  }
  
  .blocklyFlyout {
    position: absolute;
    z-index: 60;
    transition: transform 0.3s ease;
  }
  
  .blocklyFlyout.hidden {
    transform: translateX(-100%);
  }
  
  .blocklyWorkspace {
    transition: margin-left 0.3s ease;
  }
  
  .blocklyMainBackground {
    stroke: none !important;
  }
  
  .blocklyTreeLabel {
    font-family: 'Comic Sans MS', 'Arial', sans-serif;
    font-size: 16px;
    padding: 0 8px;
  }
  
  .blocklyText {
    font-family: 'Comic Sans MS', 'Arial', sans-serif;
    font-size: 14px;
  }
  
  .blocklyTreeRow {
    height: 36px;
    line-height: 36px;
    margin-bottom: 4px;
    padding: 0 8px;
    border-radius: 8px;
    transition: background-color 0.1s ease;
  }
  
  .blocklyTreeRow:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  .blocklyTreeSelected {
    background-color: rgba(0, 0, 0, 0.1) !important;
  }

  /* Category specific colors to match Scratch */
  .blocklyTreeRow[aria-label*="Motion"] .blocklyTreeIcon {
    color: #4C97FF !important;
  }
  .blocklyTreeRow[aria-label*="Looks"] .blocklyTreeIcon {
    color: #9966FF !important;
  }
  .blocklyTreeRow[aria-label*="Sound"] .blocklyTreeIcon {
    color: #D65CD6 !important;
  }
  .blocklyTreeRow[aria-label*="Events"] .blocklyTreeIcon {
    color: #FFD500 !important;
  }
  .blocklyTreeRow[aria-label*="Control"] .blocklyTreeIcon {
    color: #FFAB19 !important;
  }
  .blocklyTreeRow[aria-label*="Sensing"] .blocklyTreeIcon {
    color: #4CBFE6 !important;
  }
  .blocklyTreeRow[aria-label*="Operators"] .blocklyTreeIcon {
    color: #40BF4A !important;
  }
  .blocklyTreeRow[aria-label*="Variables"] .blocklyTreeIcon {
    color: #FF8C1A !important;
  }
  .blocklyTreeRow[aria-label*="My Blocks"] .blocklyTreeIcon {
    color: #FF6680 !important;
  }

  /* Syntax highlighting for the code editor */
  .code-editor-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  /* Simplified code editor - using a single textarea for better cursor handling */
  .code-input {
    width: 100%;
    height: 100%;
    padding: 16px;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.6;
    tab-size: 2;
    color: #f8f8f2;
    background-color: #282a36;
    border: none;
    resize: none;
    outline: none;
  }

  /* Output styling */
  .code-output {
    font-family: 'Courier New', monospace;
    white-space: pre-wrap;
    line-height: 1.5;
    padding: 10px;
    overflow-y: auto;
    height: 100%;
    background-color: #f5f5f5;
    border-radius: 4px;
  }
  
  .output-success {
    color: #388e3c;
  }
  
  .output-error {
    color: #d32f2f;
    font-weight: bold;
  }
  
  .output-normal {
    color: #333;
  }
`;

const CodeEditorContainer = styled(Box)`
  display: flex;
  background-color: #282a36;
  color: #f8f8f2;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.spacing(1)};
  height: 600px;
`;

const LineNumbers = styled(Box)`
  width: 50px;
  padding: 16px 8px;
  padding-top: 16px;
  background-color: #2d2f3c;
  text-align: right;
  color: #6272a4;
  user-select: none;
  border-right: 1px solid #44475a;
  overflow: hidden;
  & > div {
    line-height: 1.6;
    height: 22.4px;
    font-size: 14px;
    margin-bottom: 0;
  }
`;

const OutputWindow = styled(Paper)`
  height: 600px;
  background-color: #f5f5f5;
  padding: ${({ theme }) => theme.spacing(2)};
  font-family: 'Courier New', monospace;
  overflow-y: auto;
  border-radius: ${({ theme }) => theme.spacing(1)};
  border: 1px solid #e0e0e0;
  font-size: 14px;
  line-height: 1.5;
`;

// Add Blockly workspace styling
const BlocklyContainer = styled(Box)`
  height: 500px;
  width: 100%;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  z-index: 1;
  
  & .injectionDiv {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
`;

// Demo code snippets and languages
const demoCodeSnippets = {
  python: '# Python Hello World\nprint("Hello, World!")',
  javascript: '// JavaScript Hello World\nconsole.log("Hello, World!");',
  sql: '-- SQL Query\nSELECT * FROM users WHERE age > 18;',
  blockly: '// Blockly code will be generated here'
};

// Add Blockly to languages
const languages = [
  {
    id: 'blockly',
    name: 'Scratch Blocks',
    extension: '.blk',
    description: 'Drag and drop blocks to create code - perfect for beginners and kids!',
    icon: <ExtensionIcon />,
    bgColor: '#FFECB3',
  },
  { 
    id: 'python', 
    name: 'Python', 
    extension: '.py',
    description: 'Popular language for beginners with simple, readable syntax',
    icon: <CodeIcon />,
    bgColor: '#E3F2FD',
  },
  { 
    id: 'javascript', 
    name: 'JavaScript', 
    extension: '.js',
    description: 'The language of the web, used for interactive websites',
    icon: <JavascriptIcon />,
    bgColor: '#FFF3E0',
  },
  { 
    id: 'sql', 
    name: 'SQL', 
    extension: '.sql',
    description: 'Query language used for database management',
    icon: <StorageIcon />,
    bgColor: '#E8F5E9',
  }
];

// Simple XML toolbox that's guaranteed to work
const BLOCKLY_TOOLBOX = `
<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
  <!-- Motion category (similar to Scratch motion) -->
  <category name="Motion" colour="#4C97FF" expanded="false">
    <block type="move_steps">
      <value name="STEPS">
        <shadow type="math_number">
          <field name="NUM">10</field>
        </shadow>
      </value>
    </block>
    <block type="math_arithmetic">
      <value name="A">
        <shadow type="math_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
      <value name="B">
        <shadow type="math_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
    </block>
    <block type="math_single">
      <value name="NUM">
        <shadow type="math_number">
          <field name="NUM">9</field>
        </shadow>
      </value>
    </block>
    <block type="math_trig">
      <value name="NUM">
        <shadow type="math_number">
          <field name="NUM">45</field>
        </shadow>
      </value>
    </block>
    <block type="math_constant"></block>
    <block type="math_round">
      <value name="NUM">
        <shadow type="math_number">
          <field name="NUM">3.1</field>
        </shadow>
      </value>
    </block>
  </category>

  <!-- Looks category (similar to Scratch looks) -->
  <category name="Looks" colour="#9966FF" expanded="false">
    <block type="text"></block>
    <block type="text_join">
      <mutation items="2"></mutation>
    </block>
    <block type="text_append">
      <value name="TEXT">
        <shadow type="text"></shadow>
      </value>
    </block>
    <block type="text_length">
      <value name="VALUE">
        <shadow type="text">
          <field name="TEXT">abc</field>
        </shadow>
      </value>
    </block>
    <block type="text_isEmpty">
      <value name="VALUE">
        <shadow type="text">
          <field name="TEXT"></field>
        </shadow>
      </value>
    </block>
    <block type="text_indexOf">
      <value name="VALUE">
        <block type="variables_get">
          <field name="VAR">text</field>
        </block>
      </value>
      <value name="FIND">
        <shadow type="text">
          <field name="TEXT">abc</field>
        </shadow>
      </value>
    </block>
    <block type="text_print">
      <value name="TEXT">
        <shadow type="text">
          <field name="TEXT">Hello world!</field>
        </shadow>
      </value>
    </block>
  </category>

  <!-- Sound category (similar to Scratch sound) -->
  <category name="Sound" colour="#D65CD6" expanded="false">
    <block type="play_sound">
      <field name="SOUND">meow</field>
    </block>
    <block type="text_prompt_ext">
      <value name="TEXT">
        <shadow type="text">
          <field name="TEXT">ABC</field>
        </shadow>
      </value>
    </block>
    <block type="stop_all_sounds"></block>
  </category>

  <!-- Events category (similar to Scratch events) -->
  <category name="Events" colour="#FFD500" expanded="false">
    <block type="when_flag_clicked"></block>
    <block type="when_key_pressed">
      <field name="KEY">space</field>
    </block>
    <block type="when_sprite_clicked"></block>
    <block type="procedures_defnoreturn">
      <field name="NAME">do something</field>
    </block>
    <block type="procedures_callnoreturn">
      <mutation name="do something"></mutation>
    </block>
  </category>

  <!-- Control category (similar to Scratch control) -->
  <category name="Control" colour="#FFAB19" expanded="false">
    <block type="controls_if"></block>
    <block type="controls_ifelse"></block>
    <block type="controls_repeat_ext">
      <value name="TIMES">
        <shadow type="math_number">
          <field name="NUM">10</field>
        </shadow>
      </value>
    </block>
    <block type="controls_whileUntil"></block>
    <block type="controls_for">
      <value name="FROM">
        <shadow type="math_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
      <value name="TO">
        <shadow type="math_number">
          <field name="NUM">10</field>
        </shadow>
      </value>
      <value name="BY">
        <shadow type="math_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
    </block>
    <block type="stop_this_script"></block>
  </category>

  <!-- Sensing category (similar to Scratch sensing) -->
  <category name="Sensing" colour="#4CBFE6" expanded="false">
    <block type="logic_compare"></block>
    <block type="logic_operation"></block>
    <block type="logic_negate"></block>
    <block type="logic_boolean"></block>
    <block type="logic_ternary"></block>
    <block type="logic_null"></block>
  </category>

  <!-- Operators category (similar to Scratch operators) -->
  <category name="Operators" colour="#40BF4A" expanded="false">
    <block type="math_modulo">
      <value name="DIVIDEND">
        <shadow type="math_number">
          <field name="NUM">64</field>
        </shadow>
      </value>
      <value name="DIVISOR">
        <shadow type="math_number">
          <field name="NUM">10</field>
        </shadow>
      </value>
    </block>
    <block type="math_constrain">
      <value name="VALUE">
        <shadow type="math_number">
          <field name="NUM">50</field>
        </shadow>
      </value>
      <value name="LOW">
        <shadow type="math_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
      <value name="HIGH">
        <shadow type="math_number">
          <field name="NUM">100</field>
        </shadow>
      </value>
    </block>
    <block type="math_random_int">
      <value name="FROM">
        <shadow type="math_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
      <value name="TO">
        <shadow type="math_number">
          <field name="NUM">100</field>
        </shadow>
      </value>
    </block>
    <block type="math_random_float"></block>
    <block type="math_on_list"></block>
  </category>

  <!-- Data category - Lists (similar to Scratch lists) -->
  <category name="Lists" colour="#FF661A" expanded="false">
    <block type="lists_create_with">
      <mutation items="0"></mutation>
    </block>
    <block type="lists_create_with">
      <mutation items="3"></mutation>
    </block>
    <block type="lists_repeat">
      <value name="NUM">
        <shadow type="math_number">
          <field name="NUM">5</field>
        </shadow>
      </value>
    </block>
    <block type="lists_length"></block>
    <block type="lists_isEmpty"></block>
    <block type="lists_indexOf">
      <value name="VALUE">
        <block type="variables_get">
          <field name="VAR">list</field>
        </block>
      </value>
    </block>
    <block type="lists_getIndex">
      <value name="VALUE">
        <block type="variables_get">
          <field name="VAR">list</field>
        </block>
      </value>
    </block>
    <block type="lists_setIndex">
      <value name="LIST">
        <block type="variables_get">
          <field name="VAR">list</field>
        </block>
      </value>
    </block>
    <block type="lists_getSublist">
      <value name="LIST">
        <block type="variables_get">
          <field name="VAR">list</field>
        </block>
      </value>
    </block>
    <block type="lists_split">
      <value name="DELIM">
        <shadow type="text">
          <field name="TEXT">,</field>
        </shadow>
      </value>
    </block>
    <block type="lists_sort"></block>
  </category>

  <!-- Variables category (similar to Scratch variables) -->
  <category name="Variables" colour="#FF8C1A" custom="VARIABLE"></category>

  <!-- Functions category (similar to Scratch "My Blocks") -->
  <category name="My Blocks" colour="#FF6680" custom="PROCEDURE"></category>
</xml>
`;

const ScratchHeader = styled(Box)`
  background-color: #8A5AE1;
  color: white;
  padding: 8px 16px;
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const GreenFlagButton = styled(IconButton)`
  background-color: #4CBB17;
  color: white;
  &:hover {
    background-color: #3CA017;
  }
  margin-right: 10px;
`;

const ScratchStage = styled(Box)`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const SpriteThumbnail = styled(Box)`
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  margin: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    background-color: #e5e5e5;
  }
`;

// Initialize custom Blockly blocks
const initCustomBlocks = () => {
  if (typeof window !== 'undefined') {
    // If Blockly is already loaded, use it directly
    if (Blockly && Blockly.Blocks) {
      // Define the "when flag clicked" block
      Blockly.Blocks['when_flag_clicked'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("when")
              .appendField(new Blockly.FieldImage(
                  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjNENCQjE3IiBkPSJNMTQuNCAzTDEzLjggOEgyMFYxMkgxMy44TDE0LjQgMTdIOEw1IDEwTDggM0gxNC40WiIvPjwvc3ZnPg==",
                  15, 15, { alt: "flag", flipRtl: false }))
              .appendField("clicked");
          this.setNextStatement(true, null);
          this.setColour(230);
          this.setTooltip("Runs the blocks below when the green flag is clicked");
          this.setHelpUrl("");
        }
      };
      
      // Define "move steps" block
      Blockly.Blocks['move_steps'] = {
        init: function() {
          this.appendValueInput("STEPS")
              .setCheck("Number")
              .appendField("move")
              .appendField(new Blockly.FieldNumber(10), "STEPS")
              .appendField("steps");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(160);
          this.setTooltip("Moves the sprite forward by the specified number of steps");
          this.setHelpUrl("");
        }
      };
      
      // Define "play sound" block
      Blockly.Blocks['play_sound'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("play sound")
              .appendField(new Blockly.FieldDropdown([
                  ["meow", "meow"],
                  ["pop", "pop"],
                  ["click", "click"]
              ]), "SOUND");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(300);
          this.setTooltip("Plays the selected sound");
          this.setHelpUrl("");
        }
      };
      
      // Define "stop all sounds" block
      Blockly.Blocks['stop_all_sounds'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("stop all sounds");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour(300);
          this.setTooltip("Stops all sounds that are playing");
          this.setHelpUrl("");
        }
      };
      
      // Define "when key pressed" block
      Blockly.Blocks['when_key_pressed'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("when")
              .appendField(new Blockly.FieldDropdown([
                  ["space", "space"],
                  ["up arrow", "up"],
                  ["down arrow", "down"],
                  ["right arrow", "right"],
                  ["left arrow", "left"],
                  ["any", "any"]
              ]), "KEY")
              .appendField("key pressed");
          this.setNextStatement(true, null);
          this.setColour(230);
          this.setTooltip("Runs the blocks below when the specified key is pressed");
          this.setHelpUrl("");
        }
      };
      
      // Define "when sprite clicked" block
      Blockly.Blocks['when_sprite_clicked'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("when this sprite clicked");
          this.setNextStatement(true, null);
          this.setColour(230);
          this.setTooltip("Runs the blocks below when this sprite is clicked");
          this.setHelpUrl("");
        }
      };
      
      // Define "stop this script" block
      Blockly.Blocks['stop_this_script'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("stop this script");
          this.setPreviousStatement(true, null);
          this.setColour(350);
          this.setTooltip("Stops this script");
          this.setHelpUrl("");
        }
      };
      
      // Determine which JavaScript generator to use
      const jsGenerator = BlocklyJS.javascriptGenerator;
      
      if (jsGenerator) {
        console.log("JavaScript generator found:", jsGenerator);
        
        // Add JavaScript generator stubs for the custom blocks
        jsGenerator['when_flag_clicked'] = function(block) {
          return '// When flag clicked\n';
        };
        
        jsGenerator['move_steps'] = function(block) {
          const steps = block.getFieldValue('STEPS');
          return `console.log("Move ${steps} steps");\n`;
        };
        
        jsGenerator['play_sound'] = function(block) {
          const sound = block.getFieldValue('SOUND');
          return `console.log("Play sound: ${sound}");\n`;
        };
        
        jsGenerator['stop_all_sounds'] = function(block) {
          return 'console.log("Stop all sounds");\n';
        };
        
        jsGenerator['when_key_pressed'] = function(block) {
          const key = block.getFieldValue('KEY');
          return `// When ${key} key pressed\n`;
        };
        
        jsGenerator['when_sprite_clicked'] = function(block) {
          return '// When sprite clicked\n';
        };
        
        jsGenerator['stop_this_script'] = function(block) {
          return 'return;\n';
        };
        
        console.log("Custom blocks initialized successfully");
      } else {
        console.error("JavaScript generator not found");
      }
    } else {
      console.error("Blockly or Blockly.Blocks is not available");
    }
  }
};

// Function to load Skulpt for Python interpretation
const loadSkulpt = () => {
  return new Promise((resolve, reject) => {
    // Check if Skulpt is already loaded
    if (window.Sk) {
      resolve();
      return;
    }

    console.log("Loading Skulpt...");
    
    // Load Skulpt runtime
    const skulptScript = document.createElement('script');
    skulptScript.src = 'https://skulpt.org/js/skulpt.min.js';
    skulptScript.async = true;

    // Load Skulpt standard lib
    const skulptStdlibScript = document.createElement('script');
    skulptStdlibScript.src = 'https://skulpt.org/js/skulpt-stdlib.js';
    skulptStdlibScript.async = true;

    // Handle loading
    skulptScript.onload = () => {
      console.log("Skulpt main loaded");
      skulptStdlibScript.onload = () => {
        console.log("Skulpt stdlib loaded");
        resolve();
      };
      skulptStdlibScript.onerror = (e) => {
        console.error("Failed to load Skulpt standard library", e);
        reject(new Error('Failed to load Skulpt standard library'));
      };
    };
    skulptScript.onerror = (e) => {
      console.error("Failed to load Skulpt", e);
      reject(new Error('Failed to load Skulpt'));
    };

    // Append to document
    document.body.appendChild(skulptScript);
    document.body.appendChild(skulptStdlibScript);
  });
};

// Apply color syntax highlighting
const applySyntaxColoring = (text, language) => {
  // Simplified syntax highlighting with regex
  if (language === 'python') {
    return text
      // Keywords
      .replace(/\b(def|class|if|else|elif|for|while|import|from|as|try|except|finally|with|return|yield|break|continue|pass|True|False|None)\b/g, '<span style="color: #ff79c6;">$1</span>')
      // Numbers
      .replace(/\b(\d+(\.\d+)?)\b/g, '<span style="color: #bd93f9;">$1</span>')
      // Strings (single and double quotes)
      .replace(/(["'])(.*?)\1/g, '<span style="color: #f1fa8c;">$1$2$1</span>')
      // Comments
      .replace(/(#.*)$/gm, '<span style="color: #6272a4;">$1</span>')
      // Function calls
      .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\(/g, '<span style="color: #50fa7b;">$1</span>(');
  } else if (language === 'javascript') {
    return text
      // Keywords
      .replace(/\b(var|let|const|function|if|else|for|while|return|new|this|class|import|export|from|true|false|null|undefined)\b/g, '<span style="color: #ff79c6;">$1</span>')
      // Numbers
      .replace(/\b(\d+(\.\d+)?)\b/g, '<span style="color: #bd93f9;">$1</span>')
      // Strings (single and double quotes)
      .replace(/(["'])(.*?)\1/g, '<span style="color: #f1fa8c;">$1$2$1</span>')
      // Comments
      .replace(/(\/\/.*)$/gm, '<span style="color: #6272a4;">$1</span>')
      // Function calls
      .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\(/g, '<span style="color: #50fa7b;">$1</span>(');
  } else {
    return text;
  }
};

const Codezy = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [currentFile, setCurrentFile] = useState(null);
  const [code, setCode] = useState('');
  const [files, setFiles] = useState([]);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const blocklyWorkspaceRef = useRef(null);
  const blocklyDivRef = useRef(null);
  const codeInputRef = useRef(null);
  const [pythonInterpreterReady, setPythonInterpreterReady] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState('');
  
  // Get the main sidebar toggle function from context
  const { toggleMainSidebar } = useSidebar();
  
  // Load Skulpt for Python interpretation
  useEffect(() => {
    loadSkulpt()
      .then(() => {
        console.log("Skulpt loaded successfully");
        setPythonInterpreterReady(true);
      })
      .catch(error => {
        console.error("Error loading Skulpt:", error);
        setOutput("Failed to load Python interpreter: " + error.message);
      });
  }, []);

  // Update syntax highlighting when code changes
  useEffect(() => {
    if (currentFile) {
      const highlighted = applySyntaxColoring(code, currentFile.language);
      setHighlightedCode(highlighted);
    }
  }, [code, currentFile]);
  
  // Auto-hide main sidebar when Blockly is selected
  useEffect(() => {
    // If current file is Blockly type, hide the main sidebar
    if (currentFile?.language === 'blockly') {
      toggleMainSidebar(false); // Pass false to explicitly hide
    } else {
      // Show sidebar for other languages
      toggleMainSidebar(true);
    }
    
    // Cleanup - restore sidebar when component unmounts
    return () => {
      toggleMainSidebar(true);
    };
  }, [currentFile?.language, toggleMainSidebar]);
  
  // Initialize Blockly workspace when needed
  useEffect(() => {
    try {
      // Only initialize if we have a current file of type blockly and the div is available
      if (currentFile?.language === 'blockly' && blocklyDivRef.current) {
        console.log("Preparing to initialize Blockly...");
        
        // Clean up any existing workspace
        if (blocklyWorkspaceRef.current) {
          blocklyWorkspaceRef.current.dispose();
          blocklyWorkspaceRef.current = null;
        }
        
        // Ensure Blockly is fully loaded before initializing blocks
        if (Blockly && Blockly.Blocks) {
          // Initialize custom blocks
          initCustomBlocks();
          
          console.log("Initializing Blockly workspace...");
          
          try {
            // Parse the XML toolbox
            const toolboxXml = Blockly.utils.xml.textToDom(BLOCKLY_TOOLBOX);
            
            // Create a custom theme
            const kidTheme = Blockly.Theme.defineTheme('kidTheme', {
              'base': Blockly.Themes.Classic,
              'componentStyles': {
                'workspaceBackgroundColour': '#f5f5f5',
                'toolboxBackgroundColour': '#f9f9f9',
                'toolboxForegroundColour': '#333',
                'flyoutBackgroundColour': '#f2f2f2',
                'flyoutForegroundColour': '#333',
                'flyoutOpacity': 0.9,
                'scrollbarColour': '#ccc',
                'scrollbarOpacity': 0.8,
                'insertionMarkerColour': '#0a0',
                'insertionMarkerOpacity': 0.3,
                'markerColour': '#fc3',
                'cursorColour': '#fc3'
              },
              'fontStyle': {
                'family': 'Comic Sans MS, Arial, sans-serif',
                'weight': 'normal',
                'size': 14
              }
            });
            
            // Inject Blockly with XML toolbox
            blocklyWorkspaceRef.current = Blockly.inject(blocklyDivRef.current, {
              toolbox: toolboxXml,
              scrollbars: true,
              trashcan: true,
              sounds: false, // Disable sounds to prevent issues
              move: {
                scrollbars: {
                  horizontal: true,
                  vertical: true
                },
                drag: true,
                wheel: true
              },
              grid: {
                spacing: 20,
                length: 3,
                colour: '#ccc',
                snap: true
              },
              zoom: {
                controls: true,
                wheel: true,
                startScale: 0.8, // Start a bit zoomed out for better overview
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.2
              },
              media: 'https://blockly-demo.appspot.com/static/media/', // Use Blockly's CDN for media
              theme: kidTheme
            });
            
            console.log("Blockly workspace initialized successfully");
            
            // Add change listener to update code - but only when workspace content changes
            const workspaceChangeListener = function(event) {
              // Only generate code for real change events (not UI or selection events)
              if (event.type === Blockly.Events.BLOCK_CHANGE || 
                  event.type === Blockly.Events.BLOCK_CREATE ||
                  event.type === Blockly.Events.BLOCK_DELETE ||
                  event.type === Blockly.Events.BLOCK_MOVE) {
                
                if (blocklyWorkspaceRef.current) {
                  try {
                    // Determine which JavaScript generator to use
                    const jsGenerator = BlocklyJS.javascriptGenerator;
                    
                    if (jsGenerator) {
                      const jsCode = jsGenerator.workspaceToCode(blocklyWorkspaceRef.current);
                      setCode(jsCode);
                      
                      // Update current file code, but don't trigger a full re-render
                      if (currentFile) {
                        setFiles(prevFiles => 
                          prevFiles.map(file => 
                            file.id === currentFile.id ? { ...file, code: jsCode } : file
                          )
                        );
                      }
                    } else {
                      console.error("JavaScript generator not available for code generation");
                    }
                  } catch (e) {
                    console.error("Error generating code from blocks:", e);
                  }
                }
              }
            };
            
            // Add the event listener
            blocklyWorkspaceRef.current.addChangeListener(workspaceChangeListener);
            
            // Force resize to ensure proper rendering
            const resizeBlockly = () => {
              if (blocklyWorkspaceRef.current) {
                setTimeout(() => {
                  Blockly.svgResize(blocklyWorkspaceRef.current);
                  blocklyWorkspaceRef.current.scrollCenter(); // Center the workspace
                }, 0);
              }
            };
            
            // Initial resize
            resizeBlockly();
            
            // Also resize after a short delay to ensure everything is rendered
            setTimeout(resizeBlockly, 300);
          } catch (error) {
            console.error("Error initializing Blockly:", error);
          }
        } else {
          console.error("Blockly is not fully loaded yet");
        }
      }
    } catch (error) {
      console.error("Error in Blockly initialization:", error);
    }
    
    // Cleanup Blockly workspace when component unmounts or file changes
    return () => {
      if (blocklyWorkspaceRef.current) {
        blocklyWorkspaceRef.current.dispose();
        blocklyWorkspaceRef.current = null;
      }
    };
  }, [currentFile?.id]); // Add currentFile.id to dependencies
  
  // Resize Blockly workspace on window resize
  useEffect(() => {
    const handleResize = () => {
      if (blocklyWorkspaceRef.current) {
        Blockly.svgResize(blocklyWorkspaceRef.current);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Handle tab key in code editor
  const handleTabKey = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      
      // Get cursor position
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      
      // Insert 2 spaces at cursor position
      const newValue = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newValue);
      
      // Move cursor after inserted spaces
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };
  
  const handleGoBack = () => {
    navigate('/student-dashboard/extras');
  };
  
  const handleCreateFile = (language) => {
    const timestamp = new Date().getTime();
    const newFileName = `${language.name}${timestamp}${language.extension}`;
    
    const newFile = {
      id: timestamp,
      name: newFileName,
      language: language.id,
      code: demoCodeSnippets[language.id] || '// New file',
      createdAt: new Date(),
    };
    
    setFiles([...files, newFile]);
    setCurrentFile(newFile);
    setCode(newFile.code);
    setOutput('');
    
    // Reset Blockly workspace
    if (blocklyWorkspaceRef.current) {
      blocklyWorkspaceRef.current.dispose();
      blocklyWorkspaceRef.current = null;
    }
  };
  
  const handleCodeChange = (event) => {
    // Only allow code editing for non-blockly languages
    if (currentFile && currentFile.language !== 'blockly') {
    const newCode = event.target.value;
    setCode(newCode);
    
    if (currentFile) {
      const updatedFiles = files.map(file => 
        file.id === currentFile.id ? { ...file, code: newCode } : file
      );
      setFiles(updatedFiles);
      }
    }
  };
  
  // Function to handle Python output
  const outf = (text) => {
    console.log("Python output:", text);
    setOutput(prev => prev + text);
  };
  
  // Function to handle Python input (simple implementation)
  const inf = (prompt) => {
    return window.prompt(prompt);
  };
  
  // Configure Skulpt with improved error handling
  const configureSkulpt = () => {
    if (window.Sk) {
      console.log("Configuring Skulpt");
      window.Sk.configure({
        output: outf,
        read: window.Sk.builtinFiles.files,
        inputfun: inf,
        inputfunTakesPrompt: true,
        __future__: window.Sk.python3,
        exceptionHandler: (e) => {
          console.error("Python exception:", e);
          // Improved error handling with more user-friendly messages
          let errorMsg = e.toString();
          
          // Make EOF errors more understandable
          if (errorMsg.includes("EOF in multi-line statement")) {
            errorMsg = "Error: You have an unclosed parenthesis, bracket, or quotation mark. Check your code for missing closing characters.";
          }
          
          // Make indentation errors clearer
          if (errorMsg.includes("IndentationError")) {
            errorMsg = "Error: Your code has inconsistent indentation. Make sure all code blocks use the same number of spaces.";
          }
          
          setOutput(prev => prev + "\n" + errorMsg);
          setIsRunning(false);
          return true; // Return true to indicate we handled the exception
        }
      });
    } else {
      console.error("Skulpt is not available");
    }
  };
  
  const handleRunCode = () => {
    if (!currentFile) return;
    
    setIsRunning(true);
    setOutput(''); // Clear previous output
    
    console.log(`Running ${currentFile.language} code`);
    
    // Different execution based on language
    if (currentFile.language === 'python') {
      if (window.Sk && pythonInterpreterReady) {
        try {
          console.log("Python interpreter ready, running code:", code.substr(0, 50) + "...");
          configureSkulpt();
          
          // Add basic code validation before running
          const codeToRun = code.trim();
          
          // Check for some common syntax errors
          if ((codeToRun.split('(').length !== codeToRun.split(')').length) ||
              (codeToRun.split('[').length !== codeToRun.split(']').length) ||
              (codeToRun.split('{').length !== codeToRun.split('}').length)) {
            setOutput("Error: Your code has mismatched parentheses, brackets, or braces. Please fix them before running.");
            setIsRunning(false);
            return;
          }
          
          // Run Python code with improved error handling
          console.log("Running Python code with Skulpt");
          const programOutput = window.Sk.misceval.asyncToPromise(() => {
            return window.Sk.importMainWithBody("<stdin>", false, codeToRun, true);
          });
          
          programOutput.then(
            () => {
              console.log("Python execution successful");
              setIsRunning(false);
              if (!output) {
                setOutput("Program executed successfully with no output.");
              }
            },
            (error) => {
              console.error("Python execution error:", error);
              setIsRunning(false);
              // Let the exception handler handle this
            }
          );
        } catch (e) {
          console.error("Error running Python code:", e);
          setIsRunning(false);
          setOutput(`Error: ${e.toString()}`);
        }
      } else {
        console.error("Python interpreter not ready");
        setIsRunning(false);
        setOutput("Python interpreter is not ready. Please wait or reload the page.");
      }
    } else if (currentFile.language === 'blockly') {
      // Blockly code execution
      try {
        // For Blockly, we'll evaluate the JavaScript code
        const output = [];
        // Override console.log to capture output
        const originalLog = console.log;
        console.log = (...args) => {
          output.push(args.join(' '));
        };
        
        // Safely evaluate the code
        try {
          if (code) {
            new Function(code)();
          } else {
            output.push("No code generated from blocks yet");
          }
        } catch (error) {
          output.push(`Error: ${error.message}`);
        }
        
        // Restore console.log
        console.log = originalLog;
        
        setOutput(output.join('\n') || "Your blocks ran successfully!");
        setIsRunning(false);
      } catch (e) {
        setOutput(`Error: ${e.message}`);
        setIsRunning(false);
      }
    } else if (currentFile.language === 'javascript') {
      try {
        // For JavaScript, use console.capture to get the output
        const output = [];
        // Override console.log to capture output
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        
        console.log = (...args) => {
          output.push(args.join(' '));
          originalLog(...args);
        };
        
        console.error = (...args) => {
          output.push(`Error: ${args.join(' ')}`);
          originalError(...args);
        };
        
        console.warn = (...args) => {
          output.push(`Warning: ${args.join(' ')}`);
          originalWarn(...args);
        };
        
        // Execute JavaScript code
        try {
          new Function(code)();
        } catch (error) {
          output.push(`Error: ${error.message}`);
        }
        
        // Restore console functions
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;
        
        setOutput(output.join('\n') || "Code executed successfully (no output).");
        setIsRunning(false);
      } catch (e) {
        setOutput(`Error: ${e.message}`);
        setIsRunning(false);
      }
    } else {
      // For SQL or other languages we can add more interpreters later
      setOutput(`${currentFile.language.toUpperCase()} interpreter not implemented yet.`);
      setIsRunning(false);
    }
  };
  
  const LanguageCard = ({ language }) => (
    <Card 
      onClick={() => handleCreateFile(language)}
      sx={{
        cursor: 'pointer',
        bgcolor: language.bgColor,
        borderRadius: 2,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        height: '100%',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 3
        }
      }}
    >
      <CardContent sx={{ p: 3, height: '100%', position: 'relative' }}>
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ 
            color: 'rgb(226, 166, 59)', 
            fontWeight: 'bold', 
            fontSize: '14px',
            mb: 1,
            display: 'flex',
            alignItems: 'center'
          }}>
            <Box sx={{ 
              bgcolor: 'rgb(226, 166, 59)', 
              width: '10px', 
              height: '10px', 
              borderRadius: '50%',
              display: 'inline-block',
              mr: 0.5
            }} />
            Start Coding
          </Box>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {language.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '70%' }}>
            {language.description}
          </Typography>
        </Box>
        <Box sx={{ 
          position: 'absolute',
          bottom: 0,
          right: 0,
          p: 2
        }}>
          {React.cloneElement(language.icon, { style: { fontSize: 50, opacity: 0.8 } })}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Global styles={blocklyStyles} />
      <Box sx={{ p: 3 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
              sx={{
                borderColor: '#7445f8',
                color: '#7445f8',
                '&:hover': {
                  borderColor: '#5c33d4',
                  backgroundColor: 'rgba(116, 69, 248, 0.04)',
                }
              }}
            >
              Back to Extras
            </Button>
            </Box>
          </Box>
          
          {currentFile ? (
            // Code Editor View when a file is selected
            <>
              <Grid container spacing={3}>
                {/* Header for all coding views */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {currentFile.name}
                      </Typography>
                      <Box>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setCurrentFile(null);
                            setCode('');
                          }}
                          sx={{ mr: 1 }}
                        >
                          Back to Languages
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<PlayArrowIcon />}
                          onClick={handleRunCode}
                          disabled={isRunning}
                          sx={{ 
                            bgcolor: '#7445f8',
                            '&:hover': {
                              bgcolor: '#5c33d4',
                            }
                          }}
                        >
                          {isRunning ? 'Running...' : 'Run Code'}
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>

                {currentFile.language === 'blockly' ? (
                  // Scratch-like interface for block-based programming
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <ScratchHeader>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <GreenFlagButton size="small" onClick={() => handleRunCode()}>
                            <FlagIcon />
                          </GreenFlagButton>
                          <IconButton size="small" sx={{ color: 'white' }}>
                            <StopIcon />
                          </IconButton>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Button variant="contained" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                            Code
                          </Button>
                          <Button variant="contained" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                            <ImageIcon sx={{ mr: 1 }} /> Costumes
                          </Button>
                          <Button variant="contained" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                            <MicIcon sx={{ mr: 1 }} /> Sounds
                          </Button>
                        </Box>
                        <Box>
                          <IconButton size="small" sx={{ color: 'white' }}>
                            <SettingsIcon />
                          </IconButton>
                        </Box>
                      </ScratchHeader>
                      
                      <Grid container sx={{ mb: 2 }}>
                        <Grid item xs={8}>
                          <BlocklyContainer sx={{ height: '500px', borderRadius: '0 0 0 8px' }}>
                            <div 
                              ref={blocklyDivRef} 
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                position: 'absolute',
                                top: 0,
                                left: 0
                              }} 
                              id="blocklyDiv"
                              className="blocklyDiv"
                            />
                          </BlocklyContainer>
                        </Grid>
                        <Grid item xs={4}>
                          <ScratchStage sx={{ height: '300px', m: 1 }}>
                            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <PetsIcon sx={{ fontSize: 80, color: '#FF8C1A' }} />
                            </Box>
                            <Box sx={{ 
                              bgcolor: '#f9f9f9', 
                              p: 1, 
                              borderTop: '1px solid #ddd', 
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}>
                              <Typography variant="caption">Sprite1</Typography>
                              <Box>
                                <IconButton size="small">
                                  <FlagIcon sx={{ fontSize: 16, color: 'green' }} />
                                </IconButton>
                              </Box>
                            </Box>
                          </ScratchStage>
                          
                          <Box sx={{ 
                            bgcolor: '#f9f9f9', 
                            p: 1, 
                            m: 1,
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            height: '180px',
                            display: 'flex',
                            alignItems: 'start',
                            overflow: 'auto'
                          }}>
                            <SpriteThumbnail>
                              <PetsIcon sx={{ fontSize: 40, color: '#FF8C1A' }} />
                              <Typography variant="caption">Sprite1</Typography>
                            </SpriteThumbnail>
                            <IconButton size="small" sx={{ mt: 2, bgcolor: '#e0e0e0', width: 36, height: 36 }}>
                              +
                            </IconButton>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                ) : (
                  // Enhanced code editor with simplified structure to fix cursor issues
                  <>
                    <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 0, overflow: 'hidden' }}>
                    <CodeEditorContainer>
                      <LineNumbers>
                        {code.split('\n').map((_, i) => (
                          <div key={i}>{i + 1}</div>
                        ))}
                      </LineNumbers>
                      
                      <Box sx={{ flex: 1, height: '100%', position: 'relative' }}>
                        <textarea
                          ref={codeInputRef}
                          value={code}
                          onChange={handleCodeChange}
                          onKeyDown={handleTabKey}
                          className="code-input"
                          spellCheck="false"
                          autoComplete="off"
                          style={{
                            padding: '16px',
                            fontFamily: 'Courier New, monospace',
                            backgroundColor: '#282a36',
                            color: '#f8f8f2'
                          }}
                        />
                      </Box>
                    </CodeEditorContainer>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Output
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setOutput('')}
                        disabled={!output}
                      >
                        Clear
                      </Button>
                    </Box>
                  </Paper>
                  <OutputWindow>
                    {isRunning ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress size={30} sx={{ color: '#7445f8' }} />
                      </Box>
                    ) : (
                      <>
                        {output ? (
                          <Box className="code-output">
                            {output.split('\n').map((line, idx) => {
                              const className = line.startsWith('Error') 
                                ? 'output-error' 
                                : line.includes('successfully') 
                                  ? 'output-success' 
                                  : 'output-normal';
                              return <div key={idx} className={className}>{line}</div>;
                            })}
                          </Box>
                        ) : (
                          <Box sx={{ 
                            color: 'text.secondary', 
                            height: '100%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            flexDirection: 'column',
                            textAlign: 'center',
                            p: 2
                          }}>
                            <PlayArrowIcon sx={{ fontSize: 40, mb: 2, color: '#7445f8' }} />
                            <Typography>
                              {currentFile.language === 'python' ? 
                                "Write Python code and click Run to execute it!" : 
                                "Click \"Run Code\" to see the output here"}
                            </Typography>
                          </Box>
                        )}
                      </>
                    )}
                  </OutputWindow>
                </Grid>
              </>
            )}

            {/* Output section for Blockly (shown below the workspace) */}
            {currentFile.language === 'blockly' && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Output
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setOutput('')}
                      disabled={!output}
                    >
                      Clear
                    </Button>
                  </Box>
                </Paper>
                <OutputWindow sx={{ height: '200px' }}>
                {isRunning ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress size={30} sx={{ color: '#7445f8' }} />
                  </Box>
                ) : (
                  <>
                    {output ? (
                      <Box component="pre" sx={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                        {output}
                      </Box>
                    ) : (
                      <Box sx={{ 
                        color: 'text.secondary', 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flexDirection: 'column',
                        textAlign: 'center',
                        p: 2
                      }}>
                        <PlayArrowIcon sx={{ fontSize: 40, mb: 2, color: '#7445f8' }} />
                        <Typography>
                            Connect blocks and press Run to see what happens!
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              </OutputWindow>
            </Grid>
            )}
          </Grid>
        </>
      ) : (
        // Language Selection View
        <>
          <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 'bold' }}>
            Learn to Code
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
            Choose a programming language to start your coding journey
          </Typography>
          
          <Grid container spacing={3}>
            {languages.map(language => (
              <Grid item xs={12} sm={6} md={4} key={language.id}>
                <LanguageCard language={language} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  </Box>
</Box>
);
};


export default Codezy;
