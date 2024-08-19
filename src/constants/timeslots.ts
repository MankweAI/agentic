type AppointmentTimeSlots = {
  slot: string
}

export const APPOINTMENT_TIME_SLOTS: AppointmentTimeSlots[] = [
  {
    slot: '3:30pm',
  },
  {
    slot: '4:00pm',
  },
  {
    slot: '4:30pm',
  },
  {
    slot: '5:00pm',
  },
  {
    slot: '5:30pm',
  },
  {
    slot: '6:00pm',
  },
  
]





export function generateAppointmentTimeSlots(
  date?: Date
): AppointmentTimeSlots[] {
  const currentDate = date || new Date();
  const currentDay = currentDate.getDay();
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();
  const timeSlots: AppointmentTimeSlots[] = [];

  // Check if the date is in the past
  if (currentDate.getTime() < new Date().getTime()) {
    return timeSlots; // Return an empty array for past dates
  }

  // Check if the date is a weekday (Monday to Friday)
  if (currentDay >= 1 && currentDay <= 5) {
    // Define the start and end times for the appointment slots
    const startTime = 9; // 9:00 AM
    const endTime = 16; // 4:00 PM

    // Loop through each hour and generate time slots
    for (let hour = startTime; hour < endTime; hour++) {
      // Generate time slots for each hour (e.g., 9:00, 9:30, 10:00, etc.)
      for (let minute = 0; minute < 60; minute += 30) {
        const slotTime = new Date(currentDate);
        slotTime.setHours(hour);
        slotTime.setMinutes(minute);

        // Check if the time slot is in the future (i.e., not already passed)
        if (slotTime.getTime() > currentDate.getTime()) {
          timeSlots.push({
            slot: `${hour}:${minute.toString().padStart(2, "0")}${
              hour >= 12 ? "pm" : "am"
            }`,
          });
        }
      }
    }
  }

  return timeSlots;
}
