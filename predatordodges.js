!function() {

    // Default settings
    let settings = {
        scriptActive: false,
        currentScript: 1,
    };

    // Create settings provider
    function createSettingsProvider() {
        let defaultValues = { scriptActive: false, currentScript: 1 };
        return new SettingsProvider(defaultValues, (newSettings) => {
            settings = newSettings;
        });
    }

    // Register the extension with StarMash
    SWAM.registerExtension({
        name: "Predator Dodges",
        id: "PredatorDodges",
        description: "Advanced dodging functionality for Starmash.",
        author: "Monarch",
        version: "1.0",
        settingsProvider: createSettingsProvider()
    });

    // Initialize dodging
    function initDodging() {
        let heldKey = null;
        let lastPressedKey = null;

        // Event listener for keydown
        document.addEventListener('keydown', function(event) {
            if (event.repeat) return; // Prevent repeating the action if the key is held down

            console.log(`Key pressed: ${event.key}, Code: ${event.code}`);

            // Start the script
            if (event.key === 'p') {
                settings.scriptActive = true;
                SWAM.showMessage("Predator dodges begins");
                console.log("Predator dodges begins");
            }
            // Pause the script
            else if (event.code === 'Pause') {
                settings.scriptActive = false;
                SWAM.showMessage("Predator dodges ends");
                console.log("Predator dodges ends");
            }

            // Switch between scripts
            if (settings.scriptActive && event.key >= '1' && event.key <= '9') {
                settings.currentScript = parseInt(event.key);
                console.log(`Switched to script ${settings.currentScript}`);
            } else if (settings.scriptActive && event.key === '0') {
                settings.currentScript = 10;
                console.log(`Switched to script ${settings.currentScript}`);
            }

            // Execute the current script with 'q' and 'e'
            if (settings.scriptActive && (event.key === 'q' || event.key === 'e')) {
                let arrowSide = event.key === 'q' ? 'ArrowLeft' : 'ArrowRight';
                executeScript(settings.currentScript, 'ArrowDown', arrowSide);
            }
        });

        document.addEventListener('keyup', function(event) {
            console.log(`Key released: ${event.key}, Code: ${event.code}`);

            // Check for 's' and 'w' keys
            if (event.key === 's' || event.key === 'w') {
                handleKeyRelease(event.key);
            }
        });

        function handleKeyPress(key) {
            // If a different key is held, release it
            if (heldKey && heldKey !== key) {
                releaseKey(heldKey);
            }

            // Hold the new key
            if (!heldKey || heldKey !== key) {
                holdKey(key);
            }

            lastPressedKey = key;
        }

        function handleKeyRelease(key) {
            // Only release the key if it is currently held
            if (heldKey === key) {
                heldKey = null;
                releaseKey(key);
            }
        }

        function executeScript(scriptNumber, arrowDown, arrowSide) {
            switch (scriptNumber) {
                case 1:
                    holdCtrlArrow(arrowDown, arrowSide, 10, 500);
                    break;
                case 2:
                    holdCtrlArrow(arrowDown, arrowSide, 200, 500);
                    break;
                case 3:
                    holdCtrlArrow(arrowDown, arrowSide, 500, 700);
                    break;
                case 4:
                    holdCtrlArrow(arrowDown, arrowSide, 300, 500);
                    break;
                case 5:
                    holdCtrlArrowSingle(arrowSide === 'ArrowLeft' ? 'ArrowUp' : 'ArrowDown', 500);
                    break;
                case 6:
                    holdCtrlArrow(arrowDown, arrowSide, 0, 500);
                    break;
                case 7:
                    holdCtrlArrowSingle(arrowSide === 'ArrowLeft' ? 'ArrowUp' : 'ArrowDown', 230);
                    break;
                case 8:
                    holdCtrlArrowSingle(arrowSide === 'ArrowLeft' ? 'ArrowUp' : 'ArrowDown', 300);
                    break;
                case 9:
                    holdCtrlArrow(arrowDown, arrowSide, 300, 700);
                    break;
                case 10:
                    holdCtrlArrow(arrowDown, arrowSide, 500, 1000);
                    break;
                default:
                    console.log("Invalid script number");
            }
        }

        function holdCtrlArrow(arrowDown, arrowSide, holdTime, releaseTime) {
            const ctrlKeyDownEvent = new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: 'Control',
                code: 'ControlLeft',
                keyCode: 17,
                which: 17
            });

            const ctrlKeyUpEvent = new KeyboardEvent('keyup', {
                bubbles: true,
                cancelable: true,
                key: 'Control',
                code: 'ControlLeft',
                keyCode: 17,
                which: 17
            });

            const arrowDownEvent = new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: arrowDown,
                code: arrowDown,
                keyCode: 40,
                which: 40
            });

            const arrowDownUpEvent = new KeyboardEvent('keyup', {
                bubbles: true,
                cancelable: true,
                key: arrowDown,
                code: arrowDown,
                keyCode: 40,
                which: 40
            });

            const arrowSideEvent = new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: arrowSide,
                code: arrowSide,
                keyCode: arrowSide === 'ArrowLeft' ? 37 : 39,
                which: arrowSide === 'ArrowLeft' ? 37 : 39
            });

            const arrowSideUpEvent = new KeyboardEvent('keyup', {
                bubbles: true,
                cancelable: true,
                key: arrowSide,
                code: arrowSide,
                keyCode: arrowSide === 'ArrowLeft' ? 37 : 39,
                which: arrowSide === 'ArrowLeft' ? 37 : 39
            });

            // Dispatch keydown events for Ctrl and ArrowDown
            document.dispatchEvent(ctrlKeyDownEvent);
            document.dispatchEvent(arrowDownEvent);

            // After specified hold time, dispatch ArrowSide keydown event while still holding Ctrl and ArrowDown
            setTimeout(function() {
                document.dispatchEvent(arrowSideEvent);

                // After specified release time, dispatch keyup events to release the keys
                setTimeout(function() {
                    document.dispatchEvent(ctrlKeyUpEvent);
                    document.dispatchEvent(arrowDownUpEvent);
                    document.dispatchEvent(arrowSideUpEvent);
                }, releaseTime); // Hold keys for the specified release time
            }, holdTime); // Hold ArrowDown for the specified hold time before pressing ArrowLeft or ArrowRight
        }

        function holdCtrlArrowSingle(arrowKey, releaseTime) {
            const ctrlKeyDownEvent = new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: 'Control',
                code: 'ControlLeft',
                keyCode: 17,
                which: 17
            });

            const ctrlKeyUpEvent = new KeyboardEvent('keyup', {
                bubbles: true,
                cancelable: true,
                key: 'Control',
                code: 'ControlLeft',
                keyCode: 17,
                which: 17
            });

            const arrowKeyDownEvent = new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: arrowKey,
                code: arrowKey,
                keyCode: arrowKey === 'ArrowUp' ? 38 : 40,
                which: arrowKey === 'ArrowUp' ? 38 : 40
            });

            const arrowKeyUpEvent = new KeyboardEvent('keyup', {
                bubbles: true,
                cancelable: true,
                key: arrowKey,
                code: arrowKey,
                keyCode: arrowKey === 'ArrowUp' ? 38 : 40,
                which: arrowKey === 'ArrowUp' ? 38 : 40
            });

            // Dispatch keydown events for Ctrl and the specified arrow key
            document.dispatchEvent(ctrlKeyDownEvent);
            document.dispatchEvent(arrowKeyDownEvent);

            // After specified release time, dispatch keyup events to release the keys
            setTimeout(function() {
                document.dispatchEvent(ctrlKeyUpEvent);
                document.dispatchEvent(arrowKeyUpEvent);
            }, releaseTime); // Hold keys for the specified release time
        }

        function holdKey(key) {
            heldKey = key;

            const keyDownEvent = new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: key,
                code: key,
                keyCode: key === 'w' ? 87 : 83, // 87 for 'w', 83 for 's'
                which: key === 'w' ? 87 : 83
            });

            // Dispatch keydown event
            document.dispatchEvent(keyDownEvent);
        }

        function releaseKey(key) {
            const keyUpEvent = new KeyboardEvent('keyup', {
                bubbles: true,
                cancelable: true,
                key: key,
                code: key,
                keyCode: key === 'w' ? 87 : 83, // 87 for 'w', 83 for 's'
                which: key === 'w' ? 87 : 83
            });

            // Dispatch keyup event
            document.dispatchEvent(keyUpEvent);
        }

    }

    // Initialize the script
    initDodging();

}();
