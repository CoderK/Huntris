export const MESSAGE_BOX_CLASS = 'message-box';
export const MESSAGE_CLASS = 'message-box__message';

const templateString =
    `<div class="${MESSAGE_BOX_CLASS}" style="display:none">
        <p class="${MESSAGE_CLASS} line-1 anim-typewriter"></p>
    </div>`;

class MessageBoxView {
    constructor() {
        this.elRoot = null;
    }

    appendTo(container) {
        if (this.elRoot) {
            return;
        }

        this._appendHtml(container, templateString);
        this._assignElements();
    }

    show() {
        this.elRoot.style.display = 'block';
    }

    hide() {
        this.elRoot.style.display = 'none';
    }

    showWithMessage(message) {
        this.elMessage.textContent = message;
        this.elRoot.style.display = 'block';
    }

    destroy() {
        this.elRoot.parentNode.removeChild(this.elRoot);
    }

    _appendHtml(container, htmlString) {
        const elDummy = document.createElement('div');
        elDummy.innerHTML = htmlString;
        container.appendChild(elDummy.childNodes[0]);
    }

    _assignElements() {
        this.elRoot = document.getElementsByClassName(MESSAGE_BOX_CLASS)[0];
        this.elMessage = this.elRoot.getElementsByClassName(MESSAGE_CLASS)[0];
    }
}

export default MessageBoxView;
