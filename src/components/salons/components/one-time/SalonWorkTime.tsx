import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FormValues } from "../../pages/AddNewSalonForm";
import { Controller, useFormContext } from "react-hook-form";
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const SalonWorkTime = () => {
  const methods = useFormContext<FormValues>();

  return (
    <>
      {/* Work Start Day Dropdown */}
      <div>
        <label className="label font-semibold text-gray-700">
          Work Start Day
        </label>
        <Controller
          control={methods.control}
          name="workStartDay"
          render={({ field }) => (
            <select {...field} className="input input-bordered w-full">
              <option value="" disabled>
                Select start day
              </option>
              {weekdays.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          )}
        />
        {methods.formState.errors.workStartDay && (
          <p className="text-red-500 text-sm">
            {methods.formState.errors.workStartDay.message}
          </p>
        )}
      </div>
      <div className="mt-3">
        {/* Work End Day Dropdown */}
        <label className="label font-semibold text-gray-700">
          Work End Day
        </label>
        <Controller
          control={methods.control}
          name="workEndDay"
          render={({ field }) => (
            <select {...field} className="input input-bordered w-full">
              <option value="" disabled>
                Select end day
              </option>
              {weekdays.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          )}
        />
        {methods.formState.errors.workEndDay && (
          <p className="text-red-500 text-sm">
            {methods.formState.errors.workEndDay.message}
          </p>
        )}
      </div>
      <div className="mt-3">
        <label className="label font-semibold text-gray-700">
          Work Start Time
        </label>
        <Controller
          control={methods.control}
          name="workStartTime"
          render={({ field }) => (
            <DatePicker
              selected={field.value}
              onChange={(time: string) => field.onChange(time)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="HH:mm"
              placeholderText="Select start time"
              className="input input-bordered w-full"
            />
          )}
        />
        {methods.formState.errors.workStartTime && (
          <p className="text-red-500 text-sm  mt-2">
            {methods.formState.errors.workStartTime.message}
          </p>
        )}
      </div>

      <div className="mt-3">
        <label className="label font-semibold text-gray-700">
          Work End Time
        </label>
        <Controller
          control={methods.control}
          name="workEndTime"
          render={({ field }) => (
            <DatePicker
              selected={field.value}
              onChange={(time: string) => field.onChange(time)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="HH:mm"
              placeholderText="Select end time"
              className="input input-bordered grow"
            />
          )}
        />
        {methods.formState.errors.workEndTime && (
          <p className="text-red-500 text-sm mt-2">
            {methods.formState.errors.workEndTime.message}
          </p>
        )}
      </div>
    </>
  );
};

export default SalonWorkTime;
