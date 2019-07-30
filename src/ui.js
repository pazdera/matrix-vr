/* A crude encapsulation of DOM operations */
export const ui = {
    buttons: document.querySelector('.buttons'),
    overlay: document.querySelector('.overlay'),
    buttonVR: document.querySelector('#start'),
    button360: document.querySelector('.button-360'),
    heading: document.querySelector('h1'),
    tagline: document.querySelector('.tagline'),

    loading: document.querySelector('.loading'),
    progressBar: document.querySelector('#progress-bar'),

    toggleVR: document.querySelector('.toggle-vr'),

    displayButton(type) {
        if (type === 'vr') {
            this.buttonVR.classList.remove('no-vr');
            this.button360.classList.add('hidden');
        } else {
            this.buttonVR.classList.add('no-vr');
            this.button360.classList.remove('hidden');
        }
    },
    hideProgress() {
        this.loading.classList.add('fade');
    },
    fadeIn() {
        this.loading.classList.add('hidden');
        this.buttons.classList.remove('fade');
        this.tagline.classList.remove('fade')
        canvas.classList.remove('fade');
    },
    updateProgress(progress) {
        this.progressBar.style.width = `${100 * progress}%`;
    },
    setupListeners(vr, startConstruct) {
        this.buttonVR.addEventListener('click', () => {
            if (vr.state === 'ready') {
                startConstruct();
            }
        });
        this.button360.addEventListener('click', () => {
            if (vr.state === 'not-available') {
                startConstruct();
            }
        });
        this.toggleVR.addEventListener('click', () => {
            if (vr.state === 'in-progress') {
                vr.endSession();
            }
            if (vr.state === 'ready') {
                vr.startSession();
            }
        });
    },
    hideOverlay() {
        this.overlay.style.display = 'none';
        this.overlay.style.pointerEvents = 'none';
    },
    showToggleVR(flag) {
        this.toggleVR.style.display = flag ? 'block' : 'none';
    }
};