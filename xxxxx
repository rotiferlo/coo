const int trigPin = 9;    // 超音波感測器 Trig 接腳
const int echoPin = 10;   // 超音波感測器 Echo 接腳
const int ledPin = 6;     // LED 接腳

// 定義偵測距離（單位：公分）
const int DETECT_DISTANCE = 30;  // 當物體距離小於30公分時點亮LED

void setup() {
  pinMode(trigPin, OUTPUT);    // 設定Trig為輸出
  pinMode(echoPin, INPUT);     // 設定Echo為輸入
  pinMode(ledPin, OUTPUT);     // 設定LED為輸出
  Serial.begin(9600);          // 啟動序列埠監控
}

void loop() {
  // 發送超音波
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  // 接收超音波並計算距離
  long duration = pulseIn(echoPin, HIGH);  // 讀取時間差
  int distance = duration * 0.034 / 2;     // 換算成公分
  
  // 顯示距離
  Serial.print("距離: ");
  Serial.print(distance);
  Serial.println(" 公分");
  
  // 當物體距離小於設定值時點亮LED
  if (distance < DETECT_DISTANCE && distance > 0) {
    digitalWrite(ledPin, HIGH);  // 開燈
    Serial.println("偵測到物體！");
  } else {
    digitalWrite(ledPin, LOW);   // 關燈
  }
  
  delay(100);  // 短暫延遲，避免讀取太頻繁
}
