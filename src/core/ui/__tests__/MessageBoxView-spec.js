import 'jsdom-global/register';
import chai from 'chai';
import sinon from 'sinon';

import MessageBoxView, { MESSAGE_BOX_CLASS } from '../MessageBoxView';

chai.should();

describe('MessageBoxView >', () => {
    let sandboxSinon;
    let messageBox;
    let body;

    beforeEach(() => {
        sandboxSinon = sinon.sandbox.create();
        messageBox = new MessageBoxView();
        body = document.querySelector('body');
    });

    afterEach(() => {
        sandboxSinon.restore();
        messageBox.destroy();
    });

    describe('메시지 박스 주입 >', () => {
        it('메시지 박스를 컨테이너 안에 주입할 수 있다.', () => {
            // given
            // when
            messageBox.appendTo(body);

            // then
            const selectedNodes = body.getElementsByClassName(MESSAGE_BOX_CLASS);
            selectedNodes.should.have.length(1);
        });

        it('메시지 박스를 컨테이너 안에 하나만 주입할 수 있다.', () => {
            // given
            // when
            messageBox.appendTo(body);
            messageBox.appendTo(body);
            messageBox.appendTo(body);
            messageBox.appendTo(body);

            // then
            const selectedNodes = body.getElementsByClassName(MESSAGE_BOX_CLASS);
            selectedNodes.should.have.length(1);
        });

        it('화면에 보이지 않는 메시지 박스를 컨테이너 안에 주입할 수 있다.', () => {
            // given
            // when
            messageBox.appendTo(body);

            // then
            messageBox.elRoot.style.display.should.be.eql('none');
        });
    });

    describe('메시지 박스 노출/숨김 >', () => {
        it('메시지 박스를 화면에 노출할 수 있다.', () => {
            messageBox.appendTo(body);

            // when
            messageBox.show();

            // then
            messageBox.elRoot.style.display.should.be.eql('block');
        });

        it('메시지 박스를 화면에서 숨길 수 있다.', () => {
            messageBox.appendTo(body);
            messageBox.show();

            // when
            messageBox.hide();

            // then
            messageBox.elRoot.style.display.should.be.eql('none');
        });

        it('메시지 박스에 원하는 메시지를 입력하여 화면에 노출할 수 있다.', () => {
            const expectedMessage = 'blahblah';
            messageBox.appendTo(body);

            // when
            messageBox.showWithMessage(expectedMessage);

            // then
            const { textContent } = messageBox.elMessage;
            textContent.should.be.eql(expectedMessage);
        });
    });
});
