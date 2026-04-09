//  获取页面元素 
const avatarImg = document.getElementById('avatar');
const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('fileInput');

const nameText = document.getElementById('nameText');
const nameInput = document.getElementById('nameInput');
const bioText = document.getElementById('bioText');
const bioInput = document.getElementById('bioInput');

const editBtn = document.getElementById('editBtn');
const saveBtn = document.getElementById('saveBtn');
const historyBtn = document.getElementById('historyBtn');

const modal = document.getElementById('historyModal');
const closeModal = document.getElementById('closeModal');
const historyList = document.getElementById('historyList');

// 当前是否处于编辑模式
let isEditing = false;

// 存储历史记录（最多存10条）
let historyRecords = [];

//  辅助函数 

// 显示提示消息
function showMsg(msg) {
    alert(msg);
}

// 保存一条历史记录
function addHistoryRecord(type, oldValue, newValue) {
    const now = new Date();
    const timeStr = `${now.getMonth()+1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    
    historyRecords.unshift({
        time: timeStr,
        type: type,      // '姓名' 或 '简介' 或 '头像'
        old: oldValue,
        new: newValue
    });
    
    // 只保留最近10条
    if (historyRecords.length > 10) {
        historyRecords.pop();
    }
}

// 渲染历史记录弹窗
function renderHistory() {
    if (historyRecords.length === 0) {
        historyList.innerHTML = '<p style="color: #999; text-align: center;">暂无历史记录~<br>保存修改后会显示在这里</p>';
        return;
    }
    
    let html = '';
    for (let i = 0; i < historyRecords.length; i++) {
        const record = historyRecords[i];
        html += `
            <div class="history-item">
                <div class="history-time">🕐 ${record.time}</div>
                <div class="history-change">
                    📌 修改了 <span>${record.type}</span><br>
                    从 “${record.old}” → “${record.new}”
                </div>
            </div>
        `;
    }
    historyList.innerHTML = html;
}

//  1. 头像上传功能
uploadBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // 检查是不是图片
    if (!file.type.startsWith('image/')) {
        showMsg('请选择图片文件哦~');
        return;
    }
    
    // 限制图片大小 2MB
    if (file.size > 2 * 1024 * 1024) {
        showMsg('图片太大了，请选小于2MB的图片');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(ev) {
        const oldAvatar = avatarImg.src;
        avatarImg.src = ev.target.result;
        // 保存历史记录
        addHistoryRecord('头像', '旧头像', '新头像');
        showMsg('头像更换成功！');
    };
    reader.readAsDataURL(file);
});

//  2. 编辑模式切换 
function enterEditMode() {
    // 把当前显示的内容填到输入框里
    nameInput.value = nameText.innerText;
    bioInput.value = bioText.innerText;
    
    // 切换显示/隐藏
    nameText.classList.add('hidden');
    nameInput.classList.remove('hidden');
    bioText.classList.add('hidden');
    bioInput.classList.remove('hidden');
    
    isEditing = true;
    editBtn.innerText = '❌ 取消';
}

function exitEditMode() {
    nameText.classList.remove('hidden');
    nameInput.classList.add('hidden');
    bioText.classList.remove('hidden');
    bioInput.classList.add('hidden');
    
    isEditing = false;
    editBtn.innerText = '✏️ 编辑';
}

// 点击编辑/取消按钮
editBtn.addEventListener('click', () => {
    if (isEditing) {
        exitEditMode();
    } else {
        enterEditMode();
    }
});

// 3. 保存功能
saveBtn.addEventListener('click', () => {
    if (!isEditing) {
        showMsg('请先点击“编辑”按钮再修改内容~');
        return;
    }
    
    // 获取新值（去除首尾空格）
    const newName = nameInput.value.trim();
    const newBio = bioInput.value.trim();
    
    // 校验姓名不能为空
    if (newName === '') {
        showMsg('姓名不能为空呀！');
        return;
    }
    
    const oldName = nameText.innerText;
    const oldBio = bioText.innerText;
    
    let hasChange = false;
    
    // 如果姓名改变了，保存记录并更新
    if (newName !== oldName) {
        addHistoryRecord('姓名', oldName, newName);
        nameText.innerText = newName;
        hasChange = true;
    }
    
    // 如果简介改变了，保存记录并更新
    if (newBio !== oldBio) {
        addHistoryRecord('简介', oldBio, newBio);
        bioText.innerText = newBio;
        hasChange = true;
    }
    
    if (!hasChange) {
        showMsg('你还没有修改任何内容呢~');
    } else {
        showMsg('保存成功！可以点“历史记录”查看修改历史');
    }
    
    // 退出编辑模式
    exitEditMode();
});

// 4. 历史记录弹窗 
// 打开弹窗
historyBtn.addEventListener('click', () => {
    renderHistory();
    modal.style.display = 'flex';
});

// 点击 × 关闭弹窗
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// 点击弹窗背景关闭弹窗
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

//  5. 确保页面加载时弹窗是隐藏的
modal.style.display = 'none';

console.log('✅ 个人信息卡片已启动 | 支持头像上传、编辑保存、历史记录');