// Database configurations
const DATABASES = {
    commonTerms: {
        apiKey: 'patzUH6BjxUkKN0bA.6101cd9a5cc8bf17d091b0bee3b4a30c689de06f8ba998f8bb5d93e37653c87c',
        baseId: 'appnRYSC7jy8V0Rtx',
        tableName: 'Common Terms',
        displayName: 'UX Writing Database',
        fields: {
            term: 'Content',
            platform: 'Platform',
            explanation: 'Examples + Explanation'
        }
    },
    sportsOnly: {
        apiKey: 'patWFLhwYW5LzMCuj.19660ab8da307b18041d3ba32385b511dc17d63b2ac042dbb7c875ec0d46297d',
        baseId: 'appcm9Wc6ykKgXxZG',
        tableName: 'Sports Only',
        displayName: 'Zone Tiles - Sports',
        fields: {
            term: 'Zone Name',
            platform: 'Platform',
            explanation: 'Examples + Explanation'
        }
    }
};

// State management
let currentDatabase = 'commonTerms';
let currentPlatform = '';
let terms = [];

// Fetch terms from selected database
async function fetchTerms(platform = '') {
    try {
        const dbConfig = DATABASES[currentDatabase];
        const url = `https://api.airtable.com/v0/${dbConfig.baseId}/${encodeURIComponent(dbConfig.tableName)}`;
        console.log('Fetching from URL:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${dbConfig.apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Airtable API Error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText,
                url: url
            });
            throw new Error(`Failed to fetch terms: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        
        if (!data.records || !Array.isArray(data.records)) {
            console.error('Invalid data format:', data);
            throw new Error('Invalid data format received from Airtable');
        }
        
        terms = data.records.map(record => ({
            id: record.id,
            term: record.fields[dbConfig.fields.term],
            platform: record.fields[dbConfig.fields.platform],
            approved: true,
            explanation: record.fields[dbConfig.fields.explanation]
        }));
        
        // Get unique platforms and send to UI
        const uniquePlatforms = [...new Set(terms.map(term => term.platform))].filter(Boolean);
        figma.ui.postMessage({ 
            type: 'update-platforms', 
            platforms: uniquePlatforms,
            currentDatabase: DATABASES[currentDatabase].displayName
        });
        
        console.log('Processed terms:', terms);
        return filterTermsByPlatform(platform);
    } catch (error) {
        console.error('Error fetching terms:', error);
        figma.ui.postMessage({ type: 'error', message: error.message });
        return [];
    }
}

// Filter terms by platform
function filterTermsByPlatform(platform) {
    if (!platform) return terms;
    return terms.filter(term => term.platform === platform);
}

// Create text node on canvas
async function createTextNode(text) {
    try {
        // Load a font
        await figma.loadFontAsync({ family: "Inter", style: "Regular" });
        
        // Create the text node
        const textNode = figma.createText();
        textNode.characters = text;
        
        // Position in the center of the viewport
        const center = figma.viewport.center;
        textNode.x = center.x - (textNode.width / 2);
        textNode.y = center.y - (textNode.height / 2);
        
        // Add to the current page
        figma.currentPage.appendChild(textNode);
        
        // Select the new text node
        figma.currentPage.selection = [textNode];
        
        // Zoom to fit
        figma.viewport.scrollAndZoomIntoView([textNode]);
        
        // Notify success
        figma.notify(`Added term: "${text}"`, { timeout: 1500 });
        
        return textNode;
    } catch (error) {
        console.error('Error creating text node:', error);
        figma.notify('Error creating text layer', { error: true });
        return null;
    }
}

// Validate selected text
async function validateSelectedText() {
    const selection = figma.currentPage.selection;
    if (selection.length !== 1 || selection[0].type !== 'TEXT') {
        return null;
    }
    
    const text = selection[0].characters;
    const matchingTerm = terms.find(term => 
        term.term.toLowerCase() === text.toLowerCase()
    );
    
    return matchingTerm;
}

// Function to get all text nodes in a frame
function getAllTextNodesInFrame(frame) {
    try {
        let textNodes = [];
        
        // If the node is a text node, add it
        if (frame.type === 'TEXT') {
            textNodes.push(frame);
            return textNodes;
        }
        
        // If the node has children, recursively get their text nodes
        if ('children' in frame) {
            for (const child of frame.children) {
                textNodes = textNodes.concat(getAllTextNodesInFrame(child));
            }
        }
        
        return textNodes;
    } catch (error) {
        console.error('Error in getAllTextNodesInFrame:', error);
        return [];
    }
}

// Function to find template placeholders in text nodes
function findTemplatePlaceholders(frame) {
    try {
        const textNodes = getAllTextNodesInFrame(frame);
        const placeholders = [];
        
        textNodes.forEach(node => {
            const text = node.characters;
            const nodeName = node.name;
            const dbConfig = DATABASES[currentDatabase];
            const fieldName = dbConfig.fields.term;
            const placeholder = `{{${fieldName}}}`;
            
            // Check both text content and layer name for placeholder
            if (text.includes(placeholder) || nodeName.includes(placeholder)) {
                placeholders.push({
                    node: node,
                    placeholder: placeholder,
                    originalText: text,
                    isNamePlaceholder: nodeName.includes(placeholder) && !text.includes(placeholder)
                });
            }
        });
        
        return placeholders;
    } catch (error) {
        console.error('Error finding template placeholders:', error);
        return [];
    }
}

// Function to get all unique fonts used in a frame
function getAllFontsInFrame(frame) {
    try {
        const fonts = new Set();
        const textNodes = getAllTextNodesInFrame(frame);
        
        textNodes.forEach(node => {
            // Get the font name from the text node
            if (node.fontName && typeof node.fontName === 'object') {
                fonts.add(`${node.fontName.family}|${node.fontName.style}`);
            }
        });
        
        return Array.from(fonts).map(fontString => {
            const [family, style] = fontString.split('|');
            return { family, style };
        });
    } catch (error) {
        console.error('Error getting fonts in frame:', error);
        return [];
    }
}

// Function to create mocks from template
async function createMocksFromTemplate() {
    try {
        console.log('Starting mock creation...');
        const selection = figma.currentPage.selection;
        
        if (selection.length !== 1) {
            figma.notify('Please select a single frame or component to use as template', { error: true });
            return;
        }
        
        const template = selection[0];
        console.log('Template selected:', template.name);
        
        // Find placeholders in the template
        const placeholders = findTemplatePlaceholders(template);
        console.log('Found placeholders:', placeholders.length);
        
        if (placeholders.length === 0) {
            const dbConfig = DATABASES[currentDatabase];
            const fieldName = dbConfig.fields.term;
            figma.notify(`No {{${fieldName}}} placeholders found in template`, { error: true });
            return;
        }
        
        // Get all fonts used in the template and load them
        console.log('Loading fonts...');
        const fontsInTemplate = getAllFontsInFrame(template);
        console.log('Fonts found:', fontsInTemplate);
        
        // Load all fonts used in the template
        for (const font of fontsInTemplate) {
            try {
                console.log(`Loading font: ${font.family} ${font.style}`);
                await figma.loadFontAsync(font);
            } catch (fontError) {
                console.warn(`Failed to load font ${font.family} ${font.style}:`, fontError);
                // Try to load a fallback font
                try {
                    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
                } catch (fallbackError) {
                    console.error('Failed to load fallback font:', fallbackError);
                }
            }
        }
        
        // Get filtered terms based on current platform
        const filteredTerms = filterTermsByPlatform(currentPlatform);
        
        if (filteredTerms.length === 0) {
            figma.notify('No terms available for mock creation', { error: true });
            return;
        }
        
        console.log(`Creating ${filteredTerms.length} mocks...`);
        
        // Create mocks for each term
        const mocks = [];
        filteredTerms.forEach((term, index) => {
            const mock = template.clone();
            mock.name = `${template.name} - ${term.term}`;
            
            // Position mocks in a grid
            const spacing = 20;
            const cols = Math.ceil(Math.sqrt(filteredTerms.length));
            const row = Math.floor(index / cols);
            const col = index % cols;
            
            mock.x = template.x + (col * (template.width + spacing));
            mock.y = template.y + (row * (template.height + spacing));
            
            // Replace placeholders in the mock
            const mockPlaceholders = findTemplatePlaceholders(mock);
            mockPlaceholders.forEach(({ node, placeholder, originalText, isNamePlaceholder }) => {
                if (isNamePlaceholder) {
                    // If placeholder is in layer name, set the text content to the term
                    node.characters = term.term;
                } else {
                    // If placeholder is in text content, replace it
                    node.characters = originalText.replace(placeholder, term.term);
                }
            });
            
            figma.currentPage.appendChild(mock);
            mocks.push(mock);
        });
        
        // Select all created mocks
        figma.currentPage.selection = mocks;
        figma.viewport.scrollAndZoomIntoView(mocks);
        
        figma.notify(`Created ${mocks.length} mocks successfully!`, { timeout: 3000 });
        
    } catch (error) {
        console.error('Error creating mocks:', error);
        figma.notify(`Error creating mocks: ${error.message}`, { error: true });
    }
}

// Function to validate text against terms
function validateText(text) {
    try {
        if (!text || typeof text !== 'string') {
            console.log('Invalid text to validate:', text);
            return false;
        }
        
        const isValid = terms.some(term => 
            term.term.toLowerCase() === text.toLowerCase()
        );
        
        console.log(`Validating "${text}": ${isValid}`);
        return isValid;
    } catch (error) {
        console.error('Error in validateText:', error);
        return false;
    }
}

// Function to scan frame and validate text
async function scanFrameForInvalidTerms() {
    try {
        console.log('Starting scan...');
        const selection = figma.currentPage.selection;
        console.log('Current selection:', selection);

        if (selection.length === 0) {
            console.log('No selection found');
            figma.notify('Please select a frame or group to scan', { error: true });
            return;
        }

        if (selection.length !== 1) {
            console.log('Multiple items selected');
            figma.notify('Please select a single frame to scan', { error: true });
            return;
        }

        const frame = selection[0];
        console.log('Selected item type:', frame.type);

        if (frame.type !== 'FRAME' && frame.type !== 'GROUP') {
            console.log('Invalid selection type:', frame.type);
            figma.notify('Please select a frame or group to scan', { error: true });
            return;
        }

        // Load the font before modifying text
        await figma.loadFontAsync({ family: "Inter", style: "Regular" });

        // Get all text nodes in the frame
        console.log('Getting text nodes...');
        const textNodes = getAllTextNodesInFrame(frame);
        console.log('Found text nodes:', textNodes.length);

        if (textNodes.length === 0) {
            console.log('No text nodes found in frame');
            figma.notify('No text layers found in the selected frame', { timeout: 3000 });
            return;
        }
        
        // Validate each text node
        console.log('Validating text nodes...');
        const invalidTerms = textNodes
            .map(node => ({
                text: node.characters,
                node: node
            }))
            .filter(({ text }) => !validateText(text));

        console.log('Invalid terms found:', invalidTerms.length);

        if (invalidTerms.length === 0) {
            console.log('All terms are valid');
            figma.notify('All terms in the frame are valid!', { timeout: 3000 });
            return;
        }

        // Turn invalid terms red
        console.log('Highlighting invalid terms...');
        for (const { node } of invalidTerms) {
            node.fills = [{
                type: 'SOLID',
                color: { r: 1, g: 0, b: 0 }
            }];
        }

        // Create a summary message
        const invalidTexts = invalidTerms.map(({ text }) => `"${text}"`).join(', ');
        console.log('Invalid texts:', invalidTexts);
        
        figma.notify(`Found ${invalidTerms.length} invalid terms: ${invalidTexts}`, { 
            timeout: 5000,
            error: true 
        });

        // Send invalid terms to UI for display
        figma.ui.postMessage({ 
            type: 'invalid-terms-found', 
            terms: invalidTerms.map(({ text }) => text)
        });

    } catch (error) {
        console.error('Error in scanFrameForInvalidTerms:', error);
        figma.notify(`Error scanning frame: ${error.message}`, { error: true });
    }
}

// Update UI with terms
function updateTermsList(terms) {
    figma.ui.postMessage({ type: 'update-terms', terms });
}

// Update validation section
function updateValidationSection(term) {
    const validationSection = document.getElementById('validationSection');
    const validationResult = document.getElementById('validationResult');
    const suggestions = document.getElementById('suggestions');
    
    validationSection.style.display = 'block';
    
    if (term) {
        validationResult.className = `validation-section ${term.approved ? 'approved' : 'not-approved'}`;
        validationResult.textContent = term.approved ? '✓ Approved Term' : '✗ Not Approved Term';
        
        if (!term.approved) {
            const similarTerms = terms.filter(t => 
                t.approved && 
                t.platform === term.platform &&
                t.term.toLowerCase().includes(term.term.toLowerCase())
            );
            
            suggestions.innerHTML = '<h4>Suggested Terms:</h4>';
            similarTerms.forEach(similarTerm => {
                const suggestionElement = document.createElement('div');
                suggestionElement.className = 'suggestion-item';
                suggestionElement.textContent = similarTerm.term;
                suggestionElement.onclick = () => {
                    createTextNode(similarTerm.term);
                };
                suggestions.appendChild(suggestionElement);
            });
        } else {
            suggestions.innerHTML = '';
        }
    } else {
        validationSection.style.display = 'none';
    }
}

// Main plugin code
figma.showUI(__html__, { width: 450, height: 800 });

// Handle messages from UI
figma.ui.onmessage = async (msg) => {
    if (msg.type === 'platform-changed') {
        currentPlatform = msg.platform;
        const filteredTerms = filterTermsByPlatform(currentPlatform);
        updateTermsList(filteredTerms);
    } else if (msg.type === 'database-changed') {
        currentDatabase = msg.database;
        currentPlatform = '';
        const fetchedTerms = await fetchTerms();
        updateTermsList(fetchedTerms);
    } else if (msg.type === 'create-text') {
        await createTextNode(msg.text);
    } else if (msg.type === 'scan-frame') {
        await scanFrameForInvalidTerms();
    } else if (msg.type === 'create-mocks') {
        await createMocksFromTemplate();
    }
};

// Initial setup
async function initialize() {
    try {
        const fetchedTerms = await fetchTerms();
        updateTermsList(fetchedTerms);
        
        // Watch for selection changes
        figma.on('selectionchange', async () => {
            const term = await validateSelectedText();
            updateValidationSection(term);
        });
    } catch (error) {
        console.error('Initialization error:', error);
        figma.ui.postMessage({ type: 'error', message: 'Failed to initialize plugin: ' + error.message });
    }
}

initialize();