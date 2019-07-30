/* Based on examples/jsm/vr/WebVR.js from Three.js */

class VXR {
    constructor() {
        this._state = 'uninitialised';
        this.onStateChange = null;
        this.renderer = null;
    }

    get state() {
        return this._state;
    }
    set state(s) {
        if (['ready', 'in-progress', 'not-available'].indexOf(s) < 0) {
            throw new Error('Unknown state.');
        }

        const oldState = this._state;
        this._state = s;

        if (this.onStateChange) {
            this.onStateChange(s, oldState);
        }
    }

    static isSupported() {}

    prepare(renderer) {
        this.renderer = renderer;
    }
    startSession() {}
    stopSesssion() {}
}

export class WebVR extends VXR {
    constructor() {
        super();

        this.display = null;
    }

    static isSupported() {
        return 'getVRDisplays' in navigator;
    }

    _setupListeners() {
        window.addEventListener('vrdisplayconnect', (event) => {
            this.display = event.display;
            this.state = 'ready';
        }, false);

        window.addEventListener('vrdisplaydisconnect', () => {
            this.display = null;
            this.state = 'not-available';
        }, false);
        window.addEventListener('vrdisplaypresentchange', (event) => {
            if (event.display.isPresenting) {
                this.state = 'in-progress';
            } else {
                this.state = 'ready';
            }
        }, false);
        window.addEventListener('vrdisplayactivate', (event) => {
            event.display.requestPresent([
                {source: this.renderer.domElement}
            ]);
        }, false);
    }
    prepare(renderer) {
        super.prepare(renderer);

        this._setupListeners();

        return navigator.getVRDisplays()
            .then((displays) => {
                if (displays.length > 0) {
                    this.display = displays[0];
                    this.state = 'ready';
                } else {
                    this.state = 'not-available';
                }
            }).catch(() => {
                this.state = 'not-available';
            });
    }

    startSession() {
        if (!this.display) {
            throw new Error('No VR device available');
        }

        if (!this.display.isPresenting) {
            this.display.requestPresent([{source: this.renderer.domElement}]);
            this.renderer.vr.setDevice(this.display);
            this.state = 'in-progress';
        }
    }
    stopSession() {
        this.display.exitPresent();
        this.state = 'ready';
    }
}

export class WebXR extends VXR {
    constructor() {
        super();

        this.session = null;
    }

    static isSupported() {
        return 'xr' in navigator && 'supportsSession' in navigator.xr;
    }

    prepare(renderer) {
        super.prepare(renderer);

        return navigator.xr.supportsSession('immersive-vr')
            .then(() => {
                this.state = 'ready';
            }).catch(() => {
                this.state = 'not-available';
            });
    }

    startSession() {
        return navigator.xr.requestSession('immersive-vr')
            .then((s) => {
				this.renderer.vr.setSession(s);
                this.session = s;
                this.state = 'in-progress';

                s.addEventListener('end', () => {
                    this.renderer.vr.setSession(null);
                    this.session = null;
                    this.state = 'ready';
                });

                return s;
            });
    }

    endSession() {
        if (this.session) {
            this.currenSession.end();
        }
    }
}

export class EnterVR {
    constructor() {
        this.api = null;
        this.onStateChange = null;

        if (WebXR.isSupported()) {
            this.api = new WebXR();
        }

        if (WebVR.isSupported()) {
            this.api = new WebVR();
        }
    }

    get state() {
        if (!this.api) {
            return 'not-available';
        }

        return this.api.state;
    }

    get available() {
        return this.api && ['ready', 'in-progress'].indexOf(this.api.state) >= 0;
    }

    prepare(renderer) {
        if (this.api) {
            if (this.onStateChange) {
                this.api.onStateChange = this.onStateChange;
            }

            return this.api.prepare(renderer);
        }

        if (this.onStateChange) {
            this.onStateChange('not-available', 'uninitialised');
        }

        return Promise.resolve();
    }

    startSession() {
        if (!this.api) {
            throw new Error('Not supported');
        }

        return this.api.startSession();
    }
    endSession() {
        if (!this.api) {
            throw new Error('Not supported');
        }

        return this.api.stopSession();
    }
}