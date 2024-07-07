const canvas = document.getElementById("displayCanvas");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width = 16;
const CANVAS_HEIGHT = canvas.height = 16;

let blocks=[];//x,y存資料,+x軸朝右,+y軸朝下
for(let i_num=0;i_num<16;i_num++){
    let row=Array(16).fill(-1);
    blocks.push(row);
}
let history_nums2d=[];
history_nums2d.push(JSON.parse(JSON.stringify(blocks)));

let mode_num=0;//0繪圖,1刪除,2填滿
let colorIndex_num=0;
let colorRGB=[
    [0,0,0],
    [255,255,255],
    [127,127,127],
    [195,195,195],
    [136,0,21],
    [185,122,87],
    [237,28,36],
    [255,174,201],
    [255,127,39],
    [255,201,14],
    [255,242,0],
    [239,228,176],
    [34,177,76],
    [181,290,29],
    [0,162,232],
    [153,217,234],
    [63,72,204],
    [112,146,190],
    [163,73,164],
    [200,191,231],
    [255,255,255],
    [255,255,255],
    [255,255,255],
    [255,255,255],
    [255,255,255],
    [255,255,255],
    [255,255,255],
    [255,255,255],
];
let imageWidth_num=64;  

setInterval(reflesh, 50);
addButtonsToHTML();
document.getElementById("colorButton"+0).style.borderRadius=`50%`;

//生成按鈕
function addButtonsToHTML(){
    for(let i_num=0;i_num<28;i_num++){
        let newButton=document.createElement('button');
        newButton.id="colorButton"+String(i_num);
        newButton.className='colorButtons';
        newButton.onclick = (function(i_num) {
            return function() {
                document.getElementById("colorButton"+colorIndex_num).style.borderRadius=`0%`;
                colorIndex_num=i_num;
                displayRGBBarNumber();
                document.getElementById("colorButton"+i_num).style.borderRadius=`50%`;
            };
        })(i_num);
        document.getElementById("colorContainer").appendChild(newButton);
    }
}

//設定功能按鈕

//模式
document.getElementById("paintButton").onclick=()=>{
    mode_num=0;
    document.getElementById("paintButton").style.borderRadius=`50%`;
    document.getElementById("clearButton").style.borderRadius=`0%`;
    document.getElementById("fillButton").style.borderRadius=`0%`;
}
document.getElementById("clearButton").onclick=()=>{
    mode_num=1;
    document.getElementById("paintButton").style.borderRadius=`0%`;
    document.getElementById("clearButton").style.borderRadius=`50%`;
    document.getElementById("fillButton").style.borderRadius=`0%`;
}
document.getElementById("fillButton").onclick=()=>{
    mode_num=2;
    document.getElementById("paintButton").style.borderRadius=`0%`;
    document.getElementById("clearButton").style.borderRadius=`0%`;
    document.getElementById("fillButton").style.borderRadius=`50%`;
}

//設定透明代表顏色
let isWhite_bool=true;
document.getElementById("changeVoidButton").onclick=()=>{
    if(isWhite_bool==true){
        isWhite_bool=false;
    }else{
        isWhite_bool=true;
    }
}

//顏色設定確認
document.getElementById("commitChangeButton").onclick=()=>{
    let rValue_num = Math.max(0, Math.min(255, parseInt(document.getElementById("rInput").value)));
    let gValue_num = Math.max(0, Math.min(255, parseInt(document.getElementById("gInput").value)));
    let bValue_num = Math.max(0, Math.min(255, parseInt(document.getElementById("bInput").value)));
    colorRGB[colorIndex_num] = [rValue_num, gValue_num, bValue_num];
}

//回復上一步
document.getElementById("backButton").onclick=()=>{
    if(history_nums2d.length<=0){
        return;
    }
    blocks=history_nums2d[history_nums2d.length-1];
    history_nums2d.pop();
}

//存為png
document.getElementById("pngSaveButton").onclick = () => {
    let imageWidth_num = parseInt(document.querySelector("select").value);
    saveCanvasAsImage('png',imageWidth_num);
}

//存為jpeg
document.getElementById("jpgSaveButton").onclick = () => {
    let imageWidth_num = parseInt(document.querySelector("select").value);
    saveCanvasAsImage('jpeg',imageWidth_num);
}

//刷新畫面
function reflesh(){
    update();
    draw();
}

//繪製畫面
function draw() {
    for(let i_num=0;i_num<16;i_num++){
        for(let j_num=0;j_num<16;j_num++){
            if(blocks[i_num][j_num]==-1){
                ctx.fillStyle=isWhite_bool?`rgb(246,246,246)`:`rgb(20,20,20)`;
                ctx.fillRect(i_num,j_num,1,1);
                continue;
            }
            ctx.fillStyle=`rgb(${blocks[i_num][j_num][0]},${blocks[i_num][j_num][1]},${blocks[i_num][j_num][2]})`;
            ctx.fillRect(i_num,j_num,1,1);//x,y印資料
        }
    }
}

