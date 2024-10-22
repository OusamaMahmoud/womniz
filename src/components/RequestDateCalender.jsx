import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";

const RequestDateCalender = ({ onSelectedDate }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const { t } = useTranslation();
  const formatDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formattedDate = formatDate(date);
    onSelectedDate(formattedDate);
  };

  return (
    <div className="flex space-x-4 z-50">
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        placeholderText={t("common:placeholders.date")}
        className="px-3 py-3  border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
  );
};

export default RequestDateCalender;
