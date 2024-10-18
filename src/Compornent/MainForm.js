import React, { useEffect, useState } from "react";
import "./css/MainForm.css";
import axios from "axios";
import { useParams } from "react-router-dom";

function MainForm() {
  const [attend, setAttend] = useState(null);
  const [breakTime, setBreakTime] = useState(null);
  const [breakEnd, setBreakEnd] = useState(null);
  const [leaving, setLeaving] = useState(null);
  const [date, setDate] = useState(new Date());
  const [text, setText] = useState("");
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const { id } = useParams();

  // const EmployeeId = 125;

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const timeString = new Date().toLocaleTimeString();
      setText(timeString);
    }, 1000);

    return () => clearInterval(timer);
  }, [isMessageVisible]);

  const handleClick = async (event) => {
    const time = new Date();
    setDate(new Date());

    const buttonName = event.target.name;
    let message = "";

    switch (buttonName) {
      case "attend":
        message = "おはようございます！";
        setAttend(time);
        break;
      case "break":
        message = "行ってらっしゃい！";
        setBreakTime(time);
        break;
      case "break-end":
        message = "お帰りなさい！";
        setBreakEnd(time);
        break;
      case "leaving":
        message = "お疲れ様でした！";
        setLeaving(time);
        break;
      default:
        return;
    }

    setText(message);
    setIsMessageVisible(true);
    setTimeout(() => {
      setIsMessageVisible(false);
    }, 2000);

    // APIリクエストを送信
    await handlePost(time, buttonName);
  };

  const handlePost = async (time, buttonName) => {
    try {
      // 現在の時間を取得
      const currentAttend =
        buttonName === "attend"
          ? formatTime(time)
          : attend
          ? formatTime(attend)
          : null;
      const currentBreakTime =
        buttonName === "break"
          ? formatTime(time)
          : breakTime
          ? formatTime(breakTime)
          : null;
      const currentBreakEnd =
        buttonName === "break-end"
          ? formatTime(time)
          : breakEnd
          ? formatTime(breakEnd)
          : null;
      const currentLeaving =
        buttonName === "leaving"
          ? formatTime(time)
          : leaving
          ? formatTime(leaving)
          : null;

      const response = await axios.post(
        `https://mainformwebapp.azurewebsites.net/api/TimeAttendance/post/${id}`,
        {
          // EmployeeId: EmployeeId,
          CheckInTime: currentAttend,
          CheckOutTime: currentBreakTime,
          BreakTime: currentBreakEnd,
          BreakEndTime: currentLeaving,
          Date: date.toISOString().split("T")[0],
          info: "出勤管理情報",
        }
      );
      alert("登録しました");
      console.log(response.data);
      console.log(attend);
      console.log(breakTime);
      console.log(breakEnd);
      console.log(leaving);
      console.log(date);
    } catch (err) {
      alert("登録に失敗しました");
      console.error(err.response.data);
      console.log(attend);
      console.log(breakTime);
      console.log(breakEnd);
      console.log(leaving);
      console.log(date);
    }
  };

  return (
    <div className="main-container">
      <h1 className="main-title">勤怠管理システム</h1>
      <div className="main-contents">
        <div className="attend">
          <button onClick={handleClick} type="submit" name="attend">
            出勤
          </button>
        </div>
        <div className="break">
          <button onClick={handleClick} type="submit" name="break">
            休憩
          </button>
        </div>
        <div className="break-end">
          <button onClick={handleClick} type="submit" name="break-end">
            休憩終了
          </button>
        </div>
        <div className="leaving">
          <button onClick={handleClick} type="submit" name="leaving">
            退勤
          </button>
        </div>
      </div>
      <div className="messageOrTime">{text}</div>
    </div>
  );
}

export default MainForm;
