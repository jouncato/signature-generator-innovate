/**
 * Navigation Controller
 * Single Responsibility: Handle screen navigation
 */
class NavigationController {
    constructor() {
        this.currentScreen = 'accessValidation';
    }

    showScreen(screenId) {
        this._hideAllScreens();
        this._showTargetScreen(screenId);
        this.currentScreen = screenId;
    }

    getCurrentScreen() {
        return this.currentScreen;
    }

    _hideAllScreens() {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.remove('active'));
    }

    _showTargetScreen(screenId) {
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        } else {
            throw new Error(`Screen with id '${screenId}' not found`);
        }
    }
}

if (typeof window !== 'undefined') {
    window.NavigationController = NavigationController;
}