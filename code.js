// Airtable configuration
const AIRTABLE_API_KEY = 'patzUH6BjxUkKN0bA.6101cd9a5cc8bf17d091b0bee3b4a30c689de06f8ba998f8bb5d93e37653c87c';
const AIRTABLE_BASE_ID = 'appnRYSC7jy8V0Rtx';
const AIRTABLE_TABLE_NAME = 'Common Terms';

// State management
let currentPlatform = '';
let terms = [];

// Fetch terms from Airtable
async function fetchTerms(platform = '') {
    try {
        const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
        console.log('Fetching from URL:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
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
            term: record.fields.Content,
            platform: record.fields.Platform,
            approved: true,
            explanation: record.fields['Examples + Explanation']
        }));
        
        // Get unique platforms and send to UI
        const uniquePlatforms = [...new Set(terms.map(term => term.platform))].filter(Boolean);
        figma.ui.postMessage({ 
            type: 'update-platforms', 
            platforms: uniquePlatforms 
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
figma.showUI(__html__, { width: 400, height: 600 });

// Handle messages from UI
figma.ui.onmessage = async (msg) => {
    if (msg.type === 'platform-changed') {
        currentPlatform = msg.platform;
        const filteredTerms = filterTermsByPlatform(currentPlatform);
        updateTermsList(filteredTerms);
    } else if (msg.type === 'create-text') {
        await createTextNode(msg.text);
    } else if (msg.type === 'scan-frame') {
        await scanFrameForInvalidTerms();
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