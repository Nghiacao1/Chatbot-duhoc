function showMainMenu() {
    const chatBody = document.getElementById('chatBody');
    if (!chatBody) return;
  
    const menuDiv = document.createElement('div');
    menuDiv.className = "message bot-message";
    menuDiv.innerHTML = `
      Tôi có thể hỗ trợ bạn trực tiếp hoặc bạn có thể chọn các nội dung:
      <br>1️⃣ Nước du học
      <br>2️⃣ Ngành học
      <br>3️⃣ Nguồn học bổng
    `;
  
    chatBody.appendChild(menuDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }
function toggleChat() {
    const chat = document.getElementById('chatBox');
    chat.style.display = chat.style.display === 'flex' ? 'none' : 'flex';
  }

  function handleInput(event) {
    if (event.key === "Enter") {
      const input = document.getElementById('userInput');
      const message = input.value.trim();
      if (message) {
        appendMessage("user", message);
        input.value = "";
        sendToBot(message);
      }
    }
  }

  function appendMessage(sender, message) {
    const chatBody = document.getElementById('chatBody');
    const msg = document.createElement('div');
    msg.className = `message ${sender === "user" ? "user-message" : "bot-message"}`;

  // Nếu là bot, tự động chuyển xuống dòng cho các dấu gạch đầu dòng
  if (sender === "bot") {
    message = message
      .replace(/\n/g, "<br>")                      // Xuống dòng theo lệnh \n           
  }

  msg.innerHTML = message;
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;

  }
 
  async function sendToBot(message) {
    if (!chatBody) return;

  // Kiểm tra các lựa chọn đơn giản trước khi gọi API
  const trimmed = message.trim();
  if (["1", "2", "3"].includes(trimmed)) {
    let reply = "";
    if (trimmed === "1") reply = "Bạn muốn tìm hiểu về du học ở châu lục hoặc quốc gia nào? Ví dụ: Châu lục: Châu Âu, Châu Mỹ; Quốc gia: Mỹ, Canada...";
    if (trimmed === "2") reply = "Bạn quan tâm đến ngành học nào? Ví dụ: Công nghệ thông tin, Kinh doanh, Y khoa...";
    if (trimmed === "3") reply = "Bạn muốn tìm hiểu học bổng từ chính phủ, trường đại học hay tổ chức nào?";
    appendMessage("bot", reply);
    return;
  }
    // 👉 Nếu người dùng gõ "menu" → hiện lại menu
    if (trimmed.toLowerCase() === "menu") {
    showMainMenu();
    return;
  }

    const loadingMsg = document.createElement('div');
    loadingMsg.className = "message bot-message";
    loadingMsg.textContent = "🤖 Đang xử lý...";
    loadingMsg.id = "loading-message";
    chatBody.appendChild(loadingMsg);
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
         "Content-Type": "application/json",
         "Authorization": "Bearer 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",
         "HTTP-Referer": "https://blog-chatbot-6of6.onrender.com/",
         "X-Title": "Test Chatbot"
       },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          // max_tokens: 500,
          messages: [
            {
        role: "system",
        content: "Bạn là chuyên gia tư vấn du học. Chỉ trả lời các câu hỏi liên quan đến du học. QUY TẮC TRẢ LỜI:- Trả lời ngắn gọn, rõ ràng, không vượt quá 4-5 ý mỗi lần.- Trình bày từng ý bằng dấu gạch đầu dòng (-) hoặc số thứ tự (1., 2., 3.)- Không đưa ra quá nhiều thông tin một lúc. Nếu câu trả lời dài, chỉ trả lời phần đầu và gợi ý người dùng hỏi tiếp.- Tránh lặp lại, tránh văn bản dài liền mạch quá 5 dòng.- Nếu người dùng hỏi rộng, hãy chia nhỏ câu hỏi và hỏi lại họ muốn biết phần nào trước."
          },
          { role: "user", content: message }]
        })
      });
      const data = await response.json();

    console.log("🔥 Phản hồi từ OpenRouter:", data); // Debug xem có gì trả về

    const loadingElem = document.getElementById("loading-message");
    if (loadingElem) loadingElem.remove();

    if (response.ok && data.choices && data.choices.length > 0 && data.choices[0].message?.content) {
      const reply = data.choices[0].message.content;
      appendMessage("bot", reply);
    } else {
      appendMessage("bot", "🤖 Xin lỗi, hiện tại tôi chưa có phản hồi phù hợp.");
    }
  } catch (error) {
    const loadingElem = document.getElementById("loading-message");
    if (loadingElem) loadingElem.remove();
    appendMessage("bot", "⚠️ Có lỗi khi kết nối với chatbot.");
    console.error("❌ Lỗi fetch:", error);
  }
  const reply = data.choices?.[0]?.message?.content || "Không có phản hồi.";

// Cắt đoạn quá dài (ví dụ: 1000 ký tự)
const maxLength = 700;
const finalReply = reply.length > maxLength ? reply.slice(0, maxLength) + "...\n✂️ Trả lời quá dài, bạn muốn xem tiếp không?" : reply;

appendMessage("bot", finalReply);

}