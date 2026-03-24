/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import {
  Button,
  Input,
  List,
  Avatar,
  Spin,
  Space,
  FloatButton,
  Card,
  message,
} from "antd";
import {
  SendOutlined,
  SmileOutlined,
  UserOutlined,
  MessageOutlined,
  CloseOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { chatService } from "../../services/chatAI.service";

interface Message {
  role: "user" | "ai";
  content: string;
}

function ChatAIWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "Chào bạn, pé thủ thư AI đây! Bạn cần tìm sách hay giải đáp kiến thức gì không?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  useEffect(() => {
    const initChatSession = async () => {
      if (open && !conversationId && !isInitializing) {
        setIsInitializing(true);
        try {
          const res = await chatService.initRAG();
          const id = typeof res === "string" ? res : res.conversationId;
          setConversationId(id);
          console.log("Chat Session Initialized:", id);
        } catch (error) {
          message.error("Không thể kết nối với pé thủ thư, vui lòng thử lại!");
        } finally {
          setIsInitializing(false);
        }
      }
    };
    initChatSession();
  }, [open, conversationId, isInitializing]);

  const handleSend = async () => {
    if (!inputValue.trim() || loading || !conversationId) return;

    const userMsg: Message = { role: "user", content: inputValue };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await chatService.sendPrompt(conversationId, inputValue);
      
      const aiMsg: Message = { 
        role: "ai", 
        content: response.content || "Pé đang bối rối, bạn hỏi lại được không?" 
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Hệ thống đang bảo trì, pé sẽ quay lại sau ít phút ạ!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FloatButton
        icon={<MessageOutlined />}
        type="primary"
        style={{ right: 24, bottom: 24, width: 60, height: 60 }}
        onClick={() => setOpen(!open)}
        badge={{ dot: true, color: "#52c41a" }}
      />

      {open && (
        <Card
          title={
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>
                <ThunderboltOutlined style={{ marginRight: 8, color: "#1677ff" }} /> 
                AI Assistant
              </span>
              <Button type="text" icon={<CloseOutlined />} onClick={() => setOpen(false)} />
            </div>
          }
          style={{
            position: "fixed",
            right: 24,
            bottom: 100,
            width: 360,
            height: 480,
            zIndex: 1000,
            boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
            borderRadius: 20,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
          bodyStyle={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "12px",
            overflow: "hidden",
          }}
        >
          <div
            style={{ flex: 1, overflowY: "auto", marginBottom: 12, paddingRight: 4 }}
            ref={scrollRef}
          >
            <List
              dataSource={messages}
              renderItem={(item) => (
                <div style={{ textAlign: item.role === "user" ? "right" : "left", marginBottom: 16 }}>
                  <Space
                    align="start"
                    direction="horizontal"
                    size={8}
                    style={item.role === "user" ? { flexDirection: "row-reverse" } : {}}
                  >
                    <Avatar
                      size="small"
                      icon={item.role === "user" ? <UserOutlined /> : <SmileOutlined />}
                      style={{
                        backgroundColor: item.role === "user" ? "#52c41a" : "#1677ff",
                        marginTop: 4,
                      }}
                    />
                    <div
                      style={{
                        display: "inline-block",
                        padding: "10px 14px",
                        borderRadius: 16,
                        backgroundColor: item.role === "user" ? "#ff7875" : "#f0f2f5",
                        color: item.role === "user" ? "#fff" : "#000",
                        maxWidth: "80%",
                        fontSize: "13.5px",
                        textAlign: "left",
                        lineHeight: "1.5",
                      }}
                    >
                      {item.content}
                    </div>
                  </Space>
                </div>
              )}
            />
            
            {(loading || isInitializing) && (
              <div style={{ textAlign: "left", marginLeft: 40, marginTop: 10 }}>
                <Spin size="small" tip={isInitializing ? "Đang kết nối..." : "Pé đang lật sách..."} />
              </div>
            )}
          </div>

          <Space.Compact style={{ width: "100%" }}>
            <Input
              placeholder={conversationId ? "Hỏi pé về sách..." : "Đang kết nối server..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onPressEnter={handleSend}
              disabled={loading || !conversationId}
              style={{ borderRadius: "8px 0 0 8px" }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              loading={loading}
              disabled={!conversationId}
              style={{ borderRadius: "0 8px 8px 0" }}
            />
          </Space.Compact>
        </Card>
      )}
    </>
  );
}

export default ChatAIWidget;