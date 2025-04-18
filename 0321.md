# 簡單警報系統

這是一個使用Arduino UNO製作的簡單警報系統。當開關被觸發時，蜂鳴器會發出聲音，LED會閃爍。

## 所需元件
- Arduino UNO x 1
- 微動開關或水銀開關 x 1
- LED x 1
- 1KΩ電阻 x 1
- 有源一體電磁式蜂鳴器 x 1
- 面包板 x 1
- 杜邦線若干

## 電路連接
1. **微動開關或水銀開關**：
   - 一端連接到Arduino的GND（接地）。
   - 另一端連接到Arduino的數字引腳2。

2. **LED**：
   - LED的正極（長腳）連接到Arduino的數字引腳13。
   - LED的負極（短腳）連接到1KΩ電阻的一端。
   - 1KΩ電阻的另一端連接到Arduino的GND。

3. **蜂鳴器**：
   - 蜂鳴器的正極連接到Arduino的數字引腳12。
   - 蜂鳴器的負極連接到Arduino的GND。

## 程式碼
以下是Arduino程式碼，當開關被觸發時，蜂鳴器會發出聲音，LED會閃爍：

```cpp
const int switchPin = 2;    // 開關連接到數字引腳2
const int ledPin = 13;      // LED連接到數字引腳13
const int buzzerPin = 12;   // 蜂鳴器連接到數字引腳12

void setup() {
  pinMode(switchPin, INPUT_PULLUP); // 設置開關引腳為輸入並啟用內部上拉電阻
  pinMode(ledPin, OUTPUT);          // 設置LED引腳為輸出
  pinMode(buzzerPin, OUTPUT);       // 設置蜂鳴器引腳為輸出
}

void loop() {
  int switchState = digitalRead(switchPin); // 讀取開關狀態

  if (switchState == LOW) { // 如果開關被觸發
    digitalWrite(ledPin, HIGH);  // 打開LED
    digitalWrite(buzzerPin, HIGH); // 打開蜂鳴器
  } else {
    digitalWrite(ledPin, LOW);   // 關閉LED
    digitalWrite(buzzerPin, LOW); // 關閉蜂鳴器
  }
}
```

## 使用方法
1. 按照上述電路連接圖進行連接。
2. 將程式碼上傳到Arduino UNO。
3. 當開關被觸發時，LED會亮起，蜂鳴器會發出聲音。
