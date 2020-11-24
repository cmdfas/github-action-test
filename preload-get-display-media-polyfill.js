const {desktopCapturer} = require('electron');

// const sourceTypes = ['screen', 'window'];
const sourceTypes = ['screen'];

const clearSelection = () => {
    document.querySelectorAll('.app-share_content_item').forEach(li => {
        li.classList = 'app-share_content_item';
    });
};

const showMessage = (msg, tit, duration) => {
    tit = tit || '提示';
    duration = duration || 1200;
    const message = document.createElement('div');
    message.classList = 'app-share_message';
    message.innerHTML = `
        <style>
            .app-share_message {
                display: block;
                position: fixed;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: 9999;
            }
            .app-share_message_layer {
                display: block;
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: 9998;
                background: rgba(0, 0, 0, 0.6);
            }
            .app-share_message_wrapper {
                box-sizing: border-box;
                position: absolute;
                top: 50%;
                left: 50%;
                z-index: 9999;
                transform: translate(-50%, -50%);
                width: 300px;
                min-height: 160px;
                padding: 10px 25px;
                border-radius: 10px;
                background-color: #FFFFFF;
                box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04), 0 2px 4px 0 rgba(0, 0, 0, 0.12);
            }
            .app-share_message_title {
                box-sizing: border-box;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 60px;
                font-size: 20px;
                color: #333333;
            }
            .app-share_message_content {
                font-size: 14px;
                text-align: center;
            }
        </style>
        <div class="app-share_message_layer"></div>
    `;

    const wrapper = document.createElement('div');
    wrapper.classList = 'app-share_message_wrapper';

    const title = document.createElement('div');
    title.classList = 'app-share_message_title';
    title.innerHTML = `${tit}`;

    const content = document.createElement('div');
    content.classList = 'app-share_message_content';
    content.innerHTML = `${msg}`;

    wrapper.appendChild(title);
    wrapper.appendChild(content);
    message.appendChild(wrapper);
    document.body.appendChild(message);

    setTimeout(() => {
        document.body.removeChild(message);
    }, duration);
};

