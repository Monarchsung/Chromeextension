(function () {

  /* VARIABLES */
  let settings = {
    scriptActive: false,
    currentScript: 1,
  };

  let heldKey = null;
  let lastPressedKey = null;

  /* INIT */

  function init() {
    initEvents();
    initGame();
  }

  function initEvents() {
    SWAM.on('keydown', onKeydown);
    SWAM.on('keyup', onKeyup);
  }

  function initGame() {
    SWAM.one('playerAdded', Player => {
      const proto = Object.getPrototypeOf(Player),
            prev = proto.update;

      proto.update = function(...args) {
        prev.call(this, ...args);
        const me = Players.getMe();
        if (me && this.id === me.id && settings.scriptActive) {
          // Execute script based on currentScript
        }
      };
    });
  }

  SWAM.on('gameLoaded', init);

  /* EVENTS */

  function onKeydown(event) {
    if (event.originalEvent.key === 'p') {
      event.stopImmediatePropagation();
      toggleScriptActive();
    } else if (event.originalEvent.code === 'Pause') {
      event.stopImmediatePropagation();
      toggleScriptActive(false);
    } else if (settings.scriptActive && event.originalEvent.key >= '1' && event.originalEvent.key <= '9') {
      settings.currentScript = parseInt(event.originalEvent.key);
      console.log(`Switched to script ${settings.currentScript}`);
    } else if (settings.scriptActive && event.originalEvent.key === '0') {
      settings.currentScript = 10;
      console.log(`Switched to script ${settings.currentScript}`);
    } else if (settings.scriptActive && (event.originalEvent.key === 'q' || event.originalEvent.key === 'e')) {
      let arrowSide = event.originalEvent.key === 'q' ? 'ArrowLeft' : 'ArrowRight';
      executeScript(settings.currentScript, 'ArrowDown', arrowSide);
    }
  }

  function onKeyup(event) {
    if (event.originalEvent.key === 's' || event.originalEvent.key === 'w') {
      handleKeyRelease(event.originalEvent.key);
    }
  }

  /* API */

  function toggleScriptActive(force) {
    settings.scriptActive = force === undefined ? !settings.scriptActive : force;
    if (settings.scriptActive) {
      SWAM.showMessage("Predator dodges begins");
      console.log("Predator dodges begins");
    } else {
      SWAM.showMessage("Predator dodges ends");
      console.log("Predator dodges ends");
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

  /* REGISTER */
  SWAM.registerExtension({
    name: 'Predator Dodges',
    id: 'Monarch.predatorDodges',
    description: 'Advanced dodging techniques for Airmash.',
    version: '1.0.0',
    author: 'Monarch'
  });

}());
