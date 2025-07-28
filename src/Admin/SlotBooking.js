import React, { useState, useEffect } from "react";
import moment from "moment";
import { useLocation } from "react-router-dom";
import { AiOutlineCaretLeft, AiFillCaretRight } from "react-icons/ai";
import emailjs from '@emailjs/browser';

const SlotBooking = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const location = useLocation();
  const userDetails = location.state;

  console.log("names",userDetails);

  const emailsOnly = userDetails.map(user => user.email);
  const idsOnly = userDetails.map(user => user.userid);
  const userName = userDetails.map(user => user.name);

  console.log("emailOnly",emailsOnly);



  useEffect(() => {
    generateSlots("10:00 am", "7:00 pm");
  }, [currentDate]);

  const generateSlots = (startTime, endTime) => {
    let start = moment(startTime, "hh:mm a");
    let end = moment(endTime, "hh:mm a");

    start.minutes(Math.ceil(start.minutes() / 30) * 30);
    let current = moment(start);
    const newSlots = [];

    while (current <= end) {
      newSlots.push(current.format("hh:mm a"));
      current.add(30, "minutes");
    }

    setSlots(newSlots);
  };

  const handleSelect = (time) => {
    setSelectedSlot(time);
  };

  const handleConfirm = () => {
    if (!selectedSlot) {
      alert("Please select a time slot.");
      return;
    }

    const newEntry = {
      date: currentDate.toDateString(),
      time: selectedSlot,
      userId: idsOnly,
      email: emailsOnly,
      name:userName
    };

    const existingData = JSON.parse(localStorage.getItem("selectedTimeSlot")) || [];

    // Prevent duplicate booking for same day and user
    const alreadyBooked = existingData.some(item =>
      item.date === newEntry.date &&
      JSON.stringify(item.userId) === JSON.stringify(newEntry.userId)
    );

    if (alreadyBooked) {
      alert(`You have already booked a slot on ${newEntry.date}.`);
      return;
    }

    existingData.push(newEntry);
    localStorage.setItem("selectedTimeSlot", JSON.stringify(existingData));
    // alert(`Slot booked at ${selectedSlot} on ${currentDate.toDateString()}.`);
    setSelectedSlot(null);

    userDetails.forEach((user) => {
  const templateParams = {
    user_id: user.userid,
    user_email: user.email,
    user_name: user.name,
    exam_date: newEntry.date,
    exam_time: newEntry.time
  };

  emailjs.send(
    'service_265up8s',
    'template_7iwc7ag',
    templateParams,
    'ytVQOvAzM3lSEX8Sa'
  )
  .then((response) => {
    console.log('Email sent to', user.email, response.status);
    alert('Email has been send successfully');
  })
  .catch((error) => {
    console.error('Failed to send email to', user.email, error);
  });
});

  
  
  };

  const handleNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
    setCurrentDate(nextDay);
    setSelectedSlot(null);
  };

  const handlePreviousDay = () => {
    const prevDay = new Date(currentDate);
    prevDay.setDate(currentDate.getDate() - 1);
    setCurrentDate(prevDay);
    setSelectedSlot(null);
  };

  const isToday = (someDate) => {
    const today = new Date();
    return (
      someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
    );
  };

  const styles = {
    wrapper: {
      maxWidth: "800px",
      margin: "40px auto",
      padding: "30px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      fontFamily: "Segoe UI, sans-serif",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#1c3681",
      textAlign: "center",
      marginBottom: "10px",
    },
    dateText: {
      textAlign: "center",
      fontSize: "18px",
    },
    navButtons: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: "10px",
    },
    navButton: {
      padding: "8px 14px",
      backgroundColor: "#1c3681",
      color: "white",
      border: "none",
      borderRadius: "6px",
      margin: "0 5px",
      cursor: "pointer",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
      gap: "16px",
      marginTop: "20px",
    },
    slotCard: (isSelected) => ({
      padding: "15px",
      border: isSelected ? "2px solid #1c3681" : "2px solid #ccc",
      borderRadius: "10px",
      textAlign: "center",
      backgroundColor: isSelected ? "#1c3681" : "#f9f9f9",
      color: isSelected ? "#fff" : "#333",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      fontWeight: 500,
    }),
    confirmButton: {
      marginTop: "30px",
      padding: "12px 25px",
      fontSize: "16px",
      backgroundColor: "#1c3681",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
    },
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Choose Your Time Slot</h2>
      <div style={styles.navButtons}>
        {!isToday(currentDate) && (
          <button style={styles.navButton} onClick={handlePreviousDay}>
            <AiOutlineCaretLeft />
          </button>
        )}
        <div style={styles.dateText}>{currentDate.toDateString()}</div>
        <button style={styles.navButton} onClick={handleNextDay}>
          <AiFillCaretRight />
        </button>
      </div>

      <div style={styles.grid}>
        {slots.length > 0 ? (
          slots.map((time, index) => (
            <div
              key={index}
              onClick={() => handleSelect(time)}
              style={styles.slotCard(selectedSlot === time)}
            >
              {time}
            </div>
          ))
        ) : (
          <p>No slots generated.</p>
        )}
      </div>

      <button style={styles.confirmButton} onClick={handleConfirm}>
        Confirm Time Slot
      </button>
    </div>
  );
};

export default SlotBooking;