//改變按鈕封面顏色
function updateButtonColor(){
    for(let i_num=0;i_num<28;i_num++){
        document.getElementById("colorButton"+i_num).style.backgroundColor=
        `rgb(${colorRGB[i_num][0]},${colorRGB[i_num][1]},${colorRGB[i_num][2]})`;
    }
}

//改變rgb數值
function displayRGBBarNumber() {
    document.getElementById("rInput").value=colorRGB[colorIndex_num][0];
    document.getElementById("gInput").value=colorRGB[colorIndex_num][1];
    document.getElementById("bInput").value=colorRGB[colorIndex_num][2];
}

//更新狀態
function update(){
    updateButtonColor();
}

//判斷並增新歷史狀態
function addHistory(){
    if(history_nums2d.length!=0){
        if (JSON.stringify(history_nums2d[history_nums2d.length - 1]) === JSON.stringify(blocks)) {
            return;
        }
    }
    history_nums2d.push(JSON.parse(JSON.stringify(blocks)));
}

//獲取選中的格子位置
let isDrawing_bool = false;
canvas.addEventListener('mousedown', function(event) {
    isDrawing_bool = true;
    addHistory();
    getAndSentBLockPosition(event);
});

canvas.addEventListener('mousemove', function(event) {
    if (isDrawing_bool) {
        getAndSentBLockPosition(event);
    }
});

canvas.addEventListener('mouseup', function() {
    isDrawing_bool = false;
});

canvas.addEventListener('mouseleave', function() {
    isDrawing_bool = false;
});

function getAndSentBLockPosition(event) {
    const rect = canvas.getBoundingClientRect();
    let scaleX_num = canvas.width / rect.width;
    let scaleY_num = canvas.height / rect.height;
    let x_num = Math.floor((event.clientX - rect.left) * scaleX_num);
    let y_num = Math.floor((event.clientY - rect.top) * scaleY_num);

    if (x_num >= 0 && x_num < 16 && y_num >= 0 && y_num < 16) {
        chooseMissionToOperate(x_num,y_num);
    }
}

//選擇任務執行
function chooseMissionToOperate(x_num,y_num) {
    switch (mode_num) {
        case 0:
            paintBlocks(x_num,y_num);
            break;
        case 1:
            clearBlocks(x_num,y_num);
            break;
        case 2:
            fillBlocks(x_num,y_num);
            break;
        default:
            break;
    }
}

//繪製
function paintBlocks(x_num,y_num) {
    blocks[x_num][y_num]=[colorRGB[colorIndex_num][0],colorRGB[colorIndex_num][1],colorRGB[colorIndex_num][2]];
}

//刪除
function clearBlocks(x_num,y_num) {
    blocks[x_num][y_num]=-1;
}

// 設定填滿起始點
function fillBlocks(x_num, y_num) {
    let neededChangeColor = blocks[x_num][y_num];
    let targetColor = colorRGB[colorIndex_num];
    if (arraysEqual(neededChangeColor, targetColor)) {
        return;
    }
    let startX = x_num, startY = y_num;
    fillRecursion(startX, startY, neededChangeColor, targetColor);
}
// 比較兩個數組是否相等
function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i_num = 0; i_num < a.length; i_num++) {
        if (a[i_num] !== b[i_num]) return false;
    }
    return true;
}
// 填充用遞迴
function fillRecursion(startX, startY, neededChangeColor, targetColor) {
    if (startX < 0 || startX > 15 || startY < 0 || startY > 15) {
        return;
    }
    if (!arraysEqual(blocks[startX][startY], neededChangeColor)) {
        return;
    }
    blocks[startX][startY] = targetColor;
    fillRecursion(startX + 1, startY, neededChangeColor, targetColor);
    fillRecursion(startX - 1, startY, neededChangeColor, targetColor);
    fillRecursion(startX, startY + 1, neededChangeColor, targetColor);
    fillRecursion(startX, startY -  1, neededChangeColor, targetColor);
}

// 存檔
function saveCanvasAsImage(format, imageWidth_num) {
    const originalWidth = canvas.width;
    const originalHeight = canvas.height;
    canvas.width = imageWidth_num;
    canvas.height = imageWidth_num;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
            if (blocks[i][j] !== -1) {
                ctx.fillStyle = `rgb(${blocks[i][j][0]}, ${blocks[i][j][1]}, ${blocks[i][j][2]})`;
                ctx.fillRect(i * (imageWidth_num / 16), j * (imageWidth_num / 16), imageWidth_num / 16, imageWidth_num / 16);
            }
        }
    }
    if (format === 'png') {
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `canvas.${format}`;
            link.href = url;
            link.click();
        });
    }
    if (format === 'jpeg') {
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `canvas.${format}`;
            link.href = url;
            link.click();
        }, 'image/jpeg', 1);
    }
    canvas.width = originalWidth;
    canvas.height = originalHeight;
}