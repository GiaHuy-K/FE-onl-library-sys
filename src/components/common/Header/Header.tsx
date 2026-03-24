/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { Layout, Input, Button, Typography, ConfigProvider } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../config/useAuth";
import UserDropdown from "../UserDropdown";
import styles from "./Header.module.css";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchVal = params.get("search") || "";
    setKeyword(searchVal);
  }, [location.search]);

  const handleSearch = (value: string) => {
    const term = value.trim();
    const query = term ? `?search=${encodeURIComponent(term)}` : "";
    if (location.pathname === "/explore") {
      navigate(`/explore${query}`);
    } else {
      navigate(`/explore${query}`);
    }
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#FF6E61" } }}>
      <AntHeader className={styles.headerWrapper}>
        <div className={styles.container}>
          <div className={styles.logoBox} onClick={() => navigate("/")}>
            <Text className={styles.logoText}>LIB</Text>
          </div>

          <div className={styles.searchWrapper}>
            <Input
              placeholder="Tìm tên sách, tác giả..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onPressEnter={() => handleSearch(keyword)}
              className={styles.searchInput}
              suffix={
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={() => handleSearch(keyword)}
                  className={styles.searchBtn}
                />
              }
            />
          </div>

          <div className={styles.userWrapper}>
            {user ? (
              <UserDropdown />
            ) : (
              <Button
                onClick={() => navigate("/login")}
                ghost
                className={styles.loginBtn}
              >
                Đăng nhập
              </Button>
            )}
          </div>
        </div>
      </AntHeader>
    </ConfigProvider>
  );
};

export default Header;
