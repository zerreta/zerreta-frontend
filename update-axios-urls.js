/**
 * This script updates all frontend files to replace hardcoded backend URLs with axiosInstance
 * Run this script from the frontend directory with: node update-axios-urls.js
 */

const fs = require('fs');
const path = require('path');

// Files to update
const filesToUpdate = [
  'src/components/StudentLevels.js',
  'src/components/Students.js',
  'src/components/Leaderboard.js',
  'src/components/Analytics.js',
  'src/components/AdminDashboard.js',
  'src/components/Progress.js',
  'src/components/StudentPoints.js',
  'src/components/LeaderboardPage.js',
  'src/components/DashboardLayout.js',
  'src/components/StudentPages.js',
  'src/components/StudentData.js'
];

// Regular expressions for finding and replacing
const hardcodedUrlRegex = /['"`]http:\/\/localhost:5000(\/[^'"`]+)['"`]/g;
const axiosGetRegex = /await\s+axios\.get\(\s*['"`]http:\/\/localhost:5000(\/[^'"`]+)['"`]\s*,\s*\{([^}]*)\}\s*\)/g;
const axiosPostRegex = /await\s+axios\.post\(\s*['"`]http:\/\/localhost:5000(\/[^'"`]+)['"`]\s*,\s*([^,]+),\s*\{([^}]*)\}\s*\)/g;
const axiosPutRegex = /await\s+axios\.put\(\s*['"`]http:\/\/localhost:5000(\/[^'"`]+)['"`]\s*,\s*([^,]+),\s*\{([^}]*)\}\s*\)/g;
const axiosDeleteRegex = /await\s+axios\.delete\(\s*['"`]http:\/\/localhost:5000(\/[^'"`]+)['"`]\s*,\s*\{([^}]*)\}\s*\)/g;

// Import check and add
function addAxiosInstanceImport(content) {
  // Check if axiosInstance is already imported
  if (!content.includes('import axiosInstance from')) {
    // Find the import section
    const importLines = content.match(/import .+ from ['"].+['"];?\n/g) || [];
    
    if (importLines.length > 0) {
      const lastImport = importLines[importLines.length - 1];
      const lastImportIndex = content.lastIndexOf(lastImport) + lastImport.length;
      
      // Add axiosInstance import after the last import
      return content.slice(0, lastImportIndex) +
             'import axiosInstance from \'./axios-config\';\n' +
             content.slice(lastImportIndex);
    }
  }
  return content;
}

// Process a single file
function processFile(filePath) {
  try {
    console.log(`Processing file: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // Add axiosInstance import if needed
    if (content.includes('http://localhost:5000')) {
      const updatedContent = addAxiosInstanceImport(content);
      if (updatedContent !== content) {
        content = updatedContent;
        updated = true;
      }
    }
    
    // Replace hardcoded URLs with axiosInstance calls
    const newContent = content
      // Replace simple hardcoded URLs
      .replace(hardcodedUrlRegex, '`$1`')
      
      // Replace axios.get with axiosInstance.get
      .replace(axiosGetRegex, 'await axiosInstance.get(`$1`)') 
      
      // Replace axios.post with axiosInstance.post
      .replace(axiosPostRegex, 'await axiosInstance.post(`$1`, $2)')
      
      // Replace axios.put with axiosInstance.put
      .replace(axiosPutRegex, 'await axiosInstance.put(`$1`, $2)')
      
      // Replace axios.delete with axiosInstance.delete
      .replace(axiosDeleteRegex, 'await axiosInstance.delete(`$1`)');
    
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated: ${filePath}`);
      updated = true;
    }
    
    return updated;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return false;
  }
}

// Main function
function main() {
  let updatedCount = 0;
  
  for (const file of filesToUpdate) {
    const filePath = path.resolve(__dirname, file);
    if (fs.existsSync(filePath)) {
      const updated = processFile(filePath);
      if (updated) {
        updatedCount++;
      }
    } else {
      console.warn(`File not found: ${filePath}`);
    }
  }
  
  console.log(`Finished! Updated ${updatedCount} files.`);
}

main(); 