const getDisplayMedia = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let selectedSourceId = null;
            const sources = await desktopCapturer.getSources({types: sourceTypes});

            const shareStyle = document.createElement('div');
            shareStyle.innerHTML = `
                <style>
                    .app-share_wrapper {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100vh;
                        background: #FFFFFF;
                        color: #333;
                        z-index: 999;
                    }
                    .app-share_title {
                        box-sizing: border-box;
                        display: flex;
                        width: 100%;
                        height: 60px;
                        line-height: 60px;
                        margin: 0 auto;
                        padding: 0 20px;
                    }
                    .app-share_title_icon {
                        width: 2px;
                        height: 24px;
                        background-color: #FF707C;
                        margin-top: 18px;
                        margin-right: 14px;
                    }
                    .app-share_title_txt {
                        width: 504px;
                        height: 60px;
                        font-size: 16px;
                        color: #333333;
                    }
                    .app-share_footer {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 50px;
                    }
                    .app-share_btn {
                        width: 98px;
                        height: 40px;
                        color: #FF707C;
                        border: solid 1px #FF707C;
                        border-radius: 4px;
                        font-size: 16px;
                        line-height: 40px;
                        text-align: center;
                        margin-right: 16px;
                        cursor: pointer;
                    }
                    .app-share_btn_confirm {
                        color: #FFFFFF;
                        border: solid 1px #FF707C;
                        background-color: #FF707C;
                    }
                    .app-share_content {
                        overflow-y: auto;
                        width: 100%;
                        height: calc(100% - 60px - 50px);
                    }
                    .app-share_content_list {
                        display: flex;
                        flex-flow: row wrap;
                        width: 100%;
                        margin: 0 auto;
                    }
                    .app-share_content_item {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        align-items: center;
                        height: 127px;
                        width: 128px;
                        margin-left: 8px;
                        margin-right: 8px;
                        cursor: pointer;
                    }
                    .app-share_content_item.app-share_content_item_active {
                        background-color: #FF707C;
                    }
                    .app-share_content_item_thumb {
                        height: 70px;
                        width: 124px;
                    }
                    .app-share_content_item_txt {
                        width: 100%;
                        height: 47px;
                        text-align: center;
                        font-size: 16px;
                        color: #333333;
                        line-height: 45px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                </style>
            `;

            const wrapper = document.createElement('div');
            wrapper.classList = 'app-share_wrapper';

            const title = document.createElement('div');
            title.classList = 'app-share_title';
            title.innerHTML = `<span class="app-share_title_icon"></span><span class="app-share_title_txt">选择共享内容</span>`;

            const footer = document.createElement('div');
            footer.classList = 'app-share_footer';
            footer.innerHTML = `
                <div id="app-share_btn_cancel" class="app-share_btn">取消</div>
                <div id="app-share_btn_confirm" class="app-share_btn app-share_btn_confirm">确定</div>
            `;

            const content = document.createElement('div');
            content.classList = 'app-share_content';
            content.innerHTML = `
                <div class="app-share_content_list">
                    ${sources.map(({id, name, thumbnail, dispaly_id, appIcon}) => `
                        <div class="app-share_content_item" data-id="${id}">
                            <img class="app-share_content_item_thumb" src="${thumbnail.toDataURL()}" title="${name}" alt="${name}" />
                            <div class="app-share_content_item_txt">${name}${id}</div>
                        </div>
                    `).join('')}
                </div>
            `;

            wrapper.appendChild(shareStyle);
            wrapper.appendChild(title);
            wrapper.appendChild(content);
            wrapper.appendChild(footer);
            document.body.appendChild(wrapper);

            document.getElementById('app-share_btn_cancel').addEventListener('click', () => {
                reject({reason: 'UserCancel'});
                document.body.removeChild(wrapper);
            });
            document.getElementById('app-share_btn_confirm').addEventListener('click', async () => {
                try {
                    if (!selectedSourceId) {
                        console.error('Warning: select a source first');
                        showMessage('请选择分享源');
                        return;
                    }
                    const source = sources.find(source => source.id === selectedSourceId);
                    if (!source) {
                        throw new Error(`Source with id ${id} does not exist`);
                    }
                    resolve(selectedSourceId);

                    document.body.removeChild(wrapper);
                } catch (err) {
                    console.error('Error selecting desktop capture source:', err);
                    reject(err);
                    // document.body.removeChild(wrapper);
                }
            });

            document.querySelectorAll('.app-share_content_item').forEach(li => {
                li.addEventListener('click', () => {
                    try {
                        selectedSourceId = li.getAttribute('data-id');
                        clearSelection();
                        li.classList = 'app-share_content_item app-share_content_item_active';
                    } catch (e) {
                        console.error('Error selecting desktop capture source:', err);
                    }
                });
            });
        } catch (err) {
            console.error('Error displaying desktop capture sources:', err);
            reject(err);
        }
    })
};

window.navigator.getDisplayMediaDisplay = getDisplayMedia;


const getDisplayMediaHide = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const sources = await desktopCapturer.getSources({types: sourceTypes});
            const selectedSourceId = window.appSelectedSourceId;

            try {
                if (!selectedSourceId) {
                    throw new DOMException('NotFoundError', 'NotFoundError');
                }
                // alert(selectedSourceId);
                const source = sources.find(source => {
                    // alert(source.id === selectedSourceId);
                    return source.id === selectedSourceId;
                });
                if (!source) {
                    throw new Error(`Source with id ${selectedSourceId} does not exist`);
                }
                const stream = await window.navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: {
                        mandatory: {
                            chromeMediaSource: 'desktop',
                            chromeMediaSourceId: source.id
                        }
                    }
                });
                resolve(stream);
            } catch (err) {
                console.error('Error selecting desktop capture source:', err);
                reject(err);
            }
        } catch (err) {
            console.error('Error displaying desktop capture sources:', err);
            reject(err);
        }
    });
};

if (window.navigator.mediaDevices) {
    window.navigator.mediaDevices.getDisplayMedia = getDisplayMediaHide;
} else {
    window.navigator.getDisplayMedia = getDisplayMediaHide;
}
