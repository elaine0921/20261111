let stopSheet; // 儲存角色 1 的待機動畫精靈圖
let runSheet; // 儲存角色 1 的跑步動畫精靈圖
let backgroundImage; // 儲存畫布背景圖片
let character2StopSheet; // 儲存角色 2 的待機動畫精靈圖
let character2CorrectSheet; // 儲存角色 2 答對時的動畫精靈圖
let character2IncorrectSheet; // 儲存角色 2 答錯時的動畫精靈圖
let characterX; // 儲存角色 1 目前的水平位置
let characterY; // 儲存角色 1 目前的垂直位置
let facingDirection = 1; // 記錄角色 1 朝向，1 代表右方，-1 代表左方
let runFrameIndex = 0; // 記錄角色 1 跑步動畫目前播放的圖片序號
let runFrameTick = 0; // 記錄角色 1 目前跑步圖片已顯示的畫面更新次數
let wasRunning = false; // 記錄上一個畫面角色 1 是否正在跑步
let character2AnimationState = "idle"; // 記錄角色 2 目前播放的動畫狀態
let character2AnimationFrameIndex = 0; // 記錄角色 2 目前動畫播放的圖片序號
let character2AnimationFrameTick = 0; // 記錄角色 2 目前圖片已顯示的畫面更新次數
let interactionState = "idle"; // 記錄互動狀態為待機、答題或答題完成
let answerWasCorrect = false; // 記錄學生上一次的答案是否正確
let currentQuestion; // 儲存目前顯示的數學題目與選項
const stopFrameCount = 14; // 設定角色 1 待機動畫的圖片張數
const runFrameCount = 13; // 設定角色 1 跑步動畫的圖片張數
const runLoopStartFrame = 5; // 設定角色 1 跑步循環起點為第 6 張圖片
const runLastFrame = 11; // 設定角色 1 跑步循環終點為第 12 張圖片
const character2StopFrameCount = 6; // 設定角色 2 待機動畫的圖片張數
const character2CorrectFrameCount = 3; // 設定角色 2 答對動畫的圖片張數
const character2IncorrectFrameCount = 6; // 設定角色 2 答錯動畫的圖片張數
const animationSpeed = 7; // 設定每張動畫圖片顯示的畫面更新次數
const character2AnimationSpeed = 5; // 加快角色 2 的答題動畫，讓動作更明顯
const moveSpeed = 5; // 設定角色 1 每次更新的位置移動量
const characterScale = 1; // 設定角色 1 以原始圖片尺寸顯示
const character2Scale = 2; // 設定角色 2 以原始圖片尺寸的 2 倍顯示
function preload() { // 在畫布啟動前載入背景與所有角色精靈圖
  backgroundImage = loadImage("bg/bg1.png"); // 載入背景圖片
  stopSheet = loadImage("1/stop/stop.png"); // 載入角色 1 待機動畫精靈圖
  runSheet = loadImage("1/run/run.png"); // 載入角色 1 跑步動畫精靈圖
  character2StopSheet = loadImage("2/stop/stop.png"); // 載入角色 2 待機動畫精靈圖
  character2CorrectSheet = loadImage("2/correct/correct.png"); // 載入角色 2 答對動畫精靈圖
  character2IncorrectSheet = loadImage("2/incorrect/incorrect.png"); // 載入角色 2 答錯動畫精靈圖
} // 結束精靈圖載入函式
function setup() { // 設定畫布與角色初始位置
  createCanvas(windowWidth, windowHeight); // 建立符合視窗大小的全螢幕畫布
  characterX = width * 2 / 3; // 將角色 1 放在畫布寬度的三分之二位置
  characterY = height * 0.98; // 將角色 1 的腳底放在接近畫面底部的位置
  imageMode(CORNER); // 使用圖片左上角作為繪圖座標基準
  frameRate(60); // 將畫面更新頻率設定為每秒 60 次
} // 結束畫布設定函式
function draw() { // 每次畫面更新時繪製背景、角色與互動畫面
  background(0); // 清除上一個畫面並提供背景圖片載入時的備用底色
  image(backgroundImage, 0, 0, width, height); // 將背景圖片縮放至充滿整個畫布
  let direction = 0; // 預設角色 1 目前沒有移動
  if (keyIsDown(LEFT_ARROW)) { // 檢查左方向鍵是否正被按住
    direction = -1; // 設定角色 1 向左移動
  } else if (keyIsDown(RIGHT_ARROW)) { // 檢查右方向鍵是否正被按住
    direction = 1; // 設定角色 1 向右移動
  } // 結束方向鍵判斷
  if (interactionState !== "question" && direction !== 0) { // 答題框未開啟且按下方向鍵時允許角色移動
    facingDirection = direction; // 依移動方向更新角色 1 朝向
    characterX += direction * moveSpeed; // 依移動方向更新角色 1 的水平位置
  } // 結束角色 1 移動處理
  const isRunning = interactionState !== "question" && direction !== 0; // 判斷角色 1 是否正在跑步
  const character1Sheet = isRunning ? runSheet : stopSheet; // 選擇角色 1 目前狀態對應的精靈圖
  const character1FrameCount = isRunning ? runFrameCount : stopFrameCount; // 取得角色 1 目前動畫的圖片張數
  const character1FrameWidth = character1Sheet.width / character1FrameCount; // 計算角色 1 單張圖片寬度
  const character1FrameHeight = character1Sheet.height; // 取得角色 1 單張圖片高度
  let character1FrameIndex = 0; // 預設角色 1 目前要顯示的圖片序號
  if (isRunning && !wasRunning) { // 偵測角色 1 剛開始跑步
    runFrameIndex = 0; // 從跑步精靈圖第 1 張重新播放
    runFrameTick = 0; // 重設跑步圖片的顯示計時
  } // 結束跑步動畫起始處理
  if (isRunning) { // 確認角色 1 正在播放跑步動畫
    character1FrameIndex = runFrameIndex; // 使用目前的跑步動畫圖片序號
    runFrameTick += 1; // 累計目前跑步圖片已顯示的畫面更新次數
    if (runFrameTick >= animationSpeed) { // 確認目前跑步圖片已顯示足夠時間
      runFrameTick = 0; // 重設跑步圖片顯示計時
      if (runFrameIndex < runLastFrame) { // 確認跑步動畫尚未播放到第 12 張
        runFrameIndex += 1; // 播放下一張跑步圖片
      } else { // 跑步動畫已播放到第 12 張
        runFrameIndex = runLoopStartFrame; // 回到第 6 張圖片繼續循環
      } // 結束跑步圖片循環判斷
    } // 結束跑步圖片換格處理
  } else { // 角色 1 沒有移動時播放待機動畫
    character1FrameIndex = Math.floor(frameCount / animationSpeed) % stopFrameCount; // 計算循環播放的待機圖片序號
  } // 結束角色 1 跑步與待機圖片選擇
  wasRunning = isRunning; // 記錄角色 1 目前狀態以偵測下一次跑步動畫開始
  const character1Scale = characterScale; // 使用設定的比例放大角色 1
  const character1Width = character1FrameWidth * character1Scale; // 計算角色 1 顯示寬度
  const character2X = width / 3; // 將角色 2 固定在畫布寬度的三分之一位置
  const character2Y = height * 0.98; // 將角色 2 的腳底放在接近畫面底部的位置
  const proximityDistance = Math.min(width * 0.12, character1Width / 2 + character2StopSheet.width / character2StopFrameCount * character2Scale / 2); // 依畫面與角色尺寸計算觸發答題的接近距離
  const distanceBetweenCharacters = Math.abs(characterX - character2X); // 計算兩個角色的水平距離
  if (interactionState === "idle" && distanceBetweenCharacters <= proximityDistance) { // 角色 1 靠近角色 2 且尚未開始本次互動時出題
    currentQuestion = createMathQuestion(); // 隨機產生一道四則運算選擇題
    interactionState = "question"; // 顯示答題狀態並暫停角色 1 移動
  } else if (interactionState === "answered" && distanceBetweenCharacters > Math.max(proximityDistance, width * 0.15)) { // 角色 1 遠離角色 2 後立即結束互動並恢復待機
    interactionState = "idle"; // 將互動狀態恢復為待機
    answerWasCorrect = false; // 清除上一次答題結果
  } // 結束角色靠近與離開的互動判斷
  characterX = Math.max(character1Width / 2, Math.min(width - character1Width / 2, characterX)); // 將角色 1 限制在畫布左右邊界內
  let character2Sheet = character2StopSheet; // 預設角色 2 顯示待機動畫
  let character2FrameCount = character2StopFrameCount; // 預設使用角色 2 待機動畫的圖片張數
  if (interactionState === "answered" && answerWasCorrect) { // 學生答對且角色 1 尚未離開時播放答對動畫
    character2Sheet = character2CorrectSheet; // 切換至角色 2 答對動畫精靈圖
    character2FrameCount = character2CorrectFrameCount; // 設定角色 2 答對動畫的圖片張數
  } else if (interactionState === "answered" && !answerWasCorrect) { // 學生答錯且角色 1 尚未離開時播放答錯動畫
    character2Sheet = character2IncorrectSheet; // 切換至角色 2 答錯動畫精靈圖
    character2FrameCount = character2IncorrectFrameCount; // 設定角色 2 答錯動畫的圖片張數
  } // 結束角色 2 答題結果動畫判斷
  const nextCharacter2AnimationState = interactionState === "answered" ? (answerWasCorrect ? "correct" : "incorrect") : "idle"; // 判斷角色 2 應播放待機、答對或答錯動畫
  if (character2AnimationState !== nextCharacter2AnimationState) { // 偵測角色 2 動畫狀態是否剛切換
    character2AnimationState = nextCharacter2AnimationState; // 更新角色 2 目前動畫狀態
    character2AnimationFrameIndex = 0; // 從新動畫的第一張圖片開始播放
    character2AnimationFrameTick = 0; // 重設角色 2 動畫的圖片計時
  } // 結束角色 2 動畫切換處理
  const character2FrameIndex = character2AnimationFrameIndex; // 取得角色 2 目前動畫圖片序號
  character2AnimationFrameTick += 1; // 累計角色 2 目前圖片已顯示的畫面更新次數
  if (character2AnimationFrameTick >= character2AnimationSpeed) { // 確認角色 2 目前圖片已顯示足夠時間
    character2AnimationFrameTick = 0; // 重設角色 2 動畫圖片計時
    character2AnimationFrameIndex = (character2AnimationFrameIndex + 1) % character2FrameCount; // 循環播放角色 2 動畫並呈現連續動作
  } // 結束角色 2 動畫換格處理
  drawSpriteFrame(character1Sheet, character1FrameCount, character1FrameIndex, characterX, characterY, character1Scale, facingDirection); // 繪製角色 1 目前的待機或跑步動畫
  drawSpriteFrame(character2Sheet, character2FrameCount, character2FrameIndex, character2X, character2Y, character2Scale, 1); // 以原始尺寸 2 倍繪製角色 2 目前的動畫
  if (interactionState === "question") { // 答題狀態時顯示數學題目視窗
    drawQuestionPanel(); // 繪製黃色半透明選擇題方框
  } // 結束題目視窗顯示判斷
} // 結束畫面繪製函式
function drawSpriteFrame(spriteSheet, frameCount, frameIndex, centerX, groundY, scaleFactor, direction) { // 擷取精靈圖單格並以腳底為基準繪製角色
  const frameWidth = spriteSheet.width / frameCount; // 計算精靈圖每一格的寬度
  const frameHeight = spriteSheet.height; // 取得精靈圖每一格的高度
  const drawWidth = frameWidth * scaleFactor; // 計算角色繪製寬度
  const drawHeight = frameHeight * scaleFactor; // 計算角色繪製高度
  push(); // 暫存畫布狀態以免翻轉影響其他內容
  translate(centerX, groundY); // 將繪圖原點移至角色中心底部
  scale(direction, 1); // 依角色朝向決定是否水平翻轉圖片
  image(spriteSheet, -drawWidth / 2, -drawHeight, drawWidth, drawHeight, frameIndex * frameWidth, 0, frameWidth, frameHeight); // 擷取並繪製指定的動畫圖片
  pop(); // 還原畫布狀態
} // 結束精靈圖單格繪製函式
function createMathQuestion() { // 隨機建立一題四則運算選擇題
  const operators = ["+", "-", "×", "÷"]; // 建立加減乘除的運算符號清單
  const operator = random(operators); // 隨機選擇一種四則運算
  let firstNumber = Math.floor(random(1, 11)); // 隨機產生第一個 1 到 10 的整數
  let secondNumber = Math.floor(random(1, 11)); // 隨機產生第二個 1 到 10 的整數
  let correctAnswer = 0; // 預設正確答案數值
  if (operator === "+") { // 目前題目是加法時計算答案
    correctAnswer = firstNumber + secondNumber; // 計算兩數相加的結果
  } else if (operator === "-") { // 目前題目是減法時調整數字順序
    if (firstNumber < secondNumber) { // 避免產生負數答案
      const temporaryNumber = firstNumber; // 暫存第一個數字
      firstNumber = secondNumber; // 將較大的數字放在前面
      secondNumber = temporaryNumber; // 將原第一個數字放在後面
    } // 結束減法數字順序調整
    correctAnswer = firstNumber - secondNumber; // 計算兩數相減的結果
  } else if (operator === "×") { // 目前題目是乘法時計算答案
    correctAnswer = firstNumber * secondNumber; // 計算兩數相乘的結果
  } else { // 目前題目是除法時建立整數答案
    firstNumber = secondNumber * Math.floor(random(1, 11)); // 讓被除數可被除數整除
    correctAnswer = firstNumber / secondNumber; // 計算兩數相除的整數結果
  } // 結束四則運算答案計算
  const choices = [correctAnswer]; // 將正確答案放入選項清單
  while (choices.length < 4) { // 持續產生選項直到共有四個不同答案
    const wrongAnswer = Math.max(0, correctAnswer + Math.floor(random(-5, 6))); // 產生接近正確答案的非負數選項
    if (!choices.includes(wrongAnswer)) { // 確認新選項尚未出現在清單中
      choices.push(wrongAnswer); // 將不重複的選項加入清單
    } // 結束選項重複檢查
  } // 結束四個答案選項產生
  for (let index = choices.length - 1; index > 0; index -= 1) { // 由後往前打亂選項順序
    const swapIndex = Math.floor(random(index + 1)); // 隨機選擇一個交換位置
    const temporaryChoice = choices[index]; // 暫存目前位置的答案
    choices[index] = choices[swapIndex]; // 將隨機位置答案移至目前位置
    choices[swapIndex] = temporaryChoice; // 將暫存答案移至隨機位置
  } // 結束選項洗牌
  return { text: `${firstNumber} ${operator} ${secondNumber} = ?`, answer: correctAnswer, choices: choices }; // 回傳題目文字、正確答案與選項
} // 結束數學題目產生函式
function getQuestionPanel() { // 計算題目視窗與選項按鈕的位置
  const panelWidth = width / 4; // 將題目視窗寬度設定為畫布寬度的四分之一
  const panelHeight = height / 4; // 將題目視窗高度設定為畫布高度的四分之一
  const panelX = (width - panelWidth) / 2; // 將題目視窗水平置中
  const panelY = height * (99 / 239) - panelHeight / 2; // 將題目視窗中心對齊背景黑板中央
  const padding = panelWidth * 0.06; // 設定題目視窗內側留白
  const gap = panelWidth * 0.04; // 設定答案按鈕之間的間距
  const buttonWidth = (panelWidth - padding * 2 - gap) / 2; // 計算每個答案按鈕的寬度
  const buttonHeight = panelHeight * 0.19; // 計算每個答案按鈕的高度
  return { x: panelX, y: panelY, width: panelWidth, height: panelHeight, padding: padding, gap: gap, buttonWidth: buttonWidth, buttonHeight: buttonHeight }; // 回傳題目視窗與按鈕尺寸位置
} // 結束題目視窗位置計算函式
function getAnswerButton(index) { // 依選項序號計算單一答案按鈕的範圍
  const panel = getQuestionPanel(); // 取得題目視窗與按鈕配置
  const column = index % 2; // 計算答案按鈕所在欄位
  const row = Math.floor(index / 2); // 計算答案按鈕所在列
  const x = panel.x + panel.padding + column * (panel.buttonWidth + panel.gap); // 計算答案按鈕左側位置
  const y = panel.y + panel.height * 0.52 + row * panel.height * 0.23; // 計算答案按鈕上方位置
  return { x: x, y: y, width: panel.buttonWidth, height: panel.buttonHeight }; // 回傳答案按鈕的矩形範圍
} // 結束答案按鈕範圍計算函式
function drawQuestionPanel() { // 繪製黃色半透明的數學選擇題視窗
  const panel = getQuestionPanel(); // 取得題目視窗的位置與尺寸
  push(); // 暫存畫布狀態以設定題目視窗樣式
  rectMode(CORNER); // 使用矩形左上角作為座標基準
  stroke(120, 90, 0, 180); // 設定題目框線顏色與透明度
  strokeWeight(2); // 設定題目框線粗細
  fill(255, 230, 0, 80); // 設定黃色背景並使用 80 的透明度
  rect(panel.x, panel.y, panel.width, panel.height, 12); // 繪製畫布寬高各四分之一的題目方框
  noStroke(); // 關閉文字與答案按鈕的外框
  fill(40); // 設定題目文字顏色
  textAlign(CENTER, CENTER); // 將題目文字水平與垂直置中
  textSize(Math.max(12, Math.min(20, panel.height * 0.11))); // 依題目視窗大小設定易讀的文字尺寸
  text("數學小挑戰", panel.x + panel.width / 2, panel.y + panel.height * 0.15); // 顯示數學練習標題
  textSize(Math.max(14, Math.min(24, panel.height * 0.14))); // 設定運算題目的文字尺寸
  text(currentQuestion.text, panel.x + panel.width / 2, panel.y + panel.height * 0.37); // 顯示目前的四則運算問題
  textSize(Math.max(12, Math.min(18, panel.height * 0.1))); // 設定答案選項的文字尺寸
  for (let index = 0; index < currentQuestion.choices.length; index += 1) { // 逐一繪製四個答案選項
    const button = getAnswerButton(index); // 取得目前答案按鈕的位置與尺寸
    fill(255, 255, 255, 210); // 設定答案按鈕的半透明白色底色
    rect(button.x, button.y, button.width, button.height, 6); // 繪製可點選的答案按鈕
    fill(30); // 設定答案數字的文字顏色
    text(`${index + 1}. ${currentQuestion.choices[index]}`, button.x + button.width / 2, button.y + button.height / 2); // 顯示答案選項文字
  } // 結束答案選項繪製
  pop(); // 還原畫布狀態
} // 結束題目視窗繪製函式
function mousePressed() { // 處理學生使用滑鼠點選答案
  if (interactionState !== "question") { // 只有題目顯示時才接受答案點選
    return; // 題目未顯示時不處理滑鼠點擊
  } // 結束答題狀態檢查
  for (let index = 0; index < currentQuestion.choices.length; index += 1) { // 檢查滑鼠是否點到其中一個答案
    const button = getAnswerButton(index); // 取得目前答案按鈕的位置與尺寸
    if (mouseX >= button.x && mouseX <= button.x + button.width && mouseY >= button.y && mouseY <= button.y + button.height) { // 判斷滑鼠是否位於答案按鈕內
      answerWasCorrect = currentQuestion.choices[index] === currentQuestion.answer; // 比對所選答案是否正確
      interactionState = "answered"; // 關閉題目視窗並開始播放角色 2 的結果動畫
      character2AnimationState = answerWasCorrect ? "correct" : "incorrect"; // 立即切換角色 2 到正確或錯誤動作
      character2AnimationFrameIndex = 0; // 從答題結果動作的第一張圖片開始播放
      character2AnimationFrameTick = 0; // 重設答題結果動作的圖片計時
      return; // 完成作答後停止檢查其他答案
    } // 結束滑鼠命中答案按鈕判斷
  } // 結束答案按鈕點擊檢查
} // 結束滑鼠點擊事件函式
function windowResized() { // 視窗大小改變時重新調整畫布
  resizeCanvas(windowWidth, windowHeight); // 讓畫布持續填滿整個視窗
} // 結束視窗尺寸調整函式
function keyPressed() { // 處理方向鍵按下時的瀏覽器預設行為
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) { // 檢查按下的是否為左右方向鍵
    return false; // 阻止方向鍵捲動網頁，保留角色控制功能
  } // 結束方向鍵預設行為處理
} // 結束按鍵事件函式
