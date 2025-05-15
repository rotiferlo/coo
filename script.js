// ✅ API Key
const API_KEY = 'AIzaSyDsjBTB4ouTE1sRJBNMLxyvP15gexa0oxA';

// DOM元素
const startVoiceBtn = document.getElementById('startVoice');
const statusDiv = document.getElementById('status');
const recognitionResultDiv = document.getElementById('recognitionResult');
const geminiResponseDiv = document.getElementById('geminiResponse');
const askGeminiBtn = document.getElementById('askGemini');

// 初始化語音辨識
let recognition = null;
let isListening = false;
let recognizedText = '';

// 語音辨識支援檢查
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'zh-TW';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
        recognitionResultDiv.textContent = '正在聆聽貓咪的聲音...';
        startVoiceBtn.classList.add('listening');
        isListening = true;
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
                recognizedText += transcript + ' ';
                recognitionResultDiv.textContent = recognizedText;
                askGeminiBtn.disabled = false;
            } else {
                interimTranscript += transcript;
                recognitionResultDiv.innerHTML = recognizedText +
                    '<span style="color: #999;">' + interimTranscript + '</span>';
            }
        }
    };

    recognition.onerror = (event) => {
        recognitionResultDiv.textContent = `錯誤: ${event.error}`;
        recognitionResultDiv.classList.add('error');
        startVoiceBtn.classList.remove('listening');
        isListening = false;
    };

    recognition.onend = () => {
        if (isListening) {
            startVoiceBtn.classList.remove('listening');
            isListening = false;
        }
    };
} else {
    recognitionResultDiv.textContent = '您的瀏覽器不支援錄音功能';
    recognitionResultDiv.classList.add('error');
    startVoiceBtn.disabled = true;
}

// 開始/停止錄音
startVoiceBtn.addEventListener('click', () => {
    if (isListening) {
        recognition.stop();
        recognitionResultDiv.textContent = '錄音已停止';
        startVoiceBtn.classList.remove('listening');
        isListening = false;
    } else {
        try {
            recognizedText = ''; // 重置已辨識的文字
            recognition.start();
        } catch (error) {
            console.error('啟動錄音錯誤:', error);
            recognitionResultDiv.textContent = `啟動錄音失敗: ${error.message}`;
            recognitionResultDiv.classList.add('error');
        }
    }
});

// 啟動 Gemini API 呼叫
askGeminiBtn.addEventListener('click', async () => {
    if (!recognizedText) {
        geminiResponseDiv.textContent = '請先錄製貓咪的聲音！';
        return;
    }

    try {
        geminiResponseDiv.textContent = '正在分析貓咪叫聲...';
        askGeminiBtn.disabled = true;

        const response = await callGeminiAPI(recognizedText);
        geminiResponseDiv.textContent = response;
        askGeminiBtn.disabled = false;
    } catch (error) {
        console.error('分析錯誤:', error);
        geminiResponseDiv.textContent = `分析錯誤: ${error.message}`;
        geminiResponseDiv.classList.add('error');
        askGeminiBtn.disabled = false;
    }
});

// 呼叫 Gemini API
async function callGeminiAPI(text) {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    const prompt = `
作為一個專業的貓咪行為分析師，請分析以下錄製到的貓咪叫聲特徵並解釋其含義：

聲音描述：${text}

請從以下幾個方面進行分析：
1. 聲音類型（例如：喵喵叫、呼嚕聲、嘶叫等）
2. 聲音特徵（音調高低、持續時間、音量大小等）
3. 這種叫聲通常代表什麼情緒或需求
4. 建議的回應方式

請用專業但容易理解的方式說明，讓飼主能更了解自己的貓咪。`;

    const payload = {
        contents: [{ 
            parts: [{ 
                text: prompt 
            }] 
        }]
    };

    const response = await fetch(`${url}?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`分析失敗: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    return candidate?.content?.parts?.[0]?.text || candidate?.text || '抱歉，我無法分析這段聲音...';
}